'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  appId: string
  currentStatus: string
  lawyerNotes: string
}

const statusOptions = [
  { value: 'submitted',      label: '● New Submission',    color: '#047857', bg:'#e6f6ef' },
  { value: 'under_review',   label: '🔍 Under Review',     color: '#b45309', bg:'#fdf3e3' },
  { value: 'info_requested', label: '❓ Info Requested',   color: '#b42318', bg:'#fdeceb' },
  { value: 'approved',       label: '✓ Approved',          color: '#1d4ed8', bg:'#e8effe' },
  { value: 'rejected',       label: '✗ Rejected',          color: '#b42318', bg:'#fdeceb' },
]

export default function ApplicationActions({ appId, currentStatus, lawyerNotes }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(lawyerNotes)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('applications').update({
      status,
      lawyer_notes: notes,
      reviewed_at: new Date().toISOString(),
    }).eq('id', appId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div style={{background:'#fff', borderRadius:'16px', padding:'22px', border:'1px solid #e7e9f0', boxShadow:'0 1px 2px rgba(17,27,49,.04)', marginBottom:'16px'}}>
      <div style={{fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#98a0b0', marginBottom:'14px'}}>
        Review Actions
      </div>

      {/* Status selector */}
      <div style={{marginBottom:'16px'}}>
        <label style={{display:'block', fontSize:'13px', fontWeight:600, color:'#1a2744', marginBottom:'8px'}}>
          Application Status
        </label>
        <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
          {statusOptions.map(opt => (
            <label key={opt.value} style={{display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', border:'1.5px solid', borderColor: status === opt.value ? opt.color : '#e7e9f0', borderRadius:'10px', background: status === opt.value ? opt.bg : '#fff', cursor:'pointer', transition:'all .15s'}}>
              <input type="radio" name="status" value={opt.value} checked={status === opt.value}
                onChange={() => setStatus(opt.value)}
                style={{accentColor: opt.color}} />
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
          Lawyer Notes (internal)
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Internal notes about this application — not visible to the client..."
          rows={4}
          style={{width:'100%', padding:'10px 13px', border:'1.5px solid #e7e9f0', borderRadius:'10px', fontFamily:'inherit', fontSize:'13px', color:'#1a2744', outline:'none', resize:'vertical', boxSizing:'border-box'}}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{width:'100%', padding:'12px', borderRadius:'10px', border:'none', background: saved ? '#e6f6ef' : 'linear-gradient(150deg,#243355,#16223d)', color: saved ? '#047857' : '#fff', fontSize:'14px', fontWeight:600, cursor:'pointer', transition:'all .2s'}}
      >
        {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Review'}
      </button>
    </div>
  )
}
