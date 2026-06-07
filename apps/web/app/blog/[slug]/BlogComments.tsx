/**
 * app/blog/[slug]/BlogComments.tsx
 *
 * Client component — renders the full comments section on a blog post page.
 *
 * Features:
 *   - Top-level comments + threaded replies (one level deep)
 *   - Logged-in users can post and reply
 *   - Logged-out users see a "Sign in to comment" prompt
 *   - Soft delete: admins/lawyers see a "Remove" button; deleted comments
 *     show "[Comment removed]" so threads stay intact
 *   - Auto-publishes instantly (no moderation queue)
 *   - Comment count shown in header
 *
 * Props:
 *   postId     — the blog_posts.id for this post
 *   initialComments — server-fetched comments (avoids client-side flash)
 *   currentUser — null if logged out, otherwise { id, name, role }
 */
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Comment {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  body: string
  is_deleted: boolean
  created_at: string
  profiles: { full_name: string; role: string } | null
}

interface Props {
  postId: string
  initialComments: Comment[]
  currentUser: { id: string; name: string; role: string } | null
}

export default function BlogComments({ postId, initialComments, currentUser }: Props) {
  const [comments, setComments]     = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo]       = useState<string | null>(null) // comment id being replied to
  const [replyText, setReplyText]   = useState('')
  const [posting, setPosting]       = useState(false)
  const [error, setError]           = useState('')

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'lawyer'

  // Top-level comments (no parent)
  const topLevel = comments.filter(c => !c.parent_id)
  // Replies grouped by parent_id
  const repliesFor = (parentId: string) => comments.filter(c => c.parent_id === parentId)

  async function postComment(body: string, parentId: string | null) {
    if (!body.trim() || !currentUser) return
    setPosting(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('blog_comments')
      .insert({ post_id: postId, user_id: currentUser.id, parent_id: parentId, body: body.trim() })
      .select('*, profiles(full_name, role)')
      .single()

    if (err) { setError(err.message); setPosting(false); return }

    setComments(prev => [...prev, data as Comment])
    if (parentId) { setReplyText(''); setReplyTo(null) }
    else setNewComment('')
    setPosting(false)
  }

  async function removeComment(commentId: string) {
    const supabase = createClient()
    await supabase.from('blog_comments').update({ is_deleted: true }).eq('id', commentId)
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, is_deleted: true } : c))
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 30) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function CommentBubble({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
    const replies = repliesFor(comment.id)
    const authorName = comment.profiles?.full_name || 'Anonymous'
    const isStaff = comment.profiles?.role === 'lawyer' || comment.profiles?.role === 'admin'
    const isOwn = currentUser?.id === comment.user_id

    return (
      <div style={{ marginLeft: isReply ? '40px' : 0, marginBottom: '16px' }}>
        <div style={{
          background: isReply ? '#f8f9ff' : '#fff',
          border: `1px solid ${isReply ? '#e0e7ff' : '#e7e9f0'}`,
          borderRadius: '12px', padding: '14px 16px',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: isStaff ? 'linear-gradient(135deg,#1a2744,#243355)' : '#eef0f4',
              display: 'grid', placeItems: 'center',
              fontSize: '13px', fontWeight: 700,
              color: isStaff ? '#cfa94a' : '#586176',
            }}>
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a2744' }}>
                {authorName}
              </span>
              {isStaff && (
                <span style={{ marginLeft: '6px', background: '#1a2744', color: '#cfa94a', fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px' }}>
                  Staff
                </span>
              )}
              <span style={{ marginLeft: '8px', fontSize: '12px', color: '#98a0b0' }}>
                {timeAgo(comment.created_at)}
              </span>
            </div>
            {/* Admin remove button */}
            {(isAdmin || isOwn) && !comment.is_deleted && (
              <button onClick={() => removeComment(comment.id)}
                style={{ background: 'none', border: 'none', color: '#98a0b0', fontSize: '12px', cursor: 'pointer', padding: '2px 6px' }}>
                Remove
              </button>
            )}
          </div>

          {/* Body */}
          {comment.is_deleted ? (
            <p style={{ fontSize: '14px', color: '#98a0b0', fontStyle: 'italic', margin: 0 }}>[Comment removed]</p>
          ) : (
            <p style={{ fontSize: '14px', color: '#2d3748', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
              {comment.body}
            </p>
          )}

          {/* Reply button — only on top-level, only if logged in, only if not deleted */}
          {!isReply && !comment.is_deleted && currentUser && (
            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              style={{ marginTop: '8px', background: 'none', border: 'none', color: '#b8952a', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              {replyTo === comment.id ? 'Cancel' : '↩ Reply'}
            </button>
          )}
        </div>

        {/* Inline reply form */}
        {replyTo === comment.id && (
          <div style={{ marginLeft: '40px', marginTop: '8px' }}>
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder={`Reply to ${authorName}…`}
              rows={3}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e7e9f0', borderRadius: '10px', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
            />
            <button
              onClick={() => postComment(replyText, comment.id)}
              disabled={posting || !replyText.trim()}
              style={{ marginTop: '6px', padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#1a2744,#243355)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              {posting ? 'Posting…' : 'Post Reply'}
            </button>
          </div>
        )}

        {/* Nested replies */}
        {replies.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {replies.map(reply => (
              <CommentBubble key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '2px solid #e7e9f0' }}>
      {/* Header */}
      <h3 style={{ fontFamily: 'Lora, serif', fontSize: '20px', color: '#1a2744', margin: '0 0 24px' }}>
        Comments ({comments.filter(c => !c.is_deleted).length})
      </h3>

      {/* New comment form */}
      {currentUser ? (
        <div style={{ background: '#f8f9ff', borderRadius: '12px', padding: '18px', border: '1px solid #e0e7ff', marginBottom: '28px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a2744', marginBottom: '10px' }}>
            Commenting as <strong>{currentUser.name}</strong>
          </div>
          {error && <div style={{ background: '#fdeceb', color: '#b42318', borderRadius: '8px', padding: '8px 12px', marginBottom: '10px', fontSize: '13px' }}>{error}</div>}
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Share your thoughts or ask a question…"
            rows={4}
            style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #e7e9f0', borderRadius: '10px', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', outline: 'none', marginBottom: '10px' }}
          />
          <button
            onClick={() => postComment(newComment, null)}
            disabled={posting || !newComment.trim()}
            style={{ padding: '10px 24px', borderRadius: '9px', border: 'none', background: (posting || !newComment.trim()) ? '#eef0f4' : 'linear-gradient(135deg,#1a2744,#243355)', color: (posting || !newComment.trim()) ? '#98a0b0' : '#fff', fontSize: '14px', fontWeight: 700, cursor: (posting || !newComment.trim()) ? 'not-allowed' : 'pointer' }}>
            {posting ? 'Posting…' : 'Post Comment'}
          </button>
        </div>
      ) : (
        <div style={{ background: '#f8f9ff', borderRadius: '12px', padding: '20px', border: '1px solid #e0e7ff', marginBottom: '28px', textAlign: 'center' }}>
          <p style={{ color: '#586176', margin: '0 0 12px', fontSize: '15px' }}>
            Sign in to join the conversation
          </p>
          <Link href="/login" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: '9px', background: 'linear-gradient(135deg,#1a2744,#243355)', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
            Sign In to Comment
          </Link>
        </div>
      )}

      {/* Comments list */}
      {topLevel.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#98a0b0', background: '#f9fafb', borderRadius: '12px' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>💬</div>
          <p style={{ margin: 0, fontSize: '15px' }}>No comments yet — be the first!</p>
        </div>
      ) : (
        topLevel.map(comment => (
          <CommentBubble key={comment.id} comment={comment} />
        ))
      )}
    </div>
  )
}
