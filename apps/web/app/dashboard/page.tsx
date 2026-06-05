import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ServiceRedirect from '@/components/ServiceRedirect'


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

  const isNewUser = (cases?.length ?? 0) === 0 && (appointments?.length ?? 0) === 0

  return (
    <>
      {/* Handles redirect to questionnaire if user came from public site service link */}
      <ServiceRedirect />

      <div className="portal-header">
        <div>
          <h1>Welcome{cases && cases.length > 0 ? ' back' : ''}, {name.split(' ')[0]} 👋</h1>
          <p className="portal-role-badge" data-role={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</p>
        </div>
        <Link href="/dashboard/appointments/book" className="btn btn--gold btn--sm">Book Free Consultation</Link>
      </div>

      {/* Welcome banner for new users with no cases yet */}
      {isNewUser && (
        <div style={{
          background:'linear-gradient(150deg,#243355,#16223d)', borderRadius:'16px',
          padding:'28px 32px', marginBottom:'28px', position:'relative', overflow:'hidden',
          boxShadow:'0 16px 36px rgba(13,22,44,.25)'
        }}>
          <div style={{position:'absolute', top:'-40px', right:'-20px', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(184,149,42,.2),transparent 65%)'}} />
          <div style={{position:'relative'}}>
            <div style={{fontFamily:'Lora, serif', fontSize:'20px', color:'#fff', fontWeight:600, marginBottom:'8px'}}>
              Welcome to your Immigration Portal 🎉
            </div>
            <p style={{fontSize:'14px', color:'rgba(255,255,255,.75)', lineHeight:1.6, marginBottom:'20px', maxWidth:'560px'}}>
              You&apos;re all set! Here&apos;s how to get started — book a free consultation to speak with an attorney, or go straight to starting your visa application.
            </p>
            <div style={{display:'flex', gap:'12px', flexWrap:'wrap'}}>
              <Link href="/dashboard/appointments/book" className="btn btn--gold btn--sm" style={{textDecoration:'none'}}>
                📅 Book Free Consultation
              </Link>
              <Link href="/dashboard/apply" className="btn btn--sm" style={{background:'rgba(255,255,255,.12)', color:'#fff', border:'1px solid rgba(255,255,255,.2)', textDecoration:'none'}}>
                📋 Start an Application
              </Link>
            </div>
          </div>
        </div>
      )}

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
    </>
  )
}
