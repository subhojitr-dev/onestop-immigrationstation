'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ticketId = params.id as string

  const [user, setUser] = useState<any>(null)
  const [ticket, setTicket] = useState<any>(null)
  const [replies, setReplies] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: t } = await supabase
        .from('tickets')
        .select('*, cases(case_number, visa_type)')
        .eq('id', ticketId)
        .single()

      if (!t) { router.push('/dashboard/tickets'); return }
      setTicket(t)

      const { data: r } = await supabase
        .from('ticket_replies')
        .select('*, profiles(full_name, role)')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })
      setReplies(r ?? [])
    }
    load()
  }, [router, ticketId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [replies])

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.from('ticket_replies').insert({
      ticket_id:     ticketId,
      user_id:       user.id,
      message:       message.trim(),
      is_staff_reply: false,
    })

    if (err) {
      setError('Failed to send reply: ' + err.message)
    } else {
      setMessage('')
      // Reload replies
      const { data: r } = await supabase
        .from('ticket_replies')
        .select('*, profiles(full_name, role)')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })
      setReplies(r ?? [])

      // Email the ticket owner that they got a reply (non-blocking)
      const { data: ticketOwner } = await supabase
        .from('profiles').select('full_name, email:id').eq('id', ticket.user_id).single() as any
      const { data: senderProfile } = await supabase
        .from('profiles').select('full_name, role').eq('id', user.id).single() as any
      if (ticketOwner && ticket.user_id !== user.id) {
        fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'ticket_reply',
            recipientName: ticketOwner.full_name || 'Client',
            recipientEmail: user.email, // use authenticated user's email as fallback
            ticketSubject: ticket.subject,
            ticketId,
            replyBody: message.trim(),
            replierName: senderProfile?.full_name || 'Team',
            isStaffReply: false,
          }),
        }).catch(() => {})
      }
    }
    setSending(false)
  }

  if (!ticket) return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
      <p style={{color:'#6b7280'}}>Loading…</p>
    </div>
  )

  const s = statusColors[ticket.status] || statusColors.open
  const p = priorityColors[ticket.priority] || priorityColors.medium
  const isClosed = ticket.status === 'resolved' || ticket.status === 'closed'

  return (
    <>
      {/* Breadcrumb */}
        <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px', fontSize:'14px', color:'#6b7280'}}>
          <Link href="/dashboard/tickets" style={{color:'#6b7280', textDecoration:'none'}}>Support Tickets</Link>
          <span>→</span>
          <span style={{color:'#1a2744', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'300px'}}>
            {ticket.subject}
          </span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 260px', gap:'24px', alignItems:'start'}}>
          {/* Main thread */}
          <div>
            {/* Ticket header */}
            <div className="portal-section" style={{marginBottom:'16px'}}>
              <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px', marginBottom:'12px'}}>
                <h1 style={{fontFamily:'Lora, serif', fontSize:'22px', color:'#1a2744', lineHeight:1.3}}>
                  {ticket.subject}
                </h1>
                <div style={{display:'flex', gap:'8px', flexShrink:0}}>
                  <span style={{background:s.bg, color:s.color, padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:600}}>
                    {s.label}
                  </span>
                  <span style={{background:p.bg, color:p.color, padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:600}}>
                    {p.label}
                  </span>
                </div>
              </div>
              <div style={{fontSize:'13px', color:'#9ca3af', marginBottom:'16px'}}>
                Ticket #{ticketId.slice(0,8)} · Opened {new Date(ticket.created_at).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'})}
                {ticket.cases && (
                  <span style={{marginLeft:'12px', background:'#1a2744', color:'#fff', borderRadius:'4px', padding:'2px 8px', fontSize:'11px', fontWeight:700, fontFamily:'monospace'}}>
                    {ticket.cases.visa_type} · {ticket.cases.case_number}
                  </span>
                )}
              </div>
              {/* Original message */}
              <div style={{background:'#f9fafb', borderRadius:'8px', padding:'16px', fontSize:'15px', color:'#374151', lineHeight:1.6, whiteSpace:'pre-wrap'}}>
                {ticket.description}
              </div>
            </div>

            {/* Replies */}
            {replies.length > 0 && (
              <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'16px'}}>
                {replies.map(reply => {
                  const isStaff = reply.is_staff_reply
                  const isMe = reply.user_id === user?.id
                  return (
                    <div key={reply.id} style={{
                      display:'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap:'12px', alignItems:'flex-start'
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width:36, height:36, borderRadius:'50%', flexShrink:0,
                        background: isStaff ? '#1a2744' : '#e5e7eb',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'14px', fontWeight:700,
                        color: isStaff ? '#b8952a' : '#4b5563'
                      }}>
                        {isStaff ? '⚖️' : (reply.profiles?.full_name?.[0] || 'U')}
                      </div>
                      <div style={{maxWidth:'75%'}}>
                        <div style={{
                          display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px',
                          flexDirection: isMe ? 'row-reverse' : 'row'
                        }}>
                          <span style={{fontSize:'13px', fontWeight:600, color:'#1a2744'}}>
                            {isStaff ? 'OSIS Team' : (reply.profiles?.full_name || 'You')}
                          </span>
                          <span style={{fontSize:'12px', color:'#9ca3af'}}>
                            {new Date(reply.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'})}
                          </span>
                        </div>
                        <div style={{
                          background: isStaff ? '#1a2744' : isMe ? '#eff6ff' : '#f9fafb',
                          color: isStaff ? '#fff' : '#374151',
                          borderRadius:'10px', padding:'12px 16px',
                          fontSize:'14px', lineHeight:1.6, whiteSpace:'pre-wrap'
                        }}>
                          {reply.message}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>
            )}

            {/* Reply form */}
            {!isClosed ? (
              <div className="portal-section">
                <h3 style={{fontSize:'15px', fontWeight:600, color:'#1a2744', marginBottom:'12px'}}>Add a Reply</h3>
                {error && <div className="auth-error" style={{marginBottom:'12px'}}>{error}</div>}
                <form onSubmit={handleReply}>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type your reply here…"
                    rows={4}
                    style={{
                      width:'100%', padding:'10px 14px',
                      border:'1.5px solid #e5e7eb', borderRadius:'8px',
                      fontSize:'15px', boxSizing:'border-box',
                      fontFamily:'inherit', resize:'vertical', marginBottom:'12px'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn--navy"
                    disabled={sending || !message.trim()}
                    style={{padding:'11px 28px'}}
                  >
                    {sending ? 'Sending…' : 'Send Reply'}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{
                background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'10px',
                padding:'16px', textAlign:'center', color:'#6b7280', fontSize:'14px'
              }}>
                This ticket is {ticket.status}. <Link href="/dashboard/tickets/new" style={{color:'#1a2744', fontWeight:600}}>Open a new ticket →</Link>
              </div>
            )}
          </div>

          {/* Sidebar details */}
          <div>
            <div className="portal-section" style={{marginBottom:'16px'}}>
              <h3 style={{fontSize:'14px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'16px'}}>
                Ticket Details
              </h3>
              <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
                <div>
                  <div style={{fontSize:'11px', color:'#9ca3af', textTransform:'uppercase', fontWeight:600, letterSpacing:'.05em', marginBottom:'4px'}}>Status</div>
                  <span style={{background:s.bg, color:s.color, padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:600}}>
                    {s.label}
                  </span>
                </div>
                <div>
                  <div style={{fontSize:'11px', color:'#9ca3af', textTransform:'uppercase', fontWeight:600, letterSpacing:'.05em', marginBottom:'4px'}}>Priority</div>
                  <span style={{background:p.bg, color:p.color, padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:600}}>
                    {p.label}
                  </span>
                </div>
                {ticket.cases && (
                  <div>
                    <div style={{fontSize:'11px', color:'#9ca3af', textTransform:'uppercase', fontWeight:600, letterSpacing:'.05em', marginBottom:'4px'}}>Related Case</div>
                    <Link href={`/dashboard/cases/${ticket.case_id}`} style={{fontSize:'14px', color:'#1a2744', fontWeight:500, textDecoration:'none'}}>
                      {ticket.cases.case_number} ({ticket.cases.visa_type}) →
                    </Link>
                  </div>
                )}
                <div>
                  <div style={{fontSize:'11px', color:'#9ca3af', textTransform:'uppercase', fontWeight:600, letterSpacing:'.05em', marginBottom:'4px'}}>Opened</div>
                  <div style={{fontSize:'14px', color:'#374151'}}>
                    {new Date(ticket.created_at).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'})}
                  </div>
                </div>
                <div>
                  <div style={{fontSize:'11px', color:'#9ca3af', textTransform:'uppercase', fontWeight:600, letterSpacing:'.05em', marginBottom:'4px'}}>Replies</div>
                  <div style={{fontSize:'14px', color:'#374151'}}>{replies.length}</div>
                </div>
              </div>
            </div>

            <div style={{background:'#1a2744', borderRadius:'10px', padding:'20px'}}>
              <h3 style={{fontFamily:'Lora, serif', fontSize:'15px', color:'#fff', marginBottom:'8px'}}>Need urgent help?</h3>
              <p style={{fontSize:'13px', color:'rgba(255,255,255,.65)', marginBottom:'14px'}}>
                For time-sensitive matters, call us directly.
              </p>
              <a href="tel:18007824769" style={{display:'block', textAlign:'center', padding:'10px', background:'#b8952a', color:'#fff', borderRadius:'7px', textDecoration:'none', fontSize:'14px', fontWeight:600}}>
                📞 Call (800) SUB-HROY
              </a>
            </div>
          </div>
        </div>
    </>
  )
}
