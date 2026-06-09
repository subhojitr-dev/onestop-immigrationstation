import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CaseStatusUpdater from './CaseStatusUpdater'

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  open:               { bg: '#e8effe', color: '#1d4ed8', label: 'Open' },
  in_progress:        { bg: '#fdf3e3', color: '#b45309', label: 'In Progress' },
  pending_documents:  { bg: '#fdeceb', color: '#b42318', label: 'Pending Docs' },
  submitted:          { bg: '#f1ecfe', color: '#6d28d9', label: 'Submitted' },
  approved:           { bg: '#e6f6ef', color: '#047857', label: 'Approved' },
  denied:             { bg: '#fdeceb', color: '#b42318', label: 'Denied' },
  closed:             { bg: '#eef0f4', color: '#566173', label: 'Closed' },
}

export default async function AdminCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  const { data: caseRow } = await admin
    .from('cases')
    .select('*, profiles!cases_user_id_fkey(full_name, email, phone)')
    .eq('id', id)
    .single()

  if (!caseRow) redirect('/admin/cases')

  const { data: timeline } = await admin
    .from('case_timeline')
    .select('*')
    .eq('case_id', id)
    .order('created_at', { ascending: false })

  const s = statusColors[caseRow.status] || statusColors.open
  const client = caseRow.profiles as any

  return (
    <div style={{ padding: '32px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '13px', color: '#98a0b0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Link href="/admin/cases" style={{ color: '#98a0b0', textDecoration: 'none' }}>Cases</Link>
        <span>›</span>
        <span style={{ color: '#1a2744', fontFamily: 'monospace', fontWeight: 700 }}>{caseRow.case_number}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: '26px', color: '#1a2744', margin: 0 }}>
              {caseRow.case_number}
            </h1>
            <span style={{ background: 'linear-gradient(150deg,#243355,#16223d)', color: '#cfa94a', border: '1px solid rgba(184,149,42,.3)', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>
              {caseRow.visa_type}
            </span>
            <span style={{ background: s.bg, color: s.color, borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 600 }}>
              {s.label}
            </span>
          </div>
          <p style={{ color: '#586176', fontSize: '14px', margin: 0 }}>
            Opened {new Date(caseRow.opened_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {caseRow.assigned_attorney && ` · Assigned to ${caseRow.assigned_attorney}`}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Client info */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e7e9f0', padding: '24px', boxShadow: '0 1px 2px rgba(17,27,49,.04)' }}>
            <div style={{ fontFamily: 'Lora, serif', fontSize: '16px', fontWeight: 600, color: '#1a2744', marginBottom: '16px' }}>Client</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(150deg,#243355,#16223d)', border: '1px solid rgba(184,149,42,.3)', display: 'grid', placeItems: 'center', fontFamily: 'Lora, serif', fontSize: '16px', fontWeight: 700, color: '#cfa94a', flexShrink: 0 }}>
                {client?.full_name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a2744' }}>{client?.full_name || '—'}</div>
                <div style={{ fontSize: '13px', color: '#586176' }}>{client?.email}</div>
                {client?.phone && <div style={{ fontSize: '13px', color: '#98a0b0' }}>{client.phone}</div>}
              </div>
            </div>
          </div>

          {/* Description */}
          {caseRow.description && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e7e9f0', padding: '24px', boxShadow: '0 1px 2px rgba(17,27,49,.04)' }}>
              <div style={{ fontFamily: 'Lora, serif', fontSize: '16px', fontWeight: 600, color: '#1a2744', marginBottom: '12px' }}>Description</div>
              <p style={{ color: '#586176', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{caseRow.description}</p>
            </div>
          )}

          {/* Timeline */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e7e9f0', padding: '24px', boxShadow: '0 1px 2px rgba(17,27,49,.04)' }}>
            <div style={{ fontFamily: 'Lora, serif', fontSize: '16px', fontWeight: 600, color: '#1a2744', marginBottom: '20px' }}>Timeline</div>
            {timeline && timeline.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {timeline.map((event, i) => (
                  <div key={event.id} style={{ display: 'flex', gap: '16px', paddingBottom: i < timeline.length - 1 ? '20px' : '0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a2744', marginTop: '5px', flexShrink: 0 }} />
                      {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, background: '#e7e9f0', marginTop: '6px' }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: i < timeline.length - 1 ? '4px' : '0' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a2744' }}>{event.event}</div>
                      {event.description && <div style={{ fontSize: '13px', color: '#586176', marginTop: '2px', lineHeight: 1.6 }}>{event.description}</div>}
                      <div style={{ fontSize: '12px', color: '#98a0b0', marginTop: '4px' }}>
                        {new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#98a0b0', fontSize: '14px', margin: 0 }}>No timeline events yet.</p>
            )}
          </div>
        </div>

        {/* Right column — status updater */}
        <div>
          <CaseStatusUpdater caseId={caseRow.id} currentStatus={caseRow.status} />
        </div>
      </div>
    </div>
  )
}
