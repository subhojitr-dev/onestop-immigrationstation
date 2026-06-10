/**
 * app/dashboard/team/[memberId]/page.tsx
 *
 * Member detail view — accessible by Contacts and Sponsors of the same company.
 * Shows the member's profile + their cases, appointments, documents, and tickets
 * as tab sections (read-only).
 */
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  open:              { bg: '#e8effe', color: '#1d4ed8' },
  in_progress:       { bg: '#fdf3e3', color: '#b45309' },
  pending_documents: { bg: '#fef3c7', color: '#92400e' },
  submitted:         { bg: '#e0f2fe', color: '#0369a1' },
  approved:          { bg: '#e6f6ef', color: '#047857' },
  denied:            { bg: '#fdeceb', color: '#b42318' },
  closed:            { bg: '#eef0f4', color: '#566173' },
  confirmed:         { bg: '#e6f6ef', color: '#047857' },
  cancelled:         { bg: '#fdeceb', color: '#b42318' },
  pending:           { bg: '#fdf3e3', color: '#b45309' },
  resolved:          { bg: '#e6f6ef', color: '#047857' },
}

export default async function MemberDetailPage({ params }: { params: Promise<{ memberId: string }> }) {
  const { memberId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  // Verify viewer is allowed to see this member
  const { data: viewerProfile } = await admin
    .from('profiles')
    .select('role, company_id')
    .eq('id', user.id)
    .single()

  if (!viewerProfile || !['contact', 'sponsor', 'admin'].includes(viewerProfile.role)) {
    redirect('/dashboard')
  }

  // Load the member's profile
  const { data: member } = await admin
    .from('profiles')
    .select('id, full_name, email, phone, address, role, company_id, created_at')
    .eq('id', memberId)
    .single()

  if (!member) notFound()

  // Access control: must be same company (or admin)
  if (viewerProfile.role !== 'admin') {
    const sameCompany = viewerProfile.company_id && member.company_id &&
      viewerProfile.company_id === member.company_id
    if (!sameCompany) notFound()
  }

  // Load member's data in parallel
  const [casesRes, appointmentsRes, docsRes, ticketsRes] = await Promise.all([
    admin.from('cases').select('id, case_number, visa_type, status, opened_date').eq('user_id', memberId).order('opened_date', { ascending: false }),
    admin.from('appointments').select('id, date, time_slot, status, location, meeting_link, lawyer_name').eq('user_id', memberId).order('date', { ascending: false }),
    // Documents live in Storage bucket 'documents', folder = memberId
    admin.storage.from('documents').list(memberId, { sortBy: { column: 'updated_at', order: 'desc' } }),
    admin.from('tickets').select('id, subject, status, priority, created_at').eq('user_id', memberId).order('created_at', { ascending: false }),
  ])

  const cases = casesRes.data ?? []
  const appointments = appointmentsRes.data ?? []
  const docs = (docsRes.data ?? []).filter((f: any) => f.name !== '.emptyFolderPlaceholder')
  const tickets = ticketsRes.data ?? []

  const initials = (member.full_name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  const sectionHead = (title: string, count: number, color: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', paddingTop: '8px' }}>
      <h2 style={{ fontFamily: 'Lora, serif', fontSize: '18px', color: '#1a2744', margin: 0 }}>{title}</h2>
      <span style={{ background: color, color: '#1a2744', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 700 }}>{count}</span>
    </div>
  )

  const emptyState = (msg: string) => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e7e9f0', color: '#98a0b0', fontSize: '14px', textAlign: 'center' }}>{msg}</div>
  )

  return (
    <div style={{ padding: '32px', maxWidth: '860px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#98a0b0', marginBottom: '24px' }}>
        <Link href="/dashboard/team" style={{ color: '#586176', textDecoration: 'none', fontWeight: 500 }}>Team</Link>
        <span>›</span>
        <span style={{ color: '#1a2744', fontWeight: 600 }}>{member.full_name}</span>
      </div>

      {/* Profile card */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e7e9f0', marginBottom: '28px', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#1a2744,#243355)',
          display: 'grid', placeItems: 'center',
          fontSize: '20px', fontWeight: 700, color: '#cfa94a',
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: '22px', color: '#1a2744', margin: 0 }}>{member.full_name}</h1>
            <span style={{
              background: member.role === 'sponsor' ? '#e8effe' : '#e6f6ef',
              color: member.role === 'sponsor' ? '#1d4ed8' : '#047857',
              borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize',
            }}>
              {member.role}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#98a0b0', lineHeight: 1.8 }}>
            {member.email && <div>{member.email}</div>}
            {member.phone && <div>{member.phone}</div>}
            {member.address && <div>{member.address}</div>}
          </div>
        </div>
      </div>

      {/* Cases */}
      <div style={{ marginBottom: '28px' }}>
        {sectionHead('Cases', cases.length, '#dbeafe')}
        {cases.length === 0 ? emptyState('No cases yet.') : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cases.map(c => {
              const sc = STATUS_COLORS[c.status] || STATUS_COLORS.open
              return (
                <div key={c.id} style={{ background: '#fff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #e7e9f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a2744' }}>{c.case_number}</div>
                    <div style={{ fontSize: '12px', color: '#98a0b0', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '.04em' }}>{c.visa_type?.replace('_', ' ')}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                      {c.status?.replace(/_/g, ' ')}
                    </span>
                    {c.opened_date && <span style={{ fontSize: '12px', color: '#98a0b0' }}>{new Date(c.opened_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Appointments */}
      <div style={{ marginBottom: '28px' }}>
        {sectionHead('Appointments', appointments.length, '#dbeafe')}
        {appointments.length === 0 ? emptyState('No appointments yet.') : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {appointments.map(a => {
              const sc = STATUS_COLORS[a.status] || STATUS_COLORS.pending
              return (
                <div key={a.id} style={{ background: '#fff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #e7e9f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a2744' }}>{a.date} at {a.time_slot}</div>
                    {a.lawyer_name && <div style={{ fontSize: '12px', color: '#98a0b0', marginTop: '2px' }}>with {a.lawyer_name}</div>}
                    {a.location && <div style={{ fontSize: '12px', color: '#98a0b0' }}>{a.location}</div>}
                  </div>
                  <span style={{ background: sc.bg, color: sc.color, borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                    {a.status}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Documents */}
      <div style={{ marginBottom: '28px' }}>
        {sectionHead('Documents', docs.length, '#dbeafe')}
        {docs.length === 0 ? emptyState('No documents uploaded yet.') : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {docs.map((d: any) => (
              <div key={d.id || d.name} style={{ background: '#fff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #e7e9f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8952a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span style={{ fontSize: '14px', color: '#1a2744', fontWeight: 500 }}>{d.name}</span>
                </div>
                {d.updated_at && (
                  <span style={{ fontSize: '12px', color: '#98a0b0' }}>
                    {new Date(d.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tickets */}
      <div>
        {sectionHead('Support Tickets', tickets.length, '#dbeafe')}
        {tickets.length === 0 ? emptyState('No support tickets yet.') : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tickets.map(t => {
              const sc = STATUS_COLORS[t.status] || STATUS_COLORS.open
              const pColors: Record<string, { bg: string; color: string }> = {
                low:    { bg: '#eef0f4', color: '#566173' },
                medium: { bg: '#fdf3e3', color: '#b45309' },
                high:   { bg: '#fdeceb', color: '#b42318' },
                urgent: { bg: '#fee2e2', color: '#7f1d1d' },
              }
              const pc = pColors[t.priority] || pColors.medium
              return (
                <div key={t.id} style={{ background: '#fff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #e7e9f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a2744' }}>{t.subject}</div>
                    <div style={{ fontSize: '12px', color: '#98a0b0', marginTop: '2px' }}>
                      {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ background: pc.bg, color: pc.color, borderRadius: '20px', padding: '3px 11px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>{t.priority}</span>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: '20px', padding: '3px 11px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>{t.status?.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
