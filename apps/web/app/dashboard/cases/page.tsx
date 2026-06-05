import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CasesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'beneficiary'

  // Fetch cases based on role
  let query = supabase
    .from('cases')
    .select('*')
    .order('opened_date', { ascending: false })

  if (role === 'sponsor') {
    query = query.eq('sponsor_id', user.id)
  } else if (role === 'lawyer' || role === 'admin') {
    // lawyers see all cases
  } else {
    query = query.eq('user_id', user.id)
  }

  const { data: cases } = await query

  const statusColors: Record<string, { bg: string; color: string; label: string }> = {
    open:               { bg: '#dbeafe', color: '#1d4ed8', label: 'Open' },
    in_progress:        { bg: '#fef3c7', color: '#92400e', label: 'In Progress' },
    pending_documents:  { bg: '#fee2e2', color: '#991b1b', label: 'Pending Docs' },
    submitted:          { bg: '#ede9fe', color: '#5b21b6', label: 'Submitted' },
    approved:           { bg: '#d1fae5', color: '#065f46', label: 'Approved' },
    denied:             { bg: '#fee2e2', color: '#991b1b', label: 'Denied' },
    closed:             { bg: '#f3f4f6', color: '#4b5563', label: 'Closed' },
  }

  return (
    <div className="portal">
      {/* Sidebar */}
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
          <Link href="/dashboard/cases" className="portal-nav-link active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
            My Cases
          </Link>
          <Link href="/dashboard/appointments" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Appointments
          </Link>
          <Link href="/dashboard/documents" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            Documents
          </Link>
          {role === 'sponsor' && (
            <Link href="/dashboard/beneficiaries" className="portal-nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Beneficiaries
            </Link>
          )}
          <Link href="/dashboard/tickets" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Support
          </Link>
          <Link href="/dashboard/profile" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
          </Link>
        </nav>
        <div style={{padding:'12px', borderTop:'1px solid rgba(255,255,255,.1)'}}>
          <Link href="/dashboard" style={{display:'flex',alignItems:'center',gap:'8px',color:'rgba(255,255,255,.6)',fontSize:'13px',textDecoration:'none'}}>
            ← Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="portal-main">
        <div className="portal-header">
          <div>
            <h1>My Cases</h1>
            <p style={{color:'#6b7280', fontSize:'15px', margin:'4px 0 0'}}>
              Track the status of all your immigration cases
            </p>
          </div>
          <Link href="/contact" className="btn btn--gold btn--sm">
            + New Consultation
          </Link>
        </div>

        {/* Filter bar */}
        <div className="cases-filters">
          {Object.entries(statusColors).map(([key, val]) => (
            <span key={key} className="case-filter-chip" style={{background: val.bg, color: val.color}}>
              {val.label}
              <span className="chip-count">
                {cases?.filter(c => c.status === key).length ?? 0}
              </span>
            </span>
          ))}
        </div>

        {/* Cases list */}
        {cases && cases.length > 0 ? (
          <div className="cases-list">
            {cases.map(c => {
              const s = statusColors[c.status] || statusColors.open
              return (
                <div key={c.id} className="case-card">
                  <div className="case-card-left">
                    <div className="case-visa-badge">{c.visa_type}</div>
                    <div>
                      <div className="case-number">{c.case_number}</div>
                      <div className="case-desc">{c.description || 'No description provided'}</div>
                      {c.assigned_attorney && (
                        <div className="case-attorney">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          Attorney: {c.assigned_attorney}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="case-card-right">
                    <span className="pt-status" style={{background: s.bg, color: s.color}}>
                      {s.label}
                    </span>
                    <div className="case-dates">
                      <span>Opened: {new Date(c.opened_date).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}</span>
                      {c.updated_at && (
                        <span>Updated: {new Date(c.updated_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}</span>
                      )}
                    </div>
                    <Link href={`/dashboard/cases/${c.id}`} className="btn btn--outline-navy" style={{fontSize:'13px', padding:'6px 14px'}}>
                      View Details →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="portal-empty" style={{marginTop:'60px'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>
            <h3 style={{color:'#1a2744', fontFamily:'Lora, serif', margin:'12px 0 6px'}}>No cases yet</h3>
            <p>Your immigration cases will appear here once our team opens them for you.</p>
            <Link href="/contact" className="btn btn--navy" style={{marginTop:'16px', display:'inline-block', textDecoration:'none'}}>
              Book a Free Consultation
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
