import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import BlogPostForm from '../BlogPostForm'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: post } = await supabase.from('blog_posts').select('*').eq('id', id).single()
  if (!post) notFound()

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#98a0b0', marginBottom: '20px' }}>
        <Link href="/admin/blog" style={{ color: '#586176', textDecoration: 'none', fontWeight: 500 }}>Blog CMS</Link>
        <span>›</span>
        <span style={{ color: '#1a2744', fontWeight: 600 }}>Edit Post</span>
      </div>
      <h1 style={{ fontFamily: 'Lora, serif', fontSize: '26px', color: '#1a2744', margin: '0 0 24px' }}>Edit Post</h1>
      <BlogPostForm post={post} />
    </div>
  )
}
