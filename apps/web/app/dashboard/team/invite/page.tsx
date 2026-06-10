/**
 * app/dashboard/team/invite/page.tsx
 *
 * Server wrapper reads the caller's role + company info, then passes them
 * to the client form so role options and company label are accurate.
 * - Contact: can invite Sponsor or Beneficiary
 * - Sponsor: can invite Beneficiary only
 */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InviteMemberForm from './InviteMemberForm'

export default async function InviteMemberPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, company_name')
    .eq('id', user.id)
    .single()

  if (!profile || !['contact', 'sponsor', 'admin'].includes(profile.role)) {
    redirect('/dashboard')
  }

  const allowedRoles: ('sponsor' | 'beneficiary')[] =
    profile.role === 'sponsor' ? ['beneficiary'] : ['sponsor', 'beneficiary']

  return (
    <InviteMemberForm
      callerRole={profile.role}
      companyName={profile.company_name || ''}
      allowedRoles={allowedRoles}
    />
  )
}
