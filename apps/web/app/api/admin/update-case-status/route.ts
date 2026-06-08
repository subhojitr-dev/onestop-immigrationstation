/**
 * POST /api/admin/update-case-status
 *
 * Updates a case's status and sends an email notification to the client.
 * Only callable by authenticated lawyers/admins.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendCaseStatusEmail } from '@/lib/email/resend'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: callerProfile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (callerProfile?.role !== 'lawyer' && callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { caseId, status, note } = await req.json()
  if (!caseId || !status) return NextResponse.json({ error: 'caseId and status required' }, { status: 400 })

  const admin = createAdminClient()

  // Fetch case + client info for the email
  const { data: caseRow, error: fetchErr } = await admin
    .from('cases')
    .select('*, profiles!cases_user_id_fkey(full_name, email)')
    .eq('id', caseId)
    .single()

  if (fetchErr || !caseRow) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

  // Update status
  const { error } = await admin.from('cases').update({ status }).eq('id', caseId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Add timeline event
  const statusLabels: Record<string, string> = {
    open: 'Open', in_progress: 'In Progress', pending_documents: 'Pending Documents',
    submitted: 'Submitted to USCIS', approved: 'Approved', denied: 'Denied', closed: 'Closed',
  }
  await admin.from('case_timeline').insert({
    case_id: caseId,
    event: `Status Updated: ${statusLabels[status] || status}`,
    description: note
      ? `Status changed to "${statusLabels[status] || status}" by ${callerProfile.full_name}. Note: ${note}`
      : `Status changed to "${statusLabels[status] || status}" by ${callerProfile.full_name}.`,
  })

  // Email the client
  const clientProfile = caseRow.profiles as any
  if (clientProfile?.email) {
    sendCaseStatusEmail({
      clientName: clientProfile.full_name || clientProfile.email.split('@')[0],
      clientEmail: clientProfile.email,
      caseNumber: caseRow.case_number,
      visaType: caseRow.visa_type,
      newStatus: statusLabels[status] || status,
      lawyerNote: note || undefined,
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
