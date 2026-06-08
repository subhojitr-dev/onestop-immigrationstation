'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const VISA_TYPES = [
  'H-1B', 'L-1', 'O-1', 'TN', 'E-2',
  'Green Card', 'K-1', 'K-3', 'Family Petition',
  'U Visa', 'DACA', 'Asylum', 'I-9 Compliance', 'Other',
]

interface Client {
  id: string
  full_name: string | null
  email: string
}

export default function NewCaseForm({ clients, lawyerName }: { clients: Client[]; lawyerName: string }) {
  const router = useRouter()
  const [open, setOpen]               = useState(false)
  const [clientId, setClientId]       = useState('')
  const [visaType, setVisaType]       = useState('')
  const [description, setDescription] = useState('')
  const [attorney, setAttorney]       = useState(lawyerName)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientId || !visaType) { setError('Client and visa type are required'); return }
    setSaving(true)
    setError('')

    const res = await fetch('/api/admin/create-case', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientUserId: clientId, visaType, description, assignedAttorney: attorney }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to create case')
      setSaving(false)
      return
    }

    // Navigate to the new case
    router.push(`/admin/cases/${data.caseId}`)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ background: 'linear-gradient(135deg,#cfa94a,#b8952a)', color: '#0b1322', padding: '10px 18px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        + New Case
      </button>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1.5px solid #e7e9f0', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ background: '#fff', border: '1.5px solid #cfa94a', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(184,149,42,.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'Lora, serif', fontSize: '18px', fontWeight: 600, color: '#1a2744' }}>Open New Case</div>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#98a0b0', cursor: 'pointer', lineHeight: 1 }}>×</button>
      </div>

      {error && (
        <div style={{ background: '#fdeceb', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#b42318' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#586176', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Client *</label>
            <select value={clientId} onChange={e => setClientId(e.target.value)} required style={inputStyle}>
              <option value="">Select client…</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.full_name || c.email} {c.full_name ? `(${c.email})` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#586176', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Visa Type *</label>
            <select value={visaType} onChange={e => setVisaType(e.target.value)} required style={inputStyle}>
              <option value="">Select visa type…</option>
              {VISA_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#586176', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Assigned Attorney</label>
          <input value={attorney} onChange={e => setAttorney(e.target.value)} style={inputStyle} placeholder="Attorney name" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#586176', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Description / Notes</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Case details, client situation, special circumstances…" style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => setOpen(false)} style={{ padding: '10px 20px', borderRadius: '9px', border: '1.5px solid #e7e9f0', background: '#fff', color: '#586176', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button type="submit" disabled={saving} style={{ padding: '10px 24px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg,#1a2744,#243355)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>
            {saving ? 'Creating…' : 'Create Case'}
          </button>
        </div>
      </form>
    </div>
  )
}
