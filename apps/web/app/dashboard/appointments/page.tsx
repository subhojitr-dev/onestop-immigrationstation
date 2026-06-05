import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, cases(case_number, visa_type)')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  const freeUsed = appointments?.filter(a => a.is_free).length ?? 0
  const upcoming = appointments?.filter(a => new Date(a.date) >= new Date()) ?? []
  const past = appointments?.filter(a => new Date(a.date) < new Date()) ?? []

  const statusColors: Record<string, { bg: string; color: string }> = {
    pending:   { bg: '#fef3c7', color: '#92400e' },
    confirmed: { bg: '#d1fae5', color: '#065f46' },
    cancelled: { bg: '#fee2e2', color: '#991b1b' },
    completed: { bg: '#f3f4f6', color: '#4b5563' },
    no_show:   { bg: '#fee2e2', color: '#991b1b' },
  }

  return (
    <>
      <div className="portal-header">
          <div>
            <h1>Appointments</h1>
            <p style={{color:'#6b7280', fontSize:'15px', margin:'4px 0 0'}}>
              Manage your consultations and meetings
            </p>
          </div>
          <Link href="/dashboard/appointments/book" className="btn btn--gold btn--sm">+ Book Appointment</Link>
        </div>

        {/* Free consultations counter */}
        <div className="appt-free-banner">
          <div className="afb-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            <div>
              <div className="afb-title">Free Consultations</div>
              <div className="afb-sub">Every account includes 2 free consultations with our team</div>
            </div>
          </div>
          <div className="afb-counter">
            <span className="afb-num">{freeUsed}</span>
            <span className="afb-den">/ 2 used</span>
          </div>
          {freeUsed < 2 && (
            <Link href="/dashboard/appointments/book" className="btn btn--gold btn--sm">
              Book Free Consultation
            </Link>
          )}
        </div>

        {/* Upcoming */}
        <section className="portal-section">
          <div className="portal-section-head">
            <h2>Upcoming ({upcoming.length})</h2>
          </div>
          {upcoming.length > 0 ? (
            <div className="appt-list">
              {upcoming.map(a => {
                const s = statusColors[a.status] || statusColors.pending
                const d = new Date(a.date)
                return (
                  <div key={a.id} className="appt-row">
                    <div className="appt-date-box">
                      <span className="appt-day">{d.getDate()}</span>
                      <span className="appt-mon">{d.toLocaleDateString('en-US', {month:'short'})}</span>
                      <span className="appt-yr">{d.getFullYear()}</span>
                    </div>
                    <div className="appt-info">
                      <div className="appt-time">{a.time_slot}</div>
                      {a.is_free && <span className="pa-free">Free Consultation</span>}
                      {a.notes && <div className="appt-notes">{a.notes}</div>}
                    </div>
                    <div className="appt-right">
                      <span className="pt-status" style={{background: s.bg, color: s.color}}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="portal-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <p>No upcoming appointments. <Link href="/contact">Book a free consultation →</Link></p>
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section className="portal-section">
            <div className="portal-section-head">
              <h2>Past Appointments ({past.length})</h2>
            </div>
            <div className="appt-list">
              {past.map(a => {
                const s = statusColors[a.status] || statusColors.completed
                const d = new Date(a.date)
                return (
                  <div key={a.id} className="appt-row" style={{opacity:.7}}>
                    <div className="appt-date-box" style={{background:'#f3f4f6'}}>
                      <span className="appt-day" style={{color:'#6b7280'}}>{d.getDate()}</span>
                      <span className="appt-mon">{d.toLocaleDateString('en-US', {month:'short'})}</span>
                      <span className="appt-yr">{d.getFullYear()}</span>
                    </div>
                    <div className="appt-info">
                      <div className="appt-time">{a.time_slot}</div>
                      {a.is_free && <span className="pa-free">Free Consultation</span>}
                    </div>
                    <div className="appt-right">
                      <span className="pt-status" style={{background: s.bg, color: s.color}}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
    </>
  )
}
