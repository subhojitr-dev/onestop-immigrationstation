/**
 * app/admin/tickets/[id]/page.tsx
 *
 * Admin ticket detail page — lawyers can read the full ticket thread
 * and post replies directly from the admin panel.
 * Uses admin client to read all replies regardless of who posted them.
 */
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import AdminTicketReply from './AdminTicketReply'

const priorityColors: Record<string, { bg: string; color: string }> = {
  low:    { bg: '#eef0f4', color: '#566173' },
  medium: { bg: '#fdf3e3', color: '#b45309' },
  high:   { bg: '#fdeceb', color: '#b42318' },
  urgent: { bg: '#fee2e2', color: '#7f1d1d' },
}
const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  open:        { bg: '#e8effe', color: '#1d4ed8', label: 'Open' },
  in_progress: { bg: '#fdf3e3', color: '#b45309', label: 'In Progress' },
  resolved:    { bg: '#e6f6ef', color: '#047857', label: 'Resolved' },
  closed:      { bg: '#eef0f4', color: '#566173', label: 'Closed' },
}

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  // Fetch ticket
  const { data: ticket } = await admin
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single()

  if (!ticket) notFound()

  // Fetch client profile
  const { data: clientProfile } = await admin
    .from('profiles')
    .select('full_name, email')
    .eq('id', ticket.user_id)
    .single()

  // Fetch lawyer profile (current user)
  const { data: lawyerProfile } = await admin
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  // Fetch all replies with author profiles
  const { data: replies } = await admin
    .from('ticket_replies')
    .select('*')
    .eq('ticket_id', id)
    .order('created_at', { ascending: true })

  // Get all reply author profiles
  const authorIds = [...new Set((replies ?? []).map(r => r.user_id))]
  const { data: authorProfiles } = await admin.from('profiles').select('id, full_name, role').in('id', authorIds)
  const authorMap = Object.fromEntries((authorProfiles ?? []).map(p => [p.id, p]))

  const s = statusColors[ticket.status] || statusColors.open
  const p = priorityColors[ticket.priority] || priorityColors.medium

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#98a0b0', marginBottom: '20px' }}>
        <Link href="/admin/tickets" style={{ color: '#586176', textDecoration: 'none', fontWeight: 500 }}>Support Tickets</Link>
        <span>›</span>
        <span style={{ color: '#1a2744', fontWeight: 600 }}>{ticket.subject}</span>
      </div>

      {/* Header */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e7e9f0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: '22px', color: '#1a2744', margin: 0 }}>{ticket.subject}</h1>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <span style={{ background: p.bg, color: p.color, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
              {ticket.priority}
            </span>
            <span style={{ background: s.bg, color: s.color, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>
              {s.label}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '13px', color: '#98a0b0' }}>
          From: <strong style={{ color: '#586176' }}>{clientProfile?.full_name || clientProfile?.email || 'Unknown'}</strong>
          {' · '}{clientProfile?.email}
          {' · '}Opened {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        {ticket.description && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eef1f7', fontSize: '14px', color: '#586176', lineHeight: 1.7 }}>
            {ticket.description}
          </div>
        )}
      </div>

      {/* Replies thread */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {(replies ?? []).map(reply => {
          const author = authorMap[reply.user_id]
          const isStaff = author?.role === 'lawyer' || author?.role === 'admin'
          return (
            <div key={reply.id} style={{
              background: isStaff ? 'linear-gradient(135deg,#f0f4ff,#e8effe)' : '#fff',
              borderRadius: '12px', padding: '16px 20px',
              border: `1px solid ${isStaff ? '#bfdbfe' : '#e7e9f0'}`,
              marginLeft: isStaff ? '40px' : '0',
              marginRight: isStaff ? '0' : '40px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: isStaff ? 'linear-gradient(135deg,#1a2744,#243355)' : '#eef0f4',
                  display: 'grid', placeItems: 'center',
                  fontSize: '13px', fontWeight: 700,
                  color: isStaff ? '#cfa94a' : '#566173',
                }}>
                  {(author?.full_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a2744' }}>
                    {author?.full_name || 'Unknown'}
                    {isStaff && <span style={{ marginLeft: '6px', fontSize: '11px', background: '#1a2744', color: '#cfa94a', borderRadius: '4px', padding: '1px 6px' }}>Staff</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#98a0b0' }}>
                    {new Date(reply.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#2d3748', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {reply.message}
              </div>
            </div>
          )
        })}

        {(!replies || replies.length === 0) && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#98a0b0', background: '#fff', borderRadius: '12px', border: '1px solid #e7e9f0' }}>
            No replies yet — be the first to respond below
          </div>
        )}
      </div>

      {/* Reply form */}
      <AdminTicketReply
        ticketId={id}
        lawyerId={user.id}
        lawyerName={lawyerProfile?.full_name || 'Attorney'}
        clientEmail={clientProfile?.email || ''}
        clientUserId={ticket.user_id}
        ticketSubject={ticket.subject}
      />
    </div>
  )
}
