'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AddContactPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
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

    const { error: err } = await supabase.from('contacts').insert({
      sponsor_id:       user.id,
      full_name:        fullName.trim(),
      email:            email.trim().toLowerCase(),
      phone:            phone.trim() || null,
      role_description: roleDescription.trim() || null,
    })

    if (err) {
      setError('Failed to add contact: ' + err.message)
      setLoading(false)
    } else {
      router.push('/dashboard/contacts')
    }
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/contacts">HR Contacts</Link>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        <span style={{color:'#1a2744', fontWeight:600}}>Add Contact</span>
      </div>

      <div className="portal-header">
        <div>
          <h1>Add HR Contact</h1>
          <p style={{color:'#586176', fontSize:'15px', margin:'4px 0 0'}}>
            Add an HR or admin contact at your company
          </p>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 300px', gap:'24px', alignItems:'start'}}>
        <div className="card">
          {error && (
            <div className="auth-error" style={{marginBottom:'16px'}}>{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label" htmlFor="fullName">Full Name *</label>
              <input id="fullName" type="text" className="form-input"
                value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Jennifer Smith" required />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="email">Work Email *</label>
              <input id="email" type="email" className="form-input"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="jennifer@company.com" required />
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label" htmlFor="phone">Phone (optional)</label>
                <input id="phone" type="tel" className="form-input"
                  value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="(555) 000-0000" />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="role">Role / Title (optional)</label>
                <input id="role" type="text" className="form-input"
                  value={roleDescription} onChange={e => setRoleDescription(e.target.value)}
                  placeholder="e.g. HR Manager" />
              </div>
            </div>

            <div style={{display:'flex', gap:'12px', marginTop:'8px'}}>
              <button type="submit" className="btn btn--navy" disabled={loading}
                style={{flex:1, padding:'13px', justifyContent:'center'}}>
                {loading ? 'Adding…' : 'Add Contact'}
              </button>
              <Link href="/dashboard/contacts" className="btn btn--outline-navy"
                style={{padding:'13px 24px', textDecoration:'none'}}>
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="card">
          <h2 style={{fontFamily:'Lora, serif', fontSize:'17px', color:'#1a2744', margin:'0 0 16px'}}>
            What are HR Contacts?
          </h2>
          <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
            {[
              {icon:'👔', title:'Company representatives', desc:'HR managers or admins who coordinate immigration matters on behalf of your company'},
              {icon:'📋', title:'Case coordination', desc:'They receive updates and help gather company documents needed for visa petitions'},
              {icon:'📞', title:'Primary point of contact', desc:"Our team will reach out to them directly when we need your company's input"},
            ].map((item, i) => (
              <div key={i} style={{display:'flex', gap:'12px', alignItems:'flex-start',
                paddingBottom:'12px', borderBottom: i < 2 ? '1px solid #e7e9f0' : 'none'}}>
                <span style={{fontSize:'20px', flexShrink:0}}>{item.icon}</span>
                <div>
                  <div style={{fontSize:'14px', fontWeight:600, color:'#1a2744'}}>{item.title}</div>
                  <div style={{fontSize:'13px', color:'#586176', marginTop:'2px', lineHeight:1.5}}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
