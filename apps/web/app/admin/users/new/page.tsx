/**
 * app/admin/users/new/page.tsx
 *
 * Add New Lawyer — admin form to create a lawyer account directly.
 *
 * What happens when you submit:
 *   1. Supabase auth user is created via Admin API (no email confirmation needed)
 *   2. Profile row created with role = 'lawyer' and all entered details
 *   3. Welcome email sent to the lawyer with a link to set their password
 *   4. Lawyer can then log in and is redirected to /admin automatically
 *
 * The lawyer does NOT need to sign up themselves — this creates everything for them.
 */
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddLawyerPage() {
  const router = useRouter()
  const [firstName,     setFirstName]     = useState('')
  const [lastName,      setLastName]      = useState('')
  const [email,         setEmail]         = useState('')
  const [phone,         setPhone]         = useState('')
  const [address,       setAddress]       = useState('')
  const [gender,        setGender]        = useState('')
  const [dateOfBirth,   setDateOfBirth]   = useState('')
  const [qualification, setQualification] = useState('')
  const [saving,        setSaving]        = useState(false)
  const [error,         setError]         = useState('')
  const [success,       setSuccess]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName || !lastName || !email) {
      setError('First name, last name, and email are required')
      return
    }
    setSaving(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/admin/create-lawyer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, phone, address, gender, dateOfBirth, qualification }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to create lawyer account')
      setSaving(false)
      return
    }

    setSuccess(`✓ ${data.name}'s account created. A welcome email has been sent to ${email} with instructions to set their password.`)
    setSaving(false)
    // Clear form
    setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setAddress('')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e7e9f0',
    borderRadius: '10px', fontFamily: 'inherit', fontSize: '14px',
    color: '#16203a', outline: 'none', background: '#fff', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: 600, color: '#16203a', marginBottom: '6px',
  }

  return (
    <div style={{ padding: '32px', maxWidth: '680px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#98a0b0', marginBottom: '24px' }}>
        <Link href="/admin/users" style={{ color: '#586176', textDecoration: 'none', fontWeight: 500 }}>Users</Link>
        <span>›</span>
        <span style={{ color: '#1a2744', fontWeight: 600 }}>Add New Lawyer</span>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: '26px', color: '#1a2744', margin: '0 0 6px' }}>Add New Lawyer</h1>
        <p style={{ color: '#586176', fontSize: '15px', margin: 0 }}>
          Creates a lawyer account and sends them a welcome email to set their password.
        </p>
      </div>

      {error && (
        <div style={{ background: '#fdeceb', color: '#b42318', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '14px', lineHeight: 1.6 }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ background: '#e6f6ef', color: '#047857', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '14px', lineHeight: 1.6 }}>
          {success}
          <div style={{ marginTop: '12px' }}>
            <Link href="/admin/users" style={{ color: '#047857', fontWeight: 700 }}>← Back to Users</Link>
          </div>
        </div>
      )}

      {!success && <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e7e9f0' }}>
        <form onSubmit={handleSubmit}>
          {/* Name row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            <div>
              <label style={labelStyle}>First Name *</label>
              <input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Sarah"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name *</label>
              <input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Johnson"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="sarah.johnson@onestopimmigration.com"
              required
              style={inputStyle}
            />
            <div style={{ fontSize: '12px', color: '#98a0b0', marginTop: '5px' }}>
              A welcome email will be sent here with a link to set their password.
            </div>
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(212) 555-0100"
              style={inputStyle}
            />
          </div>

          {/* Address */}
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Office Address</label>
            <input
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="69 Station Avenue, Suite 2445, New York, NY 10001"
              style={inputStyle}
            />
          </div>

          {/* Gender + DOB row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            <div>
              <label style={labelStyle}>Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} style={{...inputStyle, color: gender ? '#16203a' : '#98a0b0'}}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Qualification */}
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>Legal Qualification</label>
            <select value={qualification} onChange={e => setQualification(e.target.value)} style={{...inputStyle, color: qualification ? '#16203a' : '#98a0b0'}}>
              <option value="">Select qualification</option>
              <option value="jd">Juris Doctor (JD)</option>
              <option value="llm">Master of Laws (LLM)</option>
              <option value="llb">Bachelor of Laws (LLB)</option>
              <option value="sjd">Doctor of Juridical Science (SJD)</option>
              <option value="paralegal">Paralegal Certificate</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Info box */}
          <div style={{ background: '#f0f4ff', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#1d4ed8', lineHeight: 1.6 }}>
            ℹ️ The lawyer will receive a <strong>Welcome Email</strong> at the address above.
            They click <strong>"Set My Password"</strong> in the email, choose a password, then log in.
            They are automatically directed to the <strong>Admin Panel</strong> when they sign in.
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{ flex: 1, padding: '13px', borderRadius: '10px', border: 'none', background: saving ? '#eef0f4' : 'linear-gradient(135deg,#cfa94a,#b8952a)', color: saving ? '#98a0b0' : '#0b1322', fontSize: '15px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Creating Account…' : 'Create Lawyer Account'}
            </button>
            <Link href="/admin/users"
              style={{ padding: '13px 20px', borderRadius: '10px', border: '1.5px solid #e7e9f0', background: '#fff', color: '#586176', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>}

      {/* What happens next */}
      {!success && <div style={{ marginTop: '20px', background: '#fff', borderRadius: '16px', padding: '22px', border: '1px solid #e7e9f0' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a2744', marginBottom: '14px' }}>What happens after you create the account:</div>
        {[
          { step: '1', text: 'Account is created instantly with Lawyer role' },
          { step: '2', text: 'Welcome email sent to the lawyer' },
          { step: '3', text: 'Lawyer clicks "Set My Password" in the email' },
          { step: '4', text: 'Lawyer logs in → automatically directed to Admin Panel' },
          { step: '5', text: 'Lawyer goes to Availability to set their consultation slots' },
        ].map(item => (
          <div key={item.step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#cfa94a,#b8952a)', color: '#0b1322', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
              {item.step}
            </div>
            <span style={{ fontSize: '13px', color: '#586176', paddingTop: '3px', lineHeight: 1.5 }}>{item.text}</span>
          </div>
        ))}
      </div>}
    </div>
  )
}
