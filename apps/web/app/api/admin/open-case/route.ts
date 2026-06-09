/**
 * app/api/admin/open-case/route.ts
 *
 * Creates a new case record from a submitted application.
 * This is the step that converts an intake questionnaire into an active legal case.
 *
 * - Generates a unique case number (OSIS-YYYY-NNN)
 * - Creates the case row linked to the client user
 * - Adds an initial timeline event "Case Opened"
 * - Updates the application with the new case_id (if column exists)
 * - Returns the new case ID so the UI can link to it
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushToUser } from '@/lib/push/sendPush'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (profile?.role !== 'lawyer' && profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { appId, visaType, clientUserId, clientName, notes } = await req.json()
  const admin = createAdminClient()

  // Guard: check if a case already exists for this application
  const { data: existingApp } = await admin
    .from('applications').select('case_id').eq('id', appId).single()
  if (existingApp?.case_id) {
    return NextResponse.json({ ok: true, caseId: existingApp.case_id, alreadyExisted: true })
  }

  // Generate case number: OSIS-2026-001
  const year = new Date().getFullYear()
  const { count } = await admin.from('cases').select('*', { count: 'exact', head: true })
  const caseNum = `OSIS-${year}-${String((count ?? 0) + 1).padStart(3, '0')}`

  const visaLabels: Record<string,string> = {
    h1b:'H-1B', l1:'L-1', green_card:'Green Card', k1:'K-1', family_petition:'Family Petition'
  }

  // Create the case
  const { data: newCase, error } = await admin.from('cases').insert({
    case_number: caseNum,
    user_id: clientUserId,
    visa_type: visaLabels[visaType] || visaType,
    status: 'open',
    description: `${visaLabels[visaType] || visaType} case opened from intake application. ${notes ? 'Attorney notes: ' + notes : ''}`.trim(),
    assigned_attorney: profile?.full_name || null,
    opened_date: new Date().toISOString(),
  }).select('id').single()

  if (error || !newCase) {
    return NextResponse.json({ error: error?.message || 'Failed to create case' }, { status: 500 })
  }

  // Add initial timeline event
  await admin.from('case_timeline').insert({
    case_id: newCase.id,
    event: 'Case Opened',
    description: `${visaLabels[visaType] || visaType} case opened for ${clientName}. Intake questionnaire reviewed by ${profile?.full_name || 'attorney'}.`,
  })

  // Update application: set status + link to the new case
  await admin.from('applications')
    .update({ status: 'case_opened', case_id: newCase.id })
    .eq('id', appId)

  // Send push notification to client
  await sendPushToUser(admin, clientUserId, {
    title: '⚖️ Your Case Has Been Opened',
    body: `Case ${caseNum} has been opened for your ${visaLabels[visaType] || visaType} application.`,
    type: 'case_opened',
    data: { caseId: newCase.id, caseNumber: caseNum },
  })

  return NextResponse.json({ ok: true, caseId: newCase.id, caseNumber: caseNum })
}
