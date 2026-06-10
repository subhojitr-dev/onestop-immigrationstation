'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Props {
  callerRole: string
  companyName: string
  allowedRoles: ('sponsor' | 'beneficiary')[]
}

export default function InviteMemberForm({ callerRole, companyName, allowedRoles }: Props) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    role: allowedRoles[0],
    address: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('First name, last name, email, and phone are required.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/contact/invite-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setSuccess(`${data.name} has been invited! They'll receive an email to set their password and log in.`)
      setForm({ firstName: '', lastName: '', email: '', phone: '', role: allowedRoles[0], address: '' })
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e7e9f0', borderRadius: '10px',
    fontSize: '14px', color: '#16203a', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    background: '#fff',
  }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a2744', marginBottom: '6px' }

  const roleDescriptions: Record<string, string> = {
    beneficiary: 'The visa applicant — employee being sponsored or family member applying.',
    sponsor: 'The US employer or petitioner sponsoring the visa.',
  }

  return (
    <div style={{ padding: '32px', maxWidth: '560px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#98a0b0', marginBottom: '24px' }}>
        <Link href="/dashboard/team" style={{ color: '#586176', textDecoration: 'none', fontWeight: 500 }}>Team</Link>
        <span>›</span>
        <span style={{ color: '#1a2744', fontWeight: 600 }}>Invite Member</span>
      </div>

      <h1 style={{ fontFamily: 'Lora, serif', fontSize: '24px', color: '#1a2744', margin: '0 0 6px' }}>Invite a Team Member</h1>

      {companyName && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e8effe', color: '#1d4ed8', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
          </svg>
          {companyName}
        </div>
      )}

      <p style={{ fontSize: '14px', color: '#98a0b0', margin: '0 0 28px', lineHeight: 1.6 }}>
        They'll receive an email with a link to create their password and access the portal.
        First name, last name, email, and phone are required.
      </p>

      {error && (
        <div style={{ background: '#fdeceb', color: '#b42318', borderRadius: '10px', padding: '12px 16px', marginBottom: '18px', fontSize: '14px' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#e6f6ef', color: '#047857', borderRadius: '10px', padding: '14px 16px', marginBottom: '18px', fontSize: '14px', lineHeight: 1.6 }}>
          <strong>Invited!</strong> {success}
          <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
            <Link href="/dashboard/team" style={{ color: '#047857', fontWeight: 700, textDecoration: 'underline' }}>← Back to Team</Link>
            <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', color: '#047857', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: '14px' }}>
              Invite another
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e7e9f0', display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Role — only show selector if caller has a choice */}
        {allowedRoles.length > 1 ? (
          <div>
            <label style={labelStyle}>Role <span style={{ color: '#b42318' }}>*</span></label>
            <select value={form.role} onChange={e => set('role', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="beneficiary">Beneficiary (visa applicant / employee)</option>
              <option value="sponsor">Sponsor (employer / petitioner)</option>
            </select>
            <div style={{ fontSize: '12px', color: '#98a0b0', marginTop: '5px' }}>
              {roleDescriptions[form.role]}
            </div>
          </div>
        ) : (
          <div>
            <label style={labelStyle}>Inviting as</label>
            <div style={{ padding: '10px 14px', background: '#f4f6fb', borderRadius: '10px', border: '1.5px solid #e7e9f0', fontSize: '14px', color: '#586176', fontWeight: 600, textTransform: 'capitalize' }}>
              {allowedRoles[0]} — {roleDescriptions[allowedRoles[0]]}
            </div>
          </div>
        )}

        {/* Name row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={labelStyle}>First Name <span style={{ color: '#b42318' }}>*</span></label>
            <input style={inputStyle} value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Jane" required />
          </div>
          <div>
            <label style={labelStyle}>Last Name <span style={{ color: '#b42318' }}>*</span></label>
            <input style={inputStyle} value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Smith" required />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Email Address <span style={{ color: '#b42318' }}>*</span></label>
          <input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane.smith@company.com" required />
        </div>

        <div>
          <label style={labelStyle}>Phone Number <span style={{ color: '#b42318' }}>*</span></label>
          <input style={inputStyle} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 123-4567" required />
        </div>

        <div>
          <label style={labelStyle}>Address <span style={{ color: '#98a0b0', fontWeight: 400 }}>(optional)</span></label>
          <input style={inputStyle} value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, New York, NY 10001" />
        </div>

        <button type="submit" disabled={saving}
          style={{
            padding: '13px 28px', borderRadius: '10px', border: 'none',
            background: saving ? '#eef0f4' : 'linear-gradient(135deg,#1a2744,#243355)',
            color: saving ? '#98a0b0' : '#fff',
            fontSize: '15px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
            marginTop: '4px',
          }}>
          {saving ? 'Sending invite…' : 'Send Invitation'}
        </button>
      </form>
    </div>
  )
}
