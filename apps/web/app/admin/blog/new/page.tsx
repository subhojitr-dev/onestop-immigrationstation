import BlogPostForm from '../BlogPostForm'
import Link from 'next/link'

export default function NewBlogPostPage() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#98a0b0', marginBottom: '20px' }}>
        <Link href="/admin/blog" style={{ color: '#586176', textDecoration: 'none', fontWeight: 500 }}>Blog CMS</Link>
        <span>›</span>
        <span style={{ color: '#1a2744', fontWeight: 600 }}>New Post</span>
      </div>
      <h1 style={{ fontFamily: 'Lora, serif', fontSize: '26px', color: '#1a2744', margin: '0 0 24px' }}>Create New Post</h1>
      <BlogPostForm />
    </div>
  )
}
