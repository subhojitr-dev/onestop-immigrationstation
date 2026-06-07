/**
 * app/admin/applications/[id]/ApplicationActions.tsx
 *
 * Client component — right sidebar on the admin application detail page.
 *
 * Two actions:
 *   1. Save Review — updates application status + lawyer notes via admin API
 *      (uses service role to bypass RLS since lawyer updating another user's row)
 *   2. Open Case — creates a new case in the cases table linked to this application,
 *      pre-filled with visa type and client user_id. This is how an application
 *      becomes an active legal case.
 *
 * Status flow:
 *   submitted → under_review → info_requested → approved/rejected
 *   When approved: lawyer clicks "Open Case" to create the case record
 */
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  appId: string
  currentStatus: string
  lawyerNotes: string
  visaType: string
  clientUserId: string
  clientName: string
  existingCaseId?: string | null
}

const statusOptions = [
  { value: 'submitted',      label: '● New Submission',    color: '#047857', bg:'#e6f6ef' },
  { value: 'under_review',   label: 'Under Review',        color: '#b45309', bg:'#fdf3e3' },
  { value: 'info_requested', label: 'Info Requested',      color: '#b42318', bg:'#fdeceb' },
  { value: 'approved',       label: 'Approved',            color: '#1d4ed8', bg:'#e8effe' },
  { value: 'rejected',       label: 'Rejected',            color: '#b42318', bg:'#fdeceb' },
  { value: 'case_opened',    label: 'Case Opened',         color: '#047857', bg:'#e6f6ef' },
]

const visaLabels: Record<string,string> = {
  h1b:'H-1B', l1:'L-1', green_card:'Green Card', k1:'K-1', family_petition:'Family Petition'
}

export default function ApplicationActions({ appId, currentStatus, lawyerNotes, visaType, clientUserId, clientName, existingCaseId }: Props) {
  const router = useRouter()
  const [status, setStatus]     = useState(currentStatus)
  const [notes, setNotes]       = useState(lawyerNotes)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [opening, setOpening]   = useState(false)
  const [caseId, setCaseId]     = useState(existingCaseId)
  const [error, setError]       = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')
    // Use admin API to bypass RLS — lawyer updating another user's application row
    const res = await fetch('/api/admin/update-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appId, status, notes, visaType, clientUserId, clientName }),
    })
    if (!res.ok) setError('Save failed — please try again')
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  async function handleOpenCase() {
    if (caseId) { router.push(`/admin/cases`); return }
    setOpening(true)
    setError('')
    const res = await fetch('/api/admin/open-case', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appId, visaType, clientUserId, clientName, notes }),
    })
    const data = await res.json()
    if (data.caseId) {
      setCaseId(data.caseId)
      router.refresh()
    } else {
      setError('Failed to open case')
    }
    setOpening(false)
  }

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
      <div style={{background:'#fff', borderRadius:'16px', padding:'22px', border:'1px solid #e7e9f0', marginBottom:'0'}}>
        <div style={{fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#98a0b0', marginBottom:'14px'}}>
          Review Actions
        </div>

        {error && <div style={{background:'#fdeceb', color:'#b42318', borderRadius:'8px', padding:'9px 12px', marginBottom:'12px', fontSize:'13px'}}>{error}</div>}

        {/* Status selector */}
        <div style={{marginBottom:'16px'}}>
          <label style={{display:'block', fontSize:'13px', fontWeight:600, color:'#1a2744', marginBottom:'8px'}}>
            Application Status
          </label>
          <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
            {statusOptions.map(opt => (
              <label key={opt.value} style={{display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', border:'1.5px solid', borderColor: status === opt.value ? opt.color : '#e7e9f0', borderRadius:'10px', background: status === opt.value ? opt.bg : '#fff', cursor:'pointer', transition:'all .15s'}}>
                <input type="radio" name="status" value={opt.value} checked={status === opt.value}
                  onChange={() => setStatus(opt.value)} style={{accentColor: opt.color}} />
                <span style={{fontSize:'13px', fontWeight: status === opt.value ? 600 : 400, color: status === opt.value ? opt.color : '#586176'}}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Lawyer notes */}
        <div style={{marginBottom:'16px'}}>
          <label style={{display:'block', fontSize:'13px', fontWeight:600, color:'#1a2744', marginBottom:'8px'}}>
            Lawyer Notes <span style={{fontWeight:400, color:'#98a0b0'}}>(internal — client cannot see these)</span>
          </label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Assessment of the case, missing documents, strategy notes, concerns..."
            rows={5}
            style={{width:'100%', padding:'10px 13px', border:'1.5px solid #e7e9f0', borderRadius:'10px', fontFamily:'inherit', fontSize:'13px', color:'#1a2744', outline:'none', resize:'vertical', boxSizing:'border-box'}}
          />
        </div>

        <button onClick={handleSave} disabled={saving}
          style={{width:'100%', padding:'12px', borderRadius:'10px', border:'none', background: saved ? '#e6f6ef' : 'linear-gradient(150deg,#243355,#16223d)', color: saved ? '#047857' : '#fff', fontSize:'14px', fontWeight:600, cursor:'pointer', transition:'all .2s', marginBottom:'10px'}}>
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Review'}
        </button>
      </div>

      {/* Open Case button — converts application into active case */}
      <div style={{background:'#fff', borderRadius:'16px', padding:'20px', border: caseId ? '2px solid #047857' : '1px solid #e7e9f0'}}>
        <div style={{fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#98a0b0', marginBottom:'10px'}}>
          Case Management
        </div>
        {caseId ? (
          <div>
            <div style={{background:'#e6f6ef', borderRadius:'8px', padding:'10px 12px', marginBottom:'10px', fontSize:'13px', color:'#047857', fontWeight:600}}>
              ✓ Case opened for this application
            </div>
            <button onClick={() => router.push('/admin/cases')}
              style={{width:'100%', padding:'10px', borderRadius:'9px', border:'1px solid #e7e9f0', background:'#fff', color:'#1a2744', fontSize:'13px', fontWeight:600, cursor:'pointer'}}>
              View in Cases →
            </button>
          </div>
        ) : (
          <div>
            <p style={{fontSize:'13px', color:'#586176', lineHeight:1.6, margin:'0 0 12px'}}>
              Once you have reviewed this application, open a case to begin the legal process.
              This creates a <strong>{visaLabels[visaType] || visaType}</strong> case for <strong>{clientName}</strong>,
              assigned to <strong>One Stop Immigration Station</strong>.
            </p>
            <button onClick={handleOpenCase} disabled={opening}
              style={{width:'100%', padding:'11px', borderRadius:'9px', border:'none', background: opening ? '#eef0f4' : 'linear-gradient(135deg,#cfa94a,#b8952a)', color: opening ? '#98a0b0' : '#0b1322', fontSize:'13px', fontWeight:700, cursor: opening ? 'not-allowed' : 'pointer'}}>
              {opening ? 'Opening Case…' : '+ Open Case for This Application'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
