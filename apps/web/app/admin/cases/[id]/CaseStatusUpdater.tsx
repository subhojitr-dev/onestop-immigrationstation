'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUS_OPTIONS = [
  { value: 'open',               label: 'Open',                  bg: '#e8effe', color: '#1d4ed8' },
  { value: 'in_progress',        label: 'In Progress',           bg: '#fdf3e3', color: '#b45309' },
  { value: 'pending_documents',  label: 'Pending Documents',     bg: '#fdeceb', color: '#b42318' },
  { value: 'submitted',          label: 'Submitted to USCIS',    bg: '#f1ecfe', color: '#6d28d9' },
  { value: 'approved',           label: 'Approved',              bg: '#e6f6ef', color: '#047857' },
  { value: 'denied',             label: 'Denied',                bg: '#fdeceb', color: '#b42318' },
  { value: 'closed',             label: 'Closed',                bg: '#eef0f4', color: '#566173' },
]

export default function CaseStatusUpdater({ caseId, currentStatus }: { caseId: string; currentStatus: string }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [note, setNote]     = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState('')

  const current = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
  const changed = status !== currentStatus

  async function handleSave() {
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/update-case-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId, status, note: note.trim() || null }),
    })
    if (res.ok) {
      setSaved(true)
      setNote('')
      setTimeout(() => { setSaved(false); router.refresh() }, 1500)
    } else {
      const { error: e } = await res.json()
      setError(e || 'Failed to update')
    }
    setSaving(false)
  }

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e7e9f0', padding: '24px', boxShadow: '0 1px 2px rgba(17,27,49,.04)' }}>
      <div style={{ fontFamily: 'Lora, serif', fontSize: '16px', fontWeight: 600, color: '#1a2744', marginBottom: '16px' }}>
        Case Status
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#586176', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: '6px' }}>
          Current Status
        </label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', border: `2px solid ${current.color}`,
            borderRadius: '9px', background: current.bg, color: current.color,
            fontSize: '14px', fontWeight: 700, cursor: 'pointer', outline: 'none',
          }}
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#586176', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: '6px' }}>
          Note to Client (optional)
        </label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. We submitted your I-129 to USCIS on June 8th. Expect a receipt notice within 2–3 weeks."
          style={{
            width: '100%', padding: '10px 12px', border: '1.5px solid #e7e9f0',
            borderRadius: '9px', fontSize: '13px', minHeight: '80px',
            boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical', outline: 'none',
          }}
        />
      </div>

      {error && (
        <div style={{ fontSize: '13px', color: '#b42318', marginBottom: '10px' }}>{error}</div>
      )}

      <button
        onClick={handleSave}
        disabled={saving || saved || !changed}
        style={{
          width: '100%', padding: '11px', borderRadius: '9px', border: 'none',
          background: saved ? '#e6f6ef' : (changed ? 'linear-gradient(135deg,#1a2744,#243355)' : '#f0f2f5'),
          color: saved ? '#047857' : (changed ? '#fff' : '#98a0b0'),
          fontSize: '14px', fontWeight: 700, cursor: (saving || !changed) ? 'not-allowed' : 'pointer',
          transition: 'all .15s',
        }}
      >
        {saved ? '✓ Saved & client notified' : saving ? 'Saving…' : changed ? 'Save & Notify Client' : 'No changes'}
      </button>
      {changed && !saved && (
        <p style={{ fontSize: '11px', color: '#98a0b0', marginTop: '8px', textAlign: 'center' }}>
          An email will be sent to the client when you save.
        </p>
      )}
    </div>
  )
}
