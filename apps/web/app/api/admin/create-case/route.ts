/**
 * POST /api/admin/create-case
 *
 * Creates a new case directly (no application required — for walk-in/phone clients).
 * Generates OSIS-YYYY-NNN case number and adds initial "Case Opened" timeline event.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: callerProfile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (callerProfile?.role !== 'lawyer' && callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { clientUserId, visaType, description, assignedAttorney } = await req.json()
  if (!clientUserId || !visaType) {
    return NextResponse.json({ error: 'Client and visa type are required' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Get client name for timeline event
  const { data: clientProfile } = await admin.from('profiles').select('full_name, email').eq('id', clientUserId).single()
  const clientName = clientProfile?.full_name || clientProfile?.email || 'Client'

  // Generate case number: OSIS-2026-001
  const year = new Date().getFullYear()
  const { count } = await admin.from('cases').select('*', { count: 'exact', head: true })
  const caseNum = `OSIS-${year}-${String((count ?? 0) + 1).padStart(3, '0')}`

  // Create the case
  const { data: newCase, error } = await admin.from('cases').insert({
    case_number: caseNum,
    user_id: clientUserId,
    visa_type: visaType,
    status: 'open',
    description: description?.trim() || null,
    assigned_attorney: assignedAttorney || callerProfile?.full_name || null,
    opened_date: new Date().toISOString(),
  }).select('id').single()

  if (error || !newCase) {
    return NextResponse.json({ error: error?.message || 'Failed to create case' }, { status: 500 })
  }

  // Add initial timeline event
  await admin.from('case_timeline').insert({
    case_id: newCase.id,
    event: 'Case Opened',
    description: `${visaType} case opened for ${clientName} by ${callerProfile?.full_name || 'attorney'}.`,
  })

  return NextResponse.json({ ok: true, caseId: newCase.id, caseNumber: caseNum })
}
