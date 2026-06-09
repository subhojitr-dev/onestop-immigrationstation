/**
 * GET /api/cron/uscis-rss
 *
 * Vercel Cron Job — runs daily at 06:00 UTC.
 *
 * 1. Fetches the 2 most important USCIS RSS feeds
 * 2. Inserts new items as blog_post drafts (post_type='uscis_news', is_published=false)
 * 3. Skips items that already exist (checked by source_url)
 * 4. Auto-deletes posts older than 1 year
 * 5. Emails admin if new drafts were imported
 *
 * Protected by CRON_SECRET env variable (set in Vercel project settings).
 * On localhost, call without the header for manual testing.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ── USCIS RSS Feeds (2 most important) ─────────────────────────────────────
const FEEDS = [
  {
    name: 'USCIS Newsroom',
    url: 'https://www.uscis.gov/newsroom/all-news/rss',
    category: 'USCIS Updates',
  },
  {
    name: 'USCIS Alerts',
    url: 'https://www.uscis.gov/newsroom/alerts/rss',
    category: 'USCIS Updates',
  },
]

// ── Simple RSS XML parser (no external deps) ────────────────────────────────
interface RssItem {
  title: string
  link: string
  description: string
  pubDate: string | null
}

function parseRss(xml: string): RssItem[] {
  const items: RssItem[] = []
  const matches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g)
  for (const match of matches) {
    const raw = match[1]
    const get = (tag: string) => {
      // Handle CDATA: <tag><![CDATA[...]]></tag>  OR  <tag>...</tag>
      const m = raw.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'))
      return m?.[1]?.trim() ?? ''
    }
    const title = get('title')
    // <link> in RSS is sometimes after CDATA, sometimes plain text
    const link = raw.match(/<link>([^<]+)<\/link>/)?.[1]?.trim()
              || raw.match(/<guid[^>]*>([^<]+)<\/guid>/)?.[1]?.trim()
              || ''
    const description = get('description')
    const pubDate = raw.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1]?.trim() ?? null

    if (title && link) {
      items.push({ title, link, description, pubDate })
    }
  }
  return items
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70)
}

// ── Main handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Authorization check — Vercel sends Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const admin = createAdminClient()
  let totalInserted = 0
  let totalDeleted  = 0
  const errors: string[] = []

  // ── Step 1: Auto-delete posts older than 1 year ───────────────────────────
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
  const { count: deletedCount } = await admin
    .from('blog_posts')
    .delete({ count: 'exact' })
    .eq('post_type', 'uscis_news')
    .lt('published_at', oneYearAgo)
  totalDeleted = deletedCount ?? 0

  // ── Step 2: Fetch existing source_urls to skip duplicates ─────────────────
  const { data: existingRows } = await admin
    .from('blog_posts')
    .select('source_url')
    .not('source_url', 'is', null)
  const existingUrls = new Set((existingRows ?? []).map((r: any) => r.source_url))

  // ── Step 3: Fetch and insert each feed ────────────────────────────────────
  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'OneStopImmigrationStation/1.0 (+https://onestop-immigrationstation-web.vercel.app)' },
        signal: AbortSignal.timeout(10_000),
      })
      if (!res.ok) {
        errors.push(`${feed.name}: HTTP ${res.status}`)
        continue
      }
      const xml  = await res.text()
      const items = parseRss(xml).slice(0, 10) // max 10 per feed per run

      for (const item of items) {
        if (existingUrls.has(item.link)) continue // already imported

        const slug = slugify(item.title)
        // Strip HTML tags from description for clean excerpt
        const excerpt = item.description
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 300)

        const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()

        const { error: insertErr } = await admin.from('blog_posts').upsert({
          title:       item.title,
          slug:        slug,
          post_type:   'uscis_news',
          category:    feed.category,
          excerpt:     excerpt || null,
          content:     excerpt || item.title,
          author_name: 'USCIS',
          is_published: false,
          source_url:  item.link,
          published_at: pubDate,
          created_at:  new Date().toISOString(),
          updated_at:  new Date().toISOString(),
          tags:        ['USCIS', 'Immigration News'],
        }, { onConflict: 'slug', ignoreDuplicates: true })

        if (insertErr) {
          errors.push(`Insert error for "${item.title}": ${insertErr.message}`)
        } else {
          existingUrls.add(item.link)
          totalInserted++
        }
      }
    } catch (err) {
      errors.push(`${feed.name}: ${String(err)}`)
    }
  }

  // ── Step 4: Email admin if new drafts were imported ───────────────────────
  if (totalInserted > 0) {
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onestop-immigrationstation-web.vercel.app'
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'One Stop Immigration Station <noreply@onestopimmigrationstation.com>',
          to: ['admin@onestopimmigrationstation.com'],
          subject: `${totalInserted} new USCIS draft${totalInserted > 1 ? 's' : ''} awaiting review`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e7e9f0">
              <div style="background:linear-gradient(135deg,#1a2744,#243355);padding:24px;text-align:center">
                <div style="color:#cfa94a;font-size:18px;font-weight:700">One Stop Immigration Station</div>
              </div>
              <div style="padding:28px">
                <h2 style="color:#1a2744;margin:0 0 12px">🏛️ ${totalInserted} New USCIS Draft${totalInserted > 1 ? 's' : ''}</h2>
                <p style="color:#586176;margin:0 0 20px">New USCIS news items have been automatically imported and are waiting for your review before publishing.</p>
                <div style="text-align:center">
                  <a href="${siteUrl}/admin/blog" style="background:linear-gradient(135deg,#cfa94a,#b8952a);color:#0b1322;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block">
                    Review Drafts →
                  </a>
                </div>
                <p style="color:#98a0b0;font-size:12px;margin:20px 0 0;text-align:center">
                  Filter by "USCIS" type in the Blog CMS to see all pending drafts.
                  ${totalDeleted > 0 ? `<br>${totalDeleted} post${totalDeleted > 1 ? 's' : ''} older than 1 year were automatically removed.` : ''}
                </p>
              </div>
            </div>
          `,
        }),
      }).catch(() => {})
    }
  }

  return NextResponse.json({
    ok: true,
    inserted: totalInserted,
    deleted: totalDeleted,
    errors: errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString(),
  })
}
