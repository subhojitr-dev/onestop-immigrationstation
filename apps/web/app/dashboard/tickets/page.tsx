import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  open:        { bg: '#dbeafe', color: '#1d4ed8', label: 'Open' },
  in_progress: { bg: '#fef3c7', color: '#92400e', label: 'In Progress' },
  resolved:    { bg: '#d1fae5', color: '#065f46', label: 'Resolved' },
  closed:      { bg: '#f3f4f6', color: '#4b5563', label: 'Closed' },
}

const priorityColors: Record<string, { bg: string; color: string; label: string }> = {
  low:    { bg: '#f3f4f6', color: '#4b5563', label: 'Low' },
  medium: { bg: '#fef3c7', color: '#92400e', label: 'Medium' },
  high:   { bg: '#fee2e2', color: '#991b1b', label: 'High' },
  urgent: { bg: '#7f1d1d', color: '#fff',    label: '🚨 Urgent' },
}

export default async function TicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  const role = profile?.role || 'beneficiary'

  // Lawyers/admins see all tickets; others see their own
  let query = supabase
    .from('tickets')
    .select('*, cases(case_number, visa_type)')
    .order('created_at', { ascending: false })

  if (role !== 'lawyer' && role !== 'admin') {
    query = query.eq('user_id', user.id)
  }

  const { data: tickets } = await query

  const openCount     = tickets?.filter(t => t.status === 'open').length ?? 0
  const progressCount = tickets?.filter(t => t.status === 'in_progress').length ?? 0

  return (
    <>
      <div className="portal-header">
          <div>
            <h1>Support Tickets</h1>
            <p style={{color:'#6b7280', fontSize:'15px', margin:'4px 0 0'}}>
              Get help from our team on any question or issue
            </p>
          </div>
          <Link href="/dashboard/tickets/new" className="btn btn--gold btn--sm">
            + New Ticket
          </Link>
        </div>

        {/* Summary chips */}
        <div style={{display:'flex', gap:'10px', marginBottom:'24px', flexWrap:'wrap'}}>
          {Object.entries(statusColors).map(([key, val]) => (
            <span key={key} style={{
              background: val.bg, color: val.color,
              padding:'5px 14px', borderRadius:'20px',
              fontSize:'13px', fontWeight:500
            }}>
              {val.label}
              <span style={{
                background:'rgba(0,0,0,.12)', borderRadius:'10px',
                padding:'1px 7px', fontSize:'11px', fontWeight:700, marginLeft:'6px'
              }}>
                {tickets?.filter(t => t.status === key).length ?? 0}
              </span>
            </span>
          ))}
        </div>

        {/* Alert if open/in-progress tickets */}
        {(openCount + progressCount) > 0 && (
          <div style={{
            background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'10px',
            padding:'12px 16px', marginBottom:'20px', display:'flex', alignItems:'center',
            gap:'10px', fontSize:'14px', color:'#1d4ed8'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            You have {openCount + progressCount} active ticket{openCount + progressCount > 1 ? 's' : ''} awaiting response
          </div>
        )}

        {/* Ticket list */}
        {tickets && tickets.length > 0 ? (
          <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            {tickets.map(ticket => {
              const s = statusColors[ticket.status] || statusColors.open
              const p = priorityColors[ticket.priority] || priorityColors.medium
              const date = new Date(ticket.created_at)
              return (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  style={{textDecoration:'none'}}
                >
                  <div style={{
                    background:'#fff', border:'1px solid #e5e7eb', borderRadius:'12px',
                    padding:'18px 22px', display:'flex', gap:'16px', alignItems:'flex-start',
                    transition:'border-color .15s', cursor:'pointer'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#1a2744')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  >
                    {/* Icon */}
                    <div style={{
                      width:40, height:40, borderRadius:'8px', background:'#f3f4f6',
                      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1a2744" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>

                    {/* Body */}
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:'15px', fontWeight:600, color:'#1a2744', marginBottom:'4px',
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                        {ticket.subject}
                      </div>
                      <div style={{fontSize:'13px', color:'#6b7280', overflow:'hidden',
                        textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:'8px'}}>
                        {ticket.description}
                      </div>
                      <div style={{display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center'}}>
                        {ticket.cases && (
                          <span style={{
                            background:'#1a2744', color:'#fff', borderRadius:'5px',
                            padding:'2px 8px', fontSize:'11px', fontWeight:700, fontFamily:'monospace'
                          }}>
                            {ticket.cases.visa_type}
                          </span>
                        )}
                        <span style={{fontSize:'12px', color:'#9ca3af'}}>
                          #{ticket.id.slice(0,8)} · {date.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}
                        </span>
                      </div>
                    </div>

                    {/* Right */}
                    <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px', flexShrink:0}}>
                      <span style={{background:s.bg, color:s.color, padding:'3px 10px',
                        borderRadius:'20px', fontSize:'12px', fontWeight:600}}>
                        {s.label}
                      </span>
                      <span style={{background:p.bg, color:p.color, padding:'3px 10px',
                        borderRadius:'20px', fontSize:'12px', fontWeight:600}}>
                        {p.label}
                      </span>
                      <span style={{fontSize:'12px', color:'#9ca3af'}}>View →</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="portal-empty" style={{marginTop:'60px'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <h3 style={{color:'#1a2744', fontFamily:'Lora, serif', margin:'12px 0 6px'}}>No support tickets yet</h3>
            <p>Have a question or issue? Open a ticket and our team will respond within one business day.</p>
            <Link href="/dashboard/tickets/new" className="btn btn--navy"
              style={{marginTop:'16px', display:'inline-block', textDecoration:'none'}}>
              Open Your First Ticket
            </Link>
          </div>
        )}
    </>
  )
}
