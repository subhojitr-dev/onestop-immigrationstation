/**
 * app/admin/blog/BlogPostActions.tsx
 *
 * Client component — publish/unpublish and delete buttons for each blog post row.
 */
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function BlogPostActions({ postId, isPublished }: { postId: string; isPublished: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function togglePublish() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('blog_posts').update({
      is_published: !isPublished,
      published_at: !isPublished ? new Date().toISOString() : null,
    }).eq('id', postId)
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this post permanently?')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('blog_posts').delete().eq('id', postId)
    router.refresh()
    setLoading(false)
  }

  return (
    <>
      <button onClick={togglePublish} disabled={loading}
        style={{ fontSize: '13px', color: isPublished ? '#b45309' : '#047857', fontWeight: 600, background: 'none', border: '1px solid #e7e9f0', borderRadius: '7px', padding: '5px 12px', cursor: 'pointer' }}>
        {loading ? '…' : isPublished ? 'Unpublish' : 'Publish'}
      </button>
      <button onClick={handleDelete} disabled={loading}
        style={{ fontSize: '13px', color: '#b42318', fontWeight: 600, background: 'none', border: '1px solid #fdccc9', borderRadius: '7px', padding: '5px 10px', cursor: 'pointer' }}>
        ✕
      </button>
    </>
  )
}
