/**
 * app/admin/blog/page.tsx
 *
 * Admin Blog CMS — list all posts (published + drafts), with publish/unpublish toggle.
 * Only accessible to lawyer/admin roles (enforced by app/admin/layout.tsx).
 */
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BlogPostActions from './BlogPostActions'

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Admin client bypasses RLS — reads ALL users' data
  const admin = createAdminClient()

  const { data: posts } = await admin
    .from('blog_posts')
    .select('id, title, slug, category, is_published, published_at, author_name, created_at')
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: '28px', color: '#1a2744', margin: '0 0 4px' }}>Blog CMS</h1>
          <p style={{ color: '#586176', fontSize: '15px', margin: 0 }}>{posts?.length ?? 0} total posts</p>
        </div>
        <Link href="/admin/blog/new"
          style={{ background: 'linear-gradient(135deg,#cfa94a,#b8952a)', color: '#0b1322', padding: '11px 22px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
          + New Post
        </Link>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e7e9f0', overflow: 'hidden' }}>
        {!posts || posts.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#98a0b0' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📝</div>
            <p style={{ fontSize: '15px', margin: '0 0 16px' }}>No blog posts yet.</p>
            <Link href="/admin/blog/new" style={{ color: '#b8952a', fontWeight: 600, textDecoration: 'none' }}>Create your first post →</Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e7e9f0' }}>
                {['Title', 'Category', 'Author', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#98a0b0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid #f4f6fb' }}>
                  <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a2744', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#98a0b0', marginTop: '2px' }}>/blog/{post.slug}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#e8effe', color: '#1d4ed8', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: 600 }}>
                      {post.category || 'General'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#586176' }}>{post.author_name || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: post.is_published ? '#e6f6ef' : '#eef0f4',
                      color: post.is_published ? '#047857' : '#566173',
                      borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: 600
                    }}>
                      {post.is_published ? '● Published' : '○ Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#586176' }}>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Link href={`/admin/blog/${post.id}`}
                        style={{ fontSize: '13px', color: '#1a2744', fontWeight: 600, textDecoration: 'none', padding: '5px 12px', border: '1px solid #e7e9f0', borderRadius: '7px' }}>
                        Edit
                      </Link>
                      <BlogPostActions postId={post.id} isPublished={post.is_published} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
