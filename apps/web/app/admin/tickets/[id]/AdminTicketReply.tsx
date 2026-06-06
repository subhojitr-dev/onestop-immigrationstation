/**
 * app/admin/tickets/[id]/AdminTicketReply.tsx
 *
 * Client component — reply form for lawyers in the admin ticket detail page.
 * Posts a reply marked as is_staff_reply = true and sends email to client.
 */
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  ticketId: string
  lawyerId: string
  lawyerName: string
  clientEmail: string
  ticketSubject: string
}

export default function AdminTicketReply({ ticketId, lawyerId, lawyerName, clientEmail, ticketSubject }: Props) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.from('ticket_replies').insert({
      ticket_id: ticketId,
      user_id: lawyerId,
      message: message.trim(),
      is_staff_reply: true,
    })

    if (err) { setError(err.message); setSending(false); return }

    // Email the client
    fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'ticket_reply',
        recipientName: 'Client',
        recipientEmail: clientEmail,
        ticketSubject,
        ticketId,
        replyBody: message.trim(),
        replierName: lawyerName,
        isStaffReply: true,
      }),
    }).catch(() => {})

    setMessage('')
    setDone(true)
    setTimeout(() => setDone(false), 2000)
    setSending(false)
    router.refresh()
  }

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', border: '1px solid #e7e9f0' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a2744', marginBottom: '12px' }}>
        Reply as Staff — client will receive an email notification
      </div>
      {error && <div style={{ background: '#fdeceb', color: '#b42318', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px' }}>{error}</div>}
      <form onSubmit={handleReply}>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Write your reply to the client..."
          rows={5}
          style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e7e9f0', borderRadius: '10px', fontFamily: 'inherit', fontSize: '14px', color: '#16203a', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: '12px' }}
        />
        <button type="submit" disabled={sending || !message.trim()}
          style={{ padding: '11px 28px', borderRadius: '10px', border: 'none', background: done ? '#e6f6ef' : 'linear-gradient(135deg,#1a2744,#243355)', color: done ? '#047857' : '#fff', fontSize: '14px', fontWeight: 700, cursor: (sending || !message.trim()) ? 'not-allowed' : 'pointer' }}>
          {sending ? 'Sending…' : done ? '✓ Sent!' : 'Send Reply'}
        </button>
      </form>
    </div>
  )
}
