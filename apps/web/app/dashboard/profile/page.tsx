'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()

      if (data) {
        setProfile(data)
        setFullName(data.full_name || '')
        setPhone(data.phone || '')
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (error) {
      setMessage('Error saving: ' + error.message)
    } else {
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    }
    setSaving(false)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
      <p>Loading…</p>
    </div>
  )

  const roleLabels: Record<string, string> = {
    beneficiary: 'Individual / Beneficiary',
    sponsor: 'Employer / Sponsor',
    contact: 'HR Contact',
    lawyer: 'Attorney',
    admin: 'Administrator',
  }

  return (
    <>
      <div className="portal-header">
          <div>
            <h1>My Profile</h1>
            <p style={{color:'#6b7280', fontSize:'15px', margin:'4px 0 0'}}>
              Manage your account information
            </p>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px', alignItems:'start'}}>
          {/* Edit form */}
          <div className="portal-section">
            <div className="portal-section-head">
              <h2>Personal Information</h2>
            </div>

            {message && (
              <div style={{
                padding:'10px 16px', borderRadius:'8px', marginBottom:'16px',
                background: message.includes('Error') ? '#fee2e2' : '#d1fae5',
                color: message.includes('Error') ? '#991b1b' : '#065f46',
                fontSize:'14px'
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="auth-field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  style={{background:'#f9fafb', color:'#6b7280', cursor:'not-allowed'}}
                />
                <span style={{fontSize:'12px', color:'#9ca3af', marginTop:'4px', display:'block'}}>
                  Email cannot be changed here
                </span>
              </div>
              <div className="auth-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                />
              </div>
              <button type="submit" className="btn btn--navy" disabled={saving} style={{marginTop:'8px'}}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Account info card */}
          <div>
            <div className="portal-section">
              <div className="portal-section-head">
                <h2>Account</h2>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                <div>
                  <div style={{fontSize:'11px', color:'#9ca3af', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:600, marginBottom:'4px'}}>Account Type</div>
                  <span className="portal-role-badge" data-role={profile?.role}>
                    {roleLabels[profile?.role] || profile?.role}
                  </span>
                </div>
                <div>
                  <div style={{fontSize:'11px', color:'#9ca3af', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:600, marginBottom:'4px'}}>Member Since</div>
                  <div style={{fontSize:'14px', color:'#1a2744'}}>
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {month:'long', year:'numeric'}) : '—'}
                  </div>
                </div>
                <div style={{paddingTop:'12px', borderTop:'1px solid #e5e7eb'}}>
                  <Link href="/forgot-password" style={{fontSize:'14px', color:'#1a2744', fontWeight:600, textDecoration:'none'}}>
                    Change Password →
                  </Link>
                </div>
              </div>
            </div>

            <div className="portal-section" style={{marginTop:'16px', background:'#fef2f2', border:'1px solid #fecaca'}}>
              <h2 style={{color:'#991b1b', fontSize:'16px'}}>Danger Zone</h2>
              <p style={{fontSize:'13px', color:'#6b7280', marginBottom:'12px'}}>
                Need to delete your account? Contact our support team.
              </p>
              <a href="mailto:admin@mylegalimigrationservices.com?subject=Account Deletion Request"
                style={{fontSize:'13px', color:'#991b1b', fontWeight:600}}>
                Request account deletion →
              </a>
            </div>
          </div>
        </div>
    </>
  )
}
