import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'beneficiary'
  const name = profile?.full_name || user.email || 'there'

  // Role-specific data
  const { data: cases } = await supabase
    .from('cases')
    .select('id, case_number, visa_type, status, opened_date')
    .or(`user_id.eq.${user.id},sponsor_id.eq.${user.id}`)
    .order('opened_date', { ascending: false })
    .limit(5)

  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, date, time_slot, status, is_free')
    .eq('user_id', user.id)
    .order('date', { ascending: true })
    .limit(3)

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  const statusColors: Record<string, string> = {
    open: '#3b82f6',
    in_progress: '#f59e0b',
    pending_documents: '#ef4444',
    submitted: '#8b5cf6',
    approved: '#10b981',
    denied: '#ef4444',
    closed: '#6b7280',
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
          <Link href="/dashboard" className="portal-nav-link active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </Link>
          <Link href="/dashboard/cases" className="portal-nav-link">
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
          {(role === 'sponsor') && (
            <Link href="/dashboard/beneficiaries" className="portal-nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Beneficiaries
            </Link>
          )}
          <Link href="/dashboard/profile" className="portal-nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
          </Link>
        </nav>
        <form action={signOut} className="portal-signout-form">
          <button type="submit" className="portal-signout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </form>
      </aside>

      {/* Main content */}
      <main className="portal-main">
        <div className="portal-header">
          <div>
            <h1>Welcome back, {name.split(' ')[0]} 👋</h1>
            <p className="portal-role-badge" data-role={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</p>
          </div>
          <Link href="/contact" className="btn btn--gold btn--sm">Book Consultation</Link>
        </div>

        {/* Stats */}
        <div className="portal-stats">
          <div className="portal-stat">
            <span className="ps-num">{cases?.length ?? 0}</span>
            <span className="ps-lbl">Active Cases</span>
          </div>
          <div className="portal-stat">
            <span className="ps-num">{appointments?.filter(a => a.status === 'confirmed').length ?? 0}</span>
            <span className="ps-lbl">Upcoming Appointments</span>
          </div>
          <div className="portal-stat">
            <span className="ps-num">{appointments?.filter(a => a.is_free).length ?? 0} / 2</span>
            <span className="ps-lbl">Free Consultations Used</span>
          </div>
        </div>

        {/* Cases */}
        <section className="portal-section">
          <div className="portal-section-head">
            <h2>Recent Cases</h2>
            <Link href="/dashboard/cases" className="link-arrow">View all →</Link>
          </div>
          {cases && cases.length > 0 ? (
            <div className="portal-table">
              <div className="pt-head">
                <span>Case #</span><span>Visa Type</span><span>Status</span><span>Opened</span>
              </div>
              {cases.map(c => (
                <div key={c.id} className="pt-row">
                  <span className="pt-case-num">{c.case_number}</span>
                  <span>{c.visa_type}</span>
                  <span>
                    <span className="pt-status" style={{background: statusColors[c.status] + '20', color: statusColors[c.status]}}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </span>
                  <span className="pt-date">{new Date(c.opened_date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="portal-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
              <p>No cases yet. <Link href="/contact">Book a free consultation</Link> to get started.</p>
            </div>
          )}
        </section>

        {/* Appointments */}
        <section className="portal-section">
          <div className="portal-section-head">
            <h2>Upcoming Appointments</h2>
            <Link href="/dashboard/appointments" className="link-arrow">View all →</Link>
          </div>
          {appointments && appointments.length > 0 ? (
            <div className="portal-appts">
              {appointments.map(a => (
                <div key={a.id} className="portal-appt">
                  <div className="pa-date">
                    <span className="pa-day">{new Date(a.date).getDate()}</span>
                    <span className="pa-mon">{new Date(a.date).toLocaleDateString('en', {month:'short'})}</span>
                  </div>
                  <div className="pa-info">
                    <span className="pa-time">{a.time_slot}</span>
                    {a.is_free && <span className="pa-free">Free Consultation</span>}
                  </div>
                  <span className="pt-status" style={{marginLeft:'auto', background: a.status === 'confirmed' ? '#10b98120' : '#f59e0b20', color: a.status === 'confirmed' ? '#10b981' : '#f59e0b'}}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="portal-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <p>No appointments scheduled. <Link href="/contact">Book your free consultation.</Link></p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
