/**
 * POST /api/admin/add-timeline-event
 *
 * Inserts a case_timeline event and sends an in-portal notification to the client.
 * Replaces the direct Supabase insert in LawyerActions.tsx so we can use the
 * service role key (required for notifications insert) without exposing it client-side.
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

  const { caseId, caseNumber, clientUserId, event, description } = await req.json()
  if (!caseId || !event?.trim()) return NextResponse.json({ error: 'caseId and event are required' }, { status: 400 })

  const admin = createAdminClient()

  // Insert timeline event
  const { error } = await admin.from('case_timeline').insert({
    case_id: caseId,
    event: event.trim(),
    description: description?.trim() || null,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify client
  if (clientUserId) {
    sendPushToUser(admin, clientUserId, {
      title: `Case Update — ${caseNumber}`,
      body: `${event.trim()}${description ? ': ' + description.trim() : ''}`,
      type: 'case_update',
      data: { caseId },
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
