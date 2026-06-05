'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface StorageFile {
  name: string
  id: string
  updated_at: string
  metadata: { size: number; mimetype: string }
}

export default function DocumentsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [files, setFiles] = useState<StorageFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const loadFiles = useCallback(async (uid: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from('documents')
      .list(uid, { sortBy: { column: 'updated_at', order: 'desc' } })
    if (!error && data) {
      setFiles(data.filter(f => f.name !== '.emptyFolderPlaceholder') as StorageFile[])
    }
  }, [])

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      loadFiles(user.id)
    }
    init()
  }, [loadFiles])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    setUploading(true)
    setMessage('')

    const supabase = createClient()
    const fileName = `${userId}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage
      .from('documents')
      .upload(fileName, file)

    if (error) {
      setMessage('Upload failed: ' + error.message)
    } else {
      setMessage('File uploaded successfully!')
      setTimeout(() => setMessage(''), 3000)
      loadFiles(userId)
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDelete(fileName: string) {
    if (!userId) return
    setDeleting(fileName)
    const supabase = createClient()
    const { error } = await supabase.storage
      .from('documents')
      .remove([`${userId}/${fileName}`])
    if (!error) {
      setFiles(prev => prev.filter(f => f.name !== fileName))
    }
    setDeleting(null)
  }

  async function handleDownload(fileName: string) {
    if (!userId) return
    const supabase = createClient()
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(`${userId}/${fileName}`, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  function formatSize(bytes: number) {
    if (!bytes) return '—'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function displayName(rawName: string) {
    // Strip the timestamp prefix: "1234567890-filename.pdf" → "filename.pdf"
    return rawName.replace(/^\d+-/, '')
  }

  function fileIcon(mimetype: string = '') {
    if (mimetype.includes('pdf')) return '📄'
    if (mimetype.includes('image')) return '🖼️'
    if (mimetype.includes('word') || mimetype.includes('document')) return '📝'
    return '📎'
  }

  return (
    <div className="portal">
      <aside className="portal-sidebar">
        <Link href="/" className="portal-logo">
          <img src="/logo-bird.png" alt="OSIS" />
          <span>One Stop<br />Immigration</span>
        </Link>
        <nav className="portal-nav">
          <Link href="/dashboard" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </Link>
          <Link href="/dashboard/cases" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
            My Cases
          </Link>
          <Link href="/dashboard/appointments" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Appointments
          </Link>
          <Link href="/dashboard/documents" className="portal-nav-link active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            Documents
          </Link>
          <Link href="/dashboard/profile" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
          </Link>
        </nav>
      </aside>

      <main className="portal-main">
        <div className="portal-header">
          <div>
            <h1>Documents</h1>
            <p style={{color:'#6b7280', fontSize:'15px', margin:'4px 0 0'}}>
              Upload and manage your immigration documents
            </p>
          </div>
        </div>

        {/* Upload area */}
        <div className="doc-upload-card">
          <div className="doc-upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <h3>Upload a Document</h3>
          <p>Passport, visa, I-94, employment letter, or any other immigration document</p>
          <label className="btn btn--navy" style={{cursor:'pointer', display:'inline-block'}}>
            {uploading ? 'Uploading…' : 'Choose File'}
            <input
              ref={fileRef}
              type="file"
              onChange={handleUpload}
              disabled={uploading}
              style={{display:'none'}}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </label>
          <p style={{fontSize:'12px', color:'#9ca3af', marginTop:'8px'}}>
            PDF, JPG, PNG, DOC up to 10MB
          </p>
          {message && (
            <div style={{
              marginTop:'12px', padding:'10px 16px', borderRadius:'8px',
              background: message.includes('failed') ? '#fee2e2' : '#d1fae5',
              color: message.includes('failed') ? '#991b1b' : '#065f46',
              fontSize:'14px'
            }}>
              {message}
            </div>
          )}
        </div>

        {/* Document list */}
        <section className="portal-section">
          <div className="portal-section-head">
            <h2>Your Documents ({files.length})</h2>
          </div>

          {files.length > 0 ? (
            <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
              {files.map(file => (
                <div key={file.id || file.name} style={{
                  display:'flex', alignItems:'center', gap:'16px',
                  background:'#fff', border:'1px solid #e5e7eb',
                  borderRadius:'10px', padding:'14px 18px'
                }}>
                  <span style={{fontSize:'24px', flexShrink:0}}>
                    {fileIcon(file.metadata?.mimetype)}
                  </span>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:'14px', fontWeight:600, color:'#1a2744', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                      {displayName(file.name)}
                    </div>
                    <div style={{fontSize:'12px', color:'#9ca3af', marginTop:'2px'}}>
                      {formatSize(file.metadata?.size)} · Uploaded {formatDate(file.updated_at)}
                    </div>
                  </div>
                  <div style={{display:'flex', gap:'8px', flexShrink:0}}>
                    <button
                      onClick={() => handleDownload(file.name)}
                      className="btn btn--outline-navy"
                      style={{fontSize:'12px', padding:'5px 12px'}}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(file.name)}
                      disabled={deleting === file.name}
                      style={{
                        fontSize:'12px', padding:'5px 12px', borderRadius:'6px',
                        border:'1px solid #fca5a5', background:'#fff',
                        color:'#dc2626', cursor:'pointer'
                      }}
                    >
                      {deleting === file.name ? '…' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="portal-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <p>No documents uploaded yet. Use the upload area above to add your first document.</p>
            </div>
          )}
        </section>

        {/* What to upload guide */}
        <section className="portal-section">
          <div className="portal-section-head">
            <h2>Common Documents Needed</h2>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'12px'}}>
            {[
              {icon:'🛂', title:'Passport', desc:'Current + all previous passports'},
              {icon:'📋', title:'I-94 Record', desc:'Arrival/departure record'},
              {icon:'💼', title:'Employment Letter', desc:'From current employer'},
              {icon:'🎓', title:'Degree/Diploma', desc:'Educational credentials'},
              {icon:'💰', title:'Tax Returns', desc:'Last 3 years W-2s'},
              {icon:'📸', title:'Photos', desc:'Passport-style photos'},
            ].map((item, i) => (
              <div key={i} style={{background:'#f9fafb', borderRadius:'8px', padding:'16px'}}>
                <div style={{fontSize:'24px', marginBottom:'8px'}}>{item.icon}</div>
                <div style={{fontSize:'14px', fontWeight:600, color:'#1a2744', marginBottom:'4px'}}>{item.title}</div>
                <div style={{fontSize:'12px', color:'#6b7280'}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
