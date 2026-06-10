/**
 * app/dashboard/team/page.tsx
 *
 * Team roster for Contacts and Sponsors.
 * - Contact: sees all Sponsors + Beneficiaries in their company, can invite new members.
 * - Sponsor: sees all Beneficiaries in their company (read-only).
 *
 * Company membership is determined by company_id on the profiles table.
 * A Contact's company_id is seeded to their own user_id on first invite.
 */
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  const { data: myProfile } = await admin
    .from('profiles')
    .select('role, company_id, company_name, full_name')
    .eq('id', user.id)
    .single()

  if (!myProfile || !['contact', 'sponsor', 'admin'].includes(myProfile.role)) {
    redirect('/dashboard')
  }

  // Both contact and sponsor can invite; contact sees sponsors+beneficiaries, sponsor sees beneficiaries
  const canInvite = ['contact', 'sponsor', 'admin'].includes(myProfile.role)
  const isContact = myProfile.role === 'contact' || myProfile.role === 'admin'

  // Fetch all company members (same company_id, excluding self)
  let members: any[] = []
  if (myProfile.company_id) {
    const { data } = await admin
      .from('profiles')
      .select('id, full_name, email, phone, role, created_at')
      .eq('company_id', myProfile.company_id)
      .neq('id', user.id)
      .in('role', isContact ? ['sponsor', 'beneficiary'] : ['beneficiary'])
      .order('created_at', { ascending: false })
    members = data ?? []
  }

  const sponsors = members.filter(m => m.role === 'sponsor')
  const beneficiaries = members.filter(m => m.role === 'beneficiary')

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: '26px', color: '#1a2744', margin: '0 0 4px' }}>Company Team</h1>
          <p style={{ fontSize: '14px', color: '#98a0b0', margin: 0 }}>
            {isContact
              ? 'Manage your sponsors and beneficiaries. Click any member to view their cases, appointments, and documents.'
              : 'View beneficiaries associated with your company.'}
          </p>
          {myProfile.company_name && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e8effe', color: '#1d4ed8', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', fontWeight: 600, marginTop: '10px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
              </svg>
              {myProfile.company_name}
            </div>
          )}
        </div>
        {canInvite && (
          <Link href="/dashboard/team/invite"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 22px', borderRadius: '10px', background: 'linear-gradient(135deg,#1a2744,#243355)', color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>
            </svg>
            Invite Member
          </Link>
        )}
      </div>

      {!myProfile.company_id && (
        <div style={{ background: '#fdf3e3', border: '1px solid #fde68a', borderRadius: '12px', padding: '18px 22px', marginBottom: '28px', fontSize: '14px', color: '#92400e' }}>
          <strong>No team yet.</strong>{' '}
          {isContact ? 'Invite your first sponsor or beneficiary to get started.' : 'Invite your first beneficiary to get started.'}
          {canInvite && (
            <span> <Link href="/dashboard/team/invite" style={{ color: '#b8952a', fontWeight: 700 }}>Invite now →</Link></span>
          )}
        </div>
      )}

      {/* Sponsors section */}
      {isContact && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: '18px', color: '#1a2744', margin: 0 }}>Sponsors</h2>
            <span style={{ background: '#e8effe', color: '#1d4ed8', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 700 }}>{sponsors.length}</span>
          </div>
          {sponsors.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e7e9f0', textAlign: 'center', color: '#98a0b0', fontSize: '14px' }}>
              No sponsors yet. <Link href="/dashboard/team/invite" style={{ color: '#b8952a', fontWeight: 600 }}>Invite one →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sponsors.map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          )}
        </div>
      )}

      {/* Beneficiaries section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: '18px', color: '#1a2744', margin: 0 }}>Beneficiaries</h2>
          <span style={{ background: '#e6f6ef', color: '#047857', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 700 }}>{beneficiaries.length}</span>
        </div>
        {beneficiaries.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e7e9f0', textAlign: 'center', color: '#98a0b0', fontSize: '14px' }}>
            No beneficiaries yet.{canInvite && <> <Link href="/dashboard/team/invite" style={{ color: '#b8952a', fontWeight: 600 }}>Invite one →</Link></>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {beneficiaries.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function MemberCard({ member }: { member: any }) {
  const initials = (member.full_name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const roleColors: Record<string, { bg: string; color: string }> = {
    sponsor:     { bg: '#e8effe', color: '#1d4ed8' },
    beneficiary: { bg: '#e6f6ef', color: '#047857' },
  }
  const rc = roleColors[member.role] || { bg: '#eef0f4', color: '#566173' }

  return (
    <Link href={`/dashboard/team/${member.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e7e9f0',
        display: 'flex', alignItems: 'center', gap: '14px',
        transition: 'box-shadow .15s', cursor: 'pointer',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#1a2744,#243355)',
          display: 'grid', placeItems: 'center',
          fontSize: '15px', fontWeight: 700, color: '#cfa94a',
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a2744', marginBottom: '2px' }}>{member.full_name || '—'}</div>
          <div style={{ fontSize: '13px', color: '#98a0b0' }}>{member.email}{member.phone ? ` · ${member.phone}` : ''}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{ background: rc.bg, color: rc.color, borderRadius: '20px', padding: '3px 11px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
            {member.role}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98a0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    </Link>
  )
}
