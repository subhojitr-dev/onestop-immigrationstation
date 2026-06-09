/**
 * app/admin/blog/BlogPostForm.tsx
 *
 * Shared client component for creating and editing blog posts.
 * Used by both /admin/blog/new and /admin/blog/[id].
 *
 * Post types:
 *   article       → publishes to /blog
 *   youtube_video → admin pastes YouTube URL → publishes to /videos
 *   uscis_news    → auto-imported from USCIS RSS as draft; admin reviews/publishes → /blog
 */
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Policy & News', 'USCIS Updates', 'H-1B', 'Green Card', 'Family Immigration', 'Court Decisions', 'Workplace', 'Employer Compliance', 'General']

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

/** Convert any YouTube URL to an embed URL */
function toYouTubeEmbed(url: string): string | null {
  if (!url) return null
  // youtu.be/ID
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (short) return `https://www.youtube.com/embed/${short[1]}`
  // youtube.com/watch?v=ID
  const long = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (long) return `https://www.youtube.com/embed/${long[1]}`
  // Already an embed URL
  if (url.includes('youtube.com/embed/')) return url
  return null
}

const POST_TYPE_CONFIG = {
  article:       { label: 'Article',      color: '#1d4ed8', bg: '#e8effe', icon: '📝', hint: 'Appears on /blog page' },
  youtube_video: { label: 'YouTube Video', color: '#b42318', bg: '#fdeceb', icon: '▶️', hint: 'Appears on /videos page with embedded player' },
  uscis_news:    { label: 'USCIS News',   color: '#047857', bg: '#e6f6ef', icon: '🏛️', hint: 'Appears on /blog — auto-imported from USCIS RSS. Always saved as draft first.' },
} as const

type PostType = keyof typeof POST_TYPE_CONFIG

interface Props {
  post?: {
    id: string; title: string; slug: string; excerpt: string; content: string
    author_name: string; category: string; featured_image: string; tags: string[]
    is_published: boolean; post_type?: string; youtube_url?: string | null
  }
}

