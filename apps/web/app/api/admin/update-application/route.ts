/**
 * app/api/admin/update-application/route.ts
 *
 * Updates application status + lawyer notes using service role (bypasses RLS).
 * Also emails the client when status changes.
 * Only callable by authenticated lawyers/admins.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendApplicationStatusEmail } from '@/lib/email/resend'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'lawyer' && profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { appId, status, notes, visaType, clientUserId, clientName } = await req.json()
  const admin = createAdminClient()

  // Get current application to check if status changed
  const { data: current } = await admin.from('applications').select('status').eq('id', appId).single()

  await admin.from('applications').update({
    status,
    lawyer_notes: notes,
    reviewed_at: new Date().toISOString(),
  }).eq('id', appId)

  // Email client if status changed
  if (current && status !== current.status && status !== 'submitted') {
    const { data: clientProfile } = await admin.from('profiles').select('email').eq('id', clientUserId).single()
    if (clientProfile?.email) {
      await sendApplicationStatusEmail({
        clientName: clientName || 'Client',
        clientEmail: clientProfile.email,
        visaType,
        newStatus: status,
        lawyerNote: notes || undefined,
      }).catch(() => {})
    }
  }

  return NextResponse.json({ ok: true })
}
