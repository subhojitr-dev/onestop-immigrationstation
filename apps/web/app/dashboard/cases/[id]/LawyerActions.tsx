/**
 * app/dashboard/cases/[id]/LawyerActions.tsx
 *
 * Client component — shown only to lawyers/admins on the case detail page.
 * Provides two actions:
 *   1. Add timeline event — lawyer types an event name + optional description,
 *      inserts a row into case_timeline, triggers case status email to client.
 *   2. Upload document to case — lawyer uploads a file to Supabase Storage
 *      under the documents bucket, then inserts a row into the documents table
 *      linked to this case_id.
 *
 * Both actions refresh the page after completion so the new data appears immediately.
 */
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  caseId: string
  caseNumber: string
  clientUserId: string
}

export default function LawyerActions({ caseId, caseNumber, clientUserId }: Props) {
  const router = useRouter()

  // Timeline state
  const [tlEvent, setTlEvent]   = useState('')
  const [tlDesc, setTlDesc]     = useState('')
  const [tlSaving, setTlSaving] = useState(false)
  const [tlError, setTlError]   = useState('')
  const [tlDone, setTlDone]     = useState(false)

  // Document upload state
  const [docFile, setDocFile]   = useState<File | null>(null)
  const [docType, setDocType]   = useState('Case Document')
  const [docSaving, setDocSaving] = useState(false)
  const [docError, setDocError] = useState('')
  const [docDone, setDocDone]   = useState(false)

  async function handleAddTimeline(e: React.FormEvent) {
    e.preventDefault()
    if (!tlEvent.trim()) { setTlError('Event name is required'); return }
    setTlSaving(true)
    setTlError('')

    // Use API route so we can send notification via service role without exposing key
    const res = await fetch('/api/admin/add-timeline-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId, caseNumber, clientUserId, event: tlEvent.trim(), description: tlDesc.trim() || null }),
    })
    const result = await res.json()
    if (!res.ok) { setTlError(result.error || 'Failed to add event'); setTlSaving(false); return }

    setTlEvent('')
    setTlDesc('')
    setTlDone(true)
    setTimeout(() => setTlDone(false), 3000)
    setTlSaving(false)
    router.refresh()
  }

  async function handleUploadDoc(e: React.FormEvent) {
    e.preventDefault()
    if (!docFile) { setDocError('Please select a file'); return }
    setDocSaving(true)
    setDocError('')
    const supabase = createClient()

    // Get current lawyer's user id for folder path
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setDocError('Not authenticated'); setDocSaving(false); return }

    const timestamp = Date.now()
    const safeName = docFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    // Store under case folder so client and lawyer can both access
    const path = `cases/${caseId}/${timestamp}-${safeName}`

    const { data: upload, error: uploadErr } = await supabase.storage
      .from('documents')
      .upload(path, docFile, { upsert: false })

    if (uploadErr) { setDocError(uploadErr.message); setDocSaving(false); return }

    // Get public/signed URL
    const { data: urlData } = await supabase.storage.from('documents').createSignedUrl(path, 60 * 60 * 24 * 365)

    // Insert document record linked to this case and the client user
    await supabase.from('documents').insert({
      case_id: caseId,
      user_id: clientUserId,
      file_name: docFile.name,
      file_url: urlData?.signedUrl || upload.path,
      file_size: docFile.size,
      doc_type: docType,
    })

    setDocFile(null)
    setDocDone(true)
    setTimeout(() => setDocDone(false), 3000)
    setDocSaving(false)
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1.5px solid #e7e9f0',
    borderRadius: '9px', fontFamily: 'inherit', fontSize: '13px', color: '#16203a',
    outline: 'none', background: '#fff', boxSizing: 'border-box',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Add Timeline Event ── */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e7e9f0' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#98a0b0', marginBottom: '14px' }}>
          Add Timeline Event
        </div>
        <form onSubmit={handleAddTimeline}>
          {tlError && <div style={{ background: '#fdeceb', color: '#b42318', borderRadius: '7px', padding: '8px 12px', marginBottom: '10px', fontSize: '13px' }}>{tlError}</div>}

          <div style={{ marginBottom: '10px' }}>
            <input value={tlEvent} onChange={e => setTlEvent(e.target.value)}
              placeholder="e.g. I-129 petition filed with USCIS" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <textarea value={tlDesc} onChange={e => setTlDesc(e.target.value)}
              placeholder="Additional details (optional)"
              rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <button type="submit" disabled={tlSaving}
            style={{ width: '100%', padding: '10px', borderRadius: '9px', border: 'none', background: tlDone ? '#e6f6ef' : 'linear-gradient(150deg,#243355,#16223d)', color: tlDone ? '#047857' : '#fff', fontSize: '13px', fontWeight: 700, cursor: tlSaving ? 'not-allowed' : 'pointer' }}>
            {tlSaving ? 'Adding…' : tlDone ? '✓ Event Added' : '+ Add Event'}
          </button>
        </form>
      </div>

      {/* ── Upload Document ── */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e7e9f0' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#98a0b0', marginBottom: '14px' }}>
          Upload Document to Case
        </div>
        <form onSubmit={handleUploadDoc}>
          {docError && <div style={{ background: '#fdeceb', color: '#b42318', borderRadius: '7px', padding: '8px 12px', marginBottom: '10px', fontSize: '13px' }}>{docError}</div>}

          <div style={{ marginBottom: '10px' }}>
            <select value={docType} onChange={e => setDocType(e.target.value)} style={inputStyle}>
              {['Approval Notice', 'Receipt Notice', 'RFE', 'RFE Response', 'Attorney Letter', 'Government Correspondence', 'Case Document', 'Supporting Evidence'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', border: '1.5px dashed #b8952a', borderRadius: '9px', padding: '14px', textAlign: 'center', cursor: 'pointer', background: '#fffbf0' }}>
              <input type="file" onChange={e => setDocFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
              {docFile ? (
                <span style={{ fontSize: '13px', color: '#1a2744', fontWeight: 600 }}>📎 {docFile.name}</span>
              ) : (
                <span style={{ fontSize: '13px', color: '#98a0b0' }}>Click to select file</span>
              )}
            </label>
          </div>
          <button type="submit" disabled={docSaving || !docFile}
            style={{ width: '100%', padding: '10px', borderRadius: '9px', border: 'none', background: docDone ? '#e6f6ef' : docFile ? 'linear-gradient(135deg,#cfa94a,#b8952a)' : '#eef0f4', color: docDone ? '#047857' : docFile ? '#0b1322' : '#98a0b0', fontSize: '13px', fontWeight: 700, cursor: (docSaving || !docFile) ? 'not-allowed' : 'pointer' }}>
            {docSaving ? 'Uploading…' : docDone ? '✓ Uploaded' : '↑ Upload Document'}
          </button>
        </form>
      </div>
    </div>
  )
}
