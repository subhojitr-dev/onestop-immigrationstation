'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const VISA_TYPES = [
  'H-1B', 'H-2A', 'H-2B', 'L-1A', 'L-1B', 'O-1', 'TN',
  'EB-1', 'EB-2', 'EB-3', 'I-485', 'K-1', 'K-3', 'F-1',
  'J-1', 'E-2', 'Other'
]

export default function AddBeneficiaryPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [visaType, setVisaType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) {
      setError('Full name and email are required')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: err } = await supabase.from('beneficiaries').insert({
      sponsor_id: user.id,
      full_name:  fullName.trim(),
      email:      email.trim().toLowerCase(),
      phone:      phone.trim() || null,
      visa_type:  visaType || null,
      status:     'invited',
    })

    if (err) {
      setError('Failed to add beneficiary: ' + err.message)
      setLoading(false)
    } else {
      router.push('/dashboard/beneficiaries')
    }
  }

  return (
    <>
      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px', fontSize:'14px', color:'#6b7280'}}>
          <Link href="/dashboard/beneficiaries" style={{color:'#6b7280', textDecoration:'none'}}>Beneficiaries</Link>
          <span>→</span>
          <span style={{color:'#1a2744', fontWeight:500}}>Add Beneficiary</span>
        </div>

        <div className="portal-header">
          <div>
            <h1>Add a Beneficiary</h1>
            <p style={{color:'#6b7280', fontSize:'15px', margin:'4px 0 0'}}>
              Add an employee or individual you are sponsoring
            </p>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 300px', gap:'24px', alignItems:'start'}}>
          <div className="portal-section">
            {error && (
              <div className="auth-error" style={{marginBottom:'16px'}}>{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Maria Garcia"
                  required
                  style={{fontSize:'15px', padding:'10px 14px'}}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="beneficiary@company.com"
                  required
                  style={{fontSize:'15px', padding:'10px 14px'}}
                />
                <span style={{fontSize:'12px', color:'#9ca3af', marginTop:'4px', display:'block'}}>
                  They will use this email to register on the portal
                </span>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
                <div className="auth-field">
                  <label htmlFor="phone">Phone Number (optional)</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    style={{fontSize:'15px', padding:'10px 14px'}}
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="visaType">Visa Type (optional)</label>
                  <select
                    id="visaType"
                    value={visaType}
                    onChange={e => setVisaType(e.target.value)}
                    style={{
                      width:'100%', padding:'10px 14px',
                      border:'1.5px solid #e5e7eb', borderRadius:'8px',
                      fontSize:'15px', background:'#fff'
                    }}
                  >
                    <option value="">Select visa type</option>
                    {VISA_TYPES.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{display:'flex', gap:'12px', marginTop:'8px'}}>
                <button
                  type="submit"
                  className="btn btn--navy"
                  disabled={loading}
                  style={{flex:1, padding:'13px', justifyContent:'center'}}
                >
                  {loading ? 'Adding…' : 'Add Beneficiary'}
                </button>
                <Link
                  href="/dashboard/beneficiaries"
                  className="btn btn--outline-navy"
                  style={{padding:'13px 24px', textDecoration:'none'}}
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Info */}
          <div className="portal-section">
            <h2 style={{fontFamily:'Lora, serif', fontSize:'17px', color:'#1a2744', margin:'0 0 16px'}}>What happens next</h2>
            <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
              {[
                {step:'1', title:'Beneficiary is added', desc:'They appear in your beneficiaries list with "Invited" status'},
                {step:'2', title:'They register', desc:'They sign up at onestopimmigrationstation.com using the same email — they\'ll be automatically linked to you'},
                {step:'3', title:'Cases are opened', desc:'Our team opens immigration cases linked to both of you so you can both track progress'},
              ].map(item => (
                <div key={item.step} style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
                  <div style={{
                    width:28, height:28, borderRadius:'50%', background:'#1a2744',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'#b8952a', fontWeight:700, fontSize:'13px', flexShrink:0
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <div style={{fontSize:'14px', fontWeight:600, color:'#1a2744'}}>{item.title}</div>
                    <div style={{fontSize:'13px', color:'#6b7280', marginTop:'2px', lineHeight:1.5}}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </>
  )
}
