import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  invited:  { bg: '#fef3c7', color: '#92400e', label: 'Invited' },
  active:   { bg: '#d1fae5', color: '#065f46', label: 'Active' },
  inactive: { bg: '#f3f4f6', color: '#4b5563', label: 'Inactive' },
}

export default async function BeneficiariesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role, full_name').eq('id', user.id).single()

  // Only sponsors and admins can access this page
  if (profile?.role !== 'sponsor' && profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: beneficiaries } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('sponsor_id', user.id)
    .order('created_at', { ascending: false })

  const activeCount   = beneficiaries?.filter(b => b.status === 'active').length ?? 0
  const invitedCount  = beneficiaries?.filter(b => b.status === 'invited').length ?? 0

  return (
    <div className="portal">
      <aside className="portal-sidebar">
        <Link href="/" className="portal-logo">
          <img src="/logo-bird.png" alt="OSIS" />
          <span>One Stop<br />Immigration</span>
        </Link>
        <nav className="portal-nav">
          <Link href="/dashboard" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </Link>
          <Link href="/dashboard/cases" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
            Cases
          </Link>
          <Link href="/dashboard/appointments" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Appointments
          </Link>
          <Link href="/dashboard/documents" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            Documents
          </Link>
          <Link href="/dashboard/beneficiaries" className="portal-nav-link active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Beneficiaries
          </Link>
          <Link href="/dashboard/tickets" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Support
          </Link>
          <Link href="/dashboard/profile" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
          </Link>
        </nav>
      </aside>

      <main className="portal-main">
        <div className="portal-header">
          <div>
            <h1>Beneficiaries</h1>
            <p style={{color:'#6b7280', fontSize:'15px', margin:'4px 0 0'}}>
              Employees and individuals you are sponsoring
            </p>
          </div>
          <Link href="/dashboard/beneficiaries/add" className="btn btn--gold btn--sm">
            + Add Beneficiary
          </Link>
        </div>

        {/* Stats row */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px', marginBottom:'28px'}}>
          {[
            { num: beneficiaries?.length ?? 0, label: 'Total Beneficiaries' },
            { num: activeCount,  label: 'Active' },
            { num: invitedCount, label: 'Pending Invitation' },
          ].map((stat, i) => (
            <div key={i} style={{
              background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px',
              padding:'20px 24px', boxShadow:'0 1px 3px rgba(0,0,0,.05)'
            }}>
              <div style={{fontFamily:'Lora, serif', fontSize:'32px', fontWeight:700, color:'#1a2744'}}>{stat.num}</div>
              <div style={{fontSize:'13px', color:'#6b7280', marginTop:'2px'}}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Beneficiary list */}
        {beneficiaries && beneficiaries.length > 0 ? (
          <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            {beneficiaries.map(b => {
              const s = statusColors[b.status] || statusColors.invited
              const initials = b.full_name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()
              return (
                <div key={b.id} style={{
                  background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px',
                  padding:'18px 22px', display:'flex', alignItems:'center', gap:'16px'
                }}>
                  {/* Avatar */}
                  <div style={{
                    width:44, height:44, borderRadius:'50%', background:'#1a2744',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'Lora, serif', fontSize:'16px', fontWeight:700,
                    color:'#b8952a', flexShrink:0
                  }}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:'15px', fontWeight:600, color:'#1a2744', marginBottom:'3px'}}>
                      {b.full_name}
                    </div>
                    <div style={{fontSize:'13px', color:'#6b7280', display:'flex', gap:'12px', flexWrap:'wrap'}}>
                      <span>{b.email}</span>
                      {b.phone && <span>·  {b.phone}</span>}
                      {b.visa_type && (
                        <span style={{
                          background:'#1a2744', color:'#fff', borderRadius:'4px',
                          padding:'1px 8px', fontSize:'11px', fontWeight:700, fontFamily:'monospace'
                        }}>
                          {b.visa_type}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div style={{display:'flex', alignItems:'center', gap:'12px', flexShrink:0}}>
                    <span style={{background:s.bg, color:s.color, padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:600}}>
                      {s.label}
                    </span>
                    <div style={{fontSize:'12px', color:'#9ca3af', textAlign:'right'}}>
                      Added {new Date(b.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="portal-empty" style={{marginTop:'60px'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <h3 style={{color:'#1a2744', fontFamily:'Lora, serif', margin:'12px 0 6px'}}>No beneficiaries yet</h3>
            <p>Add the employees or individuals you are sponsoring for their immigration cases.</p>
            <Link href="/dashboard/beneficiaries/add" className="btn btn--navy"
              style={{marginTop:'16px', display:'inline-block', textDecoration:'none'}}>
              Add First Beneficiary
            </Link>
          </div>
        )}

        {/* Info box */}
        <div style={{
          marginTop:'32px', background:'#eff6ff', border:'1px solid #bfdbfe',
          borderRadius:'12px', padding:'20px 24px', display:'flex', gap:'16px', alignItems:'flex-start'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20,flexShrink:0,marginTop:2}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          <div>
            <div style={{fontSize:'14px', fontWeight:600, color:'#1d4ed8', marginBottom:'4px'}}>About Beneficiary Accounts</div>
            <div style={{fontSize:'13px', color:'#1d4ed8', opacity:.8, lineHeight:1.6}}>
              Beneficiaries you add here can register on the portal with their email address and will automatically be linked to your sponsorship. Their cases will be visible to both of you.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