export default function BlogPostForm({ post }: Props) {
  const router = useRouter()
  const isEdit = !!post

  const [postType, setPostType]   = useState<PostType>((post?.post_type as PostType) ?? 'article')
  const [title, setTitle]         = useState(post?.title ?? '')
  const [slug, setSlug]           = useState(post?.slug ?? '')
  const [category, setCategory]   = useState(post?.category ?? 'Policy & News')
  const [author, setAuthor]       = useState(post?.author_name ?? '')
  const [excerpt, setExcerpt]     = useState(post?.excerpt ?? '')
  const [content, setContent]     = useState(post?.content ?? '')
  const [image, setImage]         = useState(post?.featured_image ?? '')
  const [tags, setTags]           = useState(post?.tags?.join(', ') ?? '')
  const [youtubeUrl, setYoutubeUrl] = useState(post?.youtube_url ?? '')
  const [publish, setPublish]     = useState(post?.is_published ?? false)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const typeConfig = POST_TYPE_CONFIG[postType]
  const isVideo   = postType === 'youtube_video'
  const isUscis   = postType === 'uscis_news'
  const embedUrl  = toYouTubeEmbed(youtubeUrl)

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!isEdit) setSlug(slugify(val))
  }

  function handlePostTypeChange(val: PostType) {
    setPostType(val)
    // USCIS news always starts as draft
    if (val === 'uscis_news') setPublish(false)
  }

  async function handleSave() {
    if (!title.trim()) { setError('Title is required.'); return }
    if (!slug.trim()) { setError('Slug is required.'); return }
    if (isVideo && !youtubeUrl.trim()) { setError('YouTube URL is required for video posts.'); return }
    if (isVideo && !embedUrl) { setError('Could not parse YouTube URL — paste the full youtube.com/watch?v= or youtu.be/ link.'); return }
    if (!isVideo && !content.trim()) { setError('Content is required.'); return }

    setSaving(true)
    setError('')

    const supabase = createClient()
    const payload: Record<string, any> = {
      title: title.trim(),
      slug: slug.trim(),
      post_type: postType,
      excerpt: excerpt.trim() || null,
      content: isVideo ? (excerpt.trim() || title.trim()) : content.trim(),
      author_name: author.trim() || 'OSIS Editorial Team',
      category,
      featured_image: image.trim() || null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      youtube_url: isVideo ? youtubeUrl.trim() : null,
      is_published: isUscis ? false : publish,
      published_at: (!isUscis && publish) ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    let err
    if (isEdit) {
      ({ error: err } = await supabase.from('blog_posts').update(payload).eq('id', post!.id))
    } else {
      ({ error: err } = await supabase.from('blog_posts').insert(payload))
    }

    if (err) { setError(err.message); setSaving(false); return }
    router.push('/admin/blog')
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e7e9f0',
    borderRadius: '10px', fontFamily: 'inherit', fontSize: '14px',
    color: '#16203a', outline: 'none', background: '#fff', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: 600, color: '#16203a', marginBottom: '6px',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>
      {/* ── Main content ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && <div style={{ background: '#fdeceb', color: '#b42318', borderRadius: '8px', padding: '12px 16px', fontSize: '14px' }}>{error}</div>}

        {/* Post Type Selector */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e7e9f0' }}>
          <label style={{ ...labelStyle, marginBottom: '10px' }}>Post Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {(Object.entries(POST_TYPE_CONFIG) as [PostType, typeof POST_TYPE_CONFIG[PostType]][]).map(([type, cfg]) => (
              <button key={type} type="button" onClick={() => handlePostTypeChange(type)}
                style={{ padding: '10px 8px', borderRadius: '10px', border: '2px solid', textAlign: 'left',
                  borderColor: postType === type ? cfg.color : '#e7e9f0',
                  background: postType === type ? cfg.bg : '#fff', cursor: 'pointer' }}>
                <div style={{ fontSize: '14px', marginBottom: '2px' }}>{cfg.icon} <strong style={{ color: postType === type ? cfg.color : '#1a2744', fontSize: '12px' }}>{cfg.label}</strong></div>
                <div style={{ fontSize: '10px', color: '#98a0b0', lineHeight: 1.3 }}>{cfg.hint}</div>
              </button>
            ))}
          </div>
          {isUscis && (
            <div style={{ marginTop: '10px', padding: '10px 12px', background: '#e6f6ef', borderRadius: '8px', fontSize: '12px', color: '#047857' }}>
              ℹ️ USCIS News posts are <strong>always saved as draft</strong>. The publish toggle is disabled. You can publish after reviewing the content.
            </div>
          )}
        </div>

        {/* Main form card */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e7e9f0' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Title *</label>
            <input value={title} onChange={e => handleTitleChange(e.target.value)}
              placeholder={isVideo ? 'H-1B Process Explained — Step by Step' : 'H-1B Cap Season 2026: Key Deadlines'}
              style={{ ...inputStyle, fontSize: '16px', fontWeight: 600 }} />
          </div>

          <div style={{ marginBottom: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>URL Slug *</label>
              <input value={slug} onChange={e => setSlug(slugify(e.target.value))} placeholder="h1b-cap-season-2026" style={inputStyle} />
              <div style={{ fontSize: '11px', color: '#98a0b0', marginTop: '4px' }}>
                {isVideo ? `/videos` : `/blog/${slug || 'your-slug-here'}`}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* YouTube URL — only for video posts */}
          {isVideo && (
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>YouTube URL * <span style={{ fontWeight: 400, color: '#98a0b0' }}>(youtube.com/watch?v= or youtu.be/)</span></label>
              <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                style={{ ...inputStyle, borderColor: youtubeUrl && !embedUrl ? '#f87171' : '#e7e9f0' }} />
              {youtubeUrl && !embedUrl && <div style={{ fontSize: '12px', color: '#b42318', marginTop: '4px' }}>Could not parse YouTube URL — check the link and try again.</div>}
              {embedUrl && (
                <div style={{ marginTop: '10px', borderRadius: '10px', overflow: 'hidden', aspectRatio: '16/9' }}>
                  <iframe src={embedUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen title="Video preview" />
                </div>
              )}
            </div>
          )}

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>{isVideo ? 'Video Description (shown below player)' : 'Excerpt'} <span style={{ fontWeight: 400, color: '#98a0b0' }}>(shown in listing)</span></label>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)}
              placeholder={isVideo ? 'A short description of what this video covers...' : 'A short summary shown on the blog listing page...'}
              rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {!isVideo && (
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Content * <span style={{ fontWeight: 400, color: '#98a0b0' }}>(plain text — blank lines = paragraphs)</span></label>
              <textarea value={content} onChange={e => setContent(e.target.value)}
                placeholder="Write your full article here..."
                rows={16} style={{ ...inputStyle, resize: 'vertical', minHeight: '300px', lineHeight: 1.7 }} />
            </div>
          )}
        </div>
      </div>

      {/* ── Sidebar ── */}
      <div style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Publish */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e7e9f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#98a0b0', marginBottom: '14px' }}>Publish Settings</div>

          {!isUscis && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px 12px', border: '1.5px solid', borderColor: publish ? '#1a2744' : '#e7e9f0', borderRadius: '10px', marginBottom: '14px', background: publish ? '#f0f4ff' : '#fff' }}>
              <input type="checkbox" checked={publish} onChange={e => setPublish(e.target.checked)} style={{ accentColor: '#1a2744' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a2744' }}>
                {publish ? '● Publish immediately' : '○ Save as draft'}
              </span>
            </label>
          )}

          {isUscis && (
            <div style={{ padding: '10px 12px', background: '#eef0f4', borderRadius: '10px', marginBottom: '14px', fontSize: '13px', color: '#566173' }}>
              🔒 Saved as draft (review before publishing)
            </div>
          )}

          <button onClick={handleSave} disabled={saving}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: saving ? '#eef0f4' : 'linear-gradient(135deg,#cfa94a,#b8952a)', color: saving ? '#98a0b0' : '#0b1322', fontSize: '14px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Post'}
          </button>

          <button onClick={() => router.push('/admin/blog')}
            style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '10px', border: '1.5px solid #e7e9f0', background: '#fff', color: '#586176', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>

        {/* Meta */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e7e9f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#98a0b0', marginBottom: '14px' }}>Post Details</div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Author Name</label>
            <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="OSIS Editorial Team" style={inputStyle} />
          </div>

          {!isVideo && (
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Featured Image URL</label>
              <input value={image} onChange={e => setImage(e.target.value)} placeholder="https://images.unsplash.com/…" style={inputStyle} />
              {image && <img src={image} alt="" style={{ width: '100%', borderRadius: '8px', marginTop: '8px', height: '120px', objectFit: 'cover' }} />}
            </div>
          )}

          <div>
            <label style={labelStyle}>Tags <span style={{ fontWeight: 400, color: '#98a0b0' }}>(comma-separated)</span></label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="H-1B, USCIS, work visa" style={inputStyle} />
          </div>
        </div>

        {/* Post type info */}
        <div style={{ background: typeConfig.bg, borderRadius: '12px', padding: '14px 16px', border: `1px solid ${typeConfig.color}30` }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: typeConfig.color, marginBottom: '4px' }}>{typeConfig.icon} {typeConfig.label}</div>
          <div style={{ fontSize: '12px', color: '#586176', lineHeight: 1.5 }}>{typeConfig.hint}</div>
        </div>
      </div>
    </div>
  )
}
