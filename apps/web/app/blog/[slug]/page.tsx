/**
 * app/blog/[slug]/page.tsx
 *
 * Dynamic blog post page — fetches a single published post from Supabase by slug.
 * Slug is the URL-friendly version of the title set when the post is created.
 * Example: /blog/h1b-lottery-changes-2025
 *
 * Renders the full post content. Returns 404 if slug not found or post not published.
 */
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('blog_posts').select('title, excerpt').eq('slug', slug).eq('is_published', true).single()
  if (!post) return { title: 'Post Not Found' }
  return { title: `${post.title} — One Stop Immigration Station`, description: post.excerpt || undefined }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  // Fetch 3 other recent posts for the "More Articles" sidebar
  const { data: related } = await supabase
    .from('blog_posts')
    .select('id, title, slug, category, published_at')
    .eq('is_published', true)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(4)

  return (
    <>
      {/* Nav is in the public layout — just the content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#586176' }}>
          <Link href="/" style={{ color: '#586176', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/blog" style={{ color: '#586176', textDecoration: 'none' }}>Blog</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: '#1a2744' }}>{post.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', alignItems: 'start' }}>
          {/* ── Article ── */}
          <article>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ background: '#e8effe', color: '#1d4ed8', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>
                {post.category}
              </span>
            </div>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: '32px', color: '#1a2744', margin: '12px 0 16px', lineHeight: 1.3 }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#98a0b0', marginBottom: '28px' }}>
              <span>By {post.author_name || 'OSIS Editorial Team'}</span>
              <span>·</span>
              <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Draft'}</span>
            </div>

            {post.featured_image && (
              <img src={post.featured_image} alt={post.title}
                style={{ width: '100%', borderRadius: '12px', marginBottom: '28px', maxHeight: '400px', objectFit: 'cover' }} />
            )}

            {/* Render content — stored as plain text with newlines */}
            <div style={{ fontSize: '16px', color: '#2d3748', lineHeight: 1.8 }}>
              {post.content.split('\n').map((para: string, i: number) =>
                para.trim() ? <p key={i} style={{ margin: '0 0 16px' }}>{para}</p> : <br key={i} />
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #e7e9f0' }}>
                <span style={{ fontSize: '13px', color: '#98a0b0', marginRight: '8px' }}>Tags:</span>
                {post.tags.map((tag: string) => (
                  <span key={tag} style={{ background: '#f4f6fb', color: '#586176', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', marginRight: '6px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div style={{ marginTop: '32px', background: 'linear-gradient(135deg,#1a2744,#243355)', borderRadius: '16px', padding: '28px 32px' }}>
              <h3 style={{ fontFamily: 'Lora, serif', color: '#cfa94a', margin: '0 0 8px', fontSize: '20px' }}>
                Questions about your case?
              </h3>
              <p style={{ color: 'rgba(255,255,255,.75)', margin: '0 0 20px', fontSize: '15px', lineHeight: 1.6 }}>
                Our attorneys can review your situation and advise on the best path forward.
              </p>
              <Link href="/login" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#cfa94a,#b8952a)', color: '#0b1322', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
                Get Started Today
              </Link>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside style={{ position: 'sticky', top: '88px' }}>
            <div style={{ background: '#fff', borderRadius: '14px', padding: '22px', border: '1px solid #e7e9f0', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Lora, serif', fontSize: '16px', color: '#1a2744', margin: '0 0 16px' }}>More Articles</h3>
              {related?.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid #f4f6fb' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a2744', lineHeight: 1.4, marginBottom: '4px' }}>{r.title}</div>
                    <div style={{ fontSize: '11px', color: '#98a0b0' }}>
                      {r.category} · {r.published_at ? new Date(r.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/blog" style={{ display: 'block', marginTop: '12px', fontSize: '13px', color: '#b8952a', fontWeight: 600, textDecoration: 'none' }}>
                View all articles →
              </Link>
            </div>

            <div style={{ background: 'linear-gradient(150deg,#243355,#16223d)', borderRadius: '14px', padding: '22px' }}>
              <h3 style={{ fontFamily: 'Lora, serif', color: '#fff', margin: '0 0 8px', fontSize: '17px' }}>Free Consultation</h3>
              <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px' }}>
                Speak with one of our bilingual attorneys — no obligation.
              </p>
              <Link href="/login" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg,#cfa94a,#b8952a)', color: '#0b1322', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>
                Book Free Consultation
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
