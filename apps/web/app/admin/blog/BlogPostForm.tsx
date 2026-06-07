/**
 * app/admin/blog/BlogPostForm.tsx
 *
 * Shared client component for creating and editing blog posts.
 * Used by both /admin/blog/new and /admin/blog/[id].
 *
 * Fields: title, slug (auto-generated from title, editable), category,
 *         author name, excerpt, content (plain text), featured image URL,
 *         tags (comma-separated), publish immediately toggle.
 *
 * On save: upserts to blog_posts table then redirects to /admin/blog.
 */
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Policy & News', 'USCIS Updates', 'H-1B', 'Green Card', 'Family Immigration', 'Court Decisions', 'Workplace', 'Employer Compliance', 'General']

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

interface Props {
  post?: {
    id: string; title: string; slug: string; excerpt: string; content: string
    author_name: string; category: string; featured_image: string; tags: string[]
    is_published: boolean
  }
}

export default function BlogPostForm({ post }: Props) {
  const router = useRouter()
  const isEdit = !!post

  const [title, setTitle]         = useState(post?.title ?? '')
  const [slug, setSlug]           = useState(post?.slug ?? '')
  const [category, setCategory]   = useState(post?.category ?? 'Policy & News')
  const [author, setAuthor]       = useState(post?.author_name ?? '')
  const [excerpt, setExcerpt]     = useState(post?.excerpt ?? '')
  const [content, setContent]     = useState(post?.content ?? '')
  const [image, setImage]         = useState(post?.featured_image ?? '')
  const [tags, setTags]           = useState(post?.tags?.join(', ') ?? '')
  const [publish, setPublish]     = useState(post?.is_published ?? false)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!isEdit) setSlug(slugify(val)) // auto-fill slug only on new post
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) { setError('Title and content are required.'); return }
    if (!slug.trim()) { setError('Slug is required.'); return }
    setSaving(true)
    setError('')

    const supabase = createClient()
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      author_name: author.trim() || 'OSIS Editorial Team',
      category,
      featured_image: image.trim() || null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null,
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
      {/* Main */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e7e9f0' }}>
        {error && <div style={{ background: '#fdeceb', color: '#b42318', borderRadius: '8px', padding: '12px 16px', marginBottom: '18px', fontSize: '14px' }}>{error}</div>}

        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Title *</label>
          <input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="H-1B Cap Season 2026: Key Deadlines" style={{ ...inputStyle, fontSize: '16px', fontWeight: 600 }} />
        </div>

        <div style={{ marginBottom: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>URL Slug *</label>
            <input value={slug} onChange={e => setSlug(slugify(e.target.value))} placeholder="h1b-cap-season-2026" style={inputStyle} />
            <div style={{ fontSize: '11px', color: '#98a0b0', marginTop: '4px' }}>/blog/{slug || 'your-slug-here'}</div>
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Excerpt (shown in post list)</label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)}
            placeholder="A short summary shown on the blog listing page..."
            rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Content * <span style={{ fontWeight: 400, color: '#98a0b0' }}>(plain text — use blank lines between paragraphs)</span></label>
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="Write your full article here. Use blank lines to separate paragraphs..."
            rows={16} style={{ ...inputStyle, resize: 'vertical', minHeight: '300px', lineHeight: 1.7 }} />
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Publish */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e7e9f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#98a0b0', marginBottom: '14px' }}>Publish Settings</div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px 12px', border: '1.5px solid', borderColor: publish ? '#1a2744' : '#e7e9f0', borderRadius: '10px', marginBottom: '14px', background: publish ? '#f0f4ff' : '#fff' }}>
            <input type="checkbox" checked={publish} onChange={e => setPublish(e.target.checked)} style={{ accentColor: '#1a2744' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a2744' }}>
              {publish ? '● Publish immediately' : '○ Save as draft'}
            </span>
          </label>

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

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Featured Image URL</label>
            <input value={image} onChange={e => setImage(e.target.value)} placeholder="https://images.unsplash.com/…" style={inputStyle} />
            {image && <img src={image} alt="" style={{ width: '100%', borderRadius: '8px', marginTop: '8px', height: '120px', objectFit: 'cover' }} />}
          </div>

          <div>
            <label style={labelStyle}>Tags <span style={{ fontWeight: 400, color: '#98a0b0' }}>(comma-separated)</span></label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="H-1B, USCIS, work visa" style={inputStyle} />
          </div>
        </div>
      </div>
    </div>
  )
}
