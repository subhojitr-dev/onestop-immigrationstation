'use client'
/**
 * components/NotificationBell.tsx
 *
 * In-portal notification bell — shown in the topbar of both /dashboard and /admin layouts.
 *
 * Features:
 *   - Shows unread count badge on the bell icon
 *   - Subscribes to Supabase Realtime for instant updates (no polling)
 *   - Click to open dropdown with last 10 notifications
 *   - Click a notification → marks it as read + navigates to the link
 *   - "Mark all as read" button
 *   - Click outside to close
 *
 * Reads from the `notifications` table (user_id, title, body, type, is_read, created_at)
 * Inserts are handled server-side by sendPushToUser() in lib/push/sendPush.ts
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Notification {
  id: string
  title: string
  body: string
  type: string
  is_read: boolean
  created_at: string
  data?: Record<string, string>
}

const TYPE_ICONS: Record<string, string> = {
  case_update:  '📁',
  case_opened:  '🎉',
  appointment:  '📅',
  ticket_reply: '💬',
  general:      '🔔',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

/** Derive a portal link from notification data */
function notificationLink(n: Notification): string | null {
  const d = n.data || {}
  if (n.type === 'case_update' || n.type === 'case_opened') {
    return d.caseId ? `/dashboard/cases/${d.caseId}` : '/dashboard/cases'
  }
  if (n.type === 'appointment') {
    return '/dashboard/appointments'
  }
  if (n.type === 'ticket_reply') {
    return d.ticketId ? `/dashboard/tickets/${d.ticketId}` : '/dashboard/tickets'
  }
  return null
}

export default function NotificationBell({ userId }: { userId: string }) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.is_read).length

  // Load notifications from Supabase
  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('notifications')
      .select('id, title, body, type, is_read, created_at, data')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(15)
    setNotifications(data ?? [])
  }, [userId])

  // Subscribe to real-time INSERT events
  useEffect(() => {
    load()
    const supabase = createClient()
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId, load])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  async function markRead(id: string) {
    const supabase = createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  async function markAllRead() {
    const supabase = createClient()
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
    if (unreadIds.length === 0) return
    await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  async function handleNotificationClick(n: Notification) {
    if (!n.is_read) await markRead(n.id)
    setOpen(false)
    const link = notificationLink(n)
    if (link) router.push(link)
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="portal-topbar-icon"
        title="Notifications"
        style={{ position: 'relative' }}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: unreadCount > 9 ? 18 : 16, height: unreadCount > 9 ? 18 : 16,
            background: '#b42318', borderRadius: '50%',
            fontSize: 9, fontWeight: 700, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid #fff',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 340, background: '#fff', borderRadius: '14px',
          border: '1px solid #e7e9f0', boxShadow: '0 8px 32px rgba(17,27,49,.12)',
          zIndex: 1000, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #e7e9f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Lora, serif', fontSize: '15px', fontWeight: 600, color: '#1a2744' }}>
              Notifications {unreadCount > 0 && <span style={{ background: '#fdeceb', color: '#b42318', borderRadius: '20px', padding: '1px 8px', fontSize: '11px', fontWeight: 700, marginLeft: '6px' }}>{unreadCount} new</span>}
            </span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ fontSize: '12px', color: '#b8952a', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: '#98a0b0' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔔</div>
                <div style={{ fontSize: '14px' }}>No notifications yet</div>
              </div>
            ) : notifications.map(n => (
              <button
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                style={{
                  width: '100%', textAlign: 'left', padding: '12px 16px',
                  borderBottom: '1px solid #f4f6fb', background: n.is_read ? '#fff' : '#f8f9ff',
                  cursor: 'pointer', border: 'none', display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>
                  {TYPE_ICONS[n.type] || '🔔'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: n.is_read ? 500 : 700, color: '#1a2744', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#586176', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.body}
                  </div>
                  <div style={{ fontSize: '11px', color: '#98a0b0' }}>{timeAgo(n.created_at)}</div>
                </div>
                {!n.is_read && (
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a2744', flexShrink: 0, marginTop: '6px' }} />
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid #e7e9f0', background: '#f9fafb', textAlign: 'center' }}>
            <button onClick={() => setOpen(false)} style={{ fontSize: '12px', color: '#98a0b0', background: 'none', border: 'none', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
