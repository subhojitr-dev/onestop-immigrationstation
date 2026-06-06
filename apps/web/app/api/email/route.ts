/**
 * app/api/email/route.ts
 *
 * Internal API route for triggering emails from client components.
 * Client components cannot import server-only libs (like Resend) directly,
 * so they POST to this route instead.
 *
 * POST body: { type: string, ...payload }
 *
 * Supported types:
 *   application_submitted  — client submitted a visa questionnaire
 *   application_status     — lawyer changed application status
 *   ticket_reply           — new reply on a support ticket
 *   appointment_booked     — client booked a new appointment
 *   appointment_status     — lawyer confirmed or cancelled appointment
 *   case_status            — lawyer updated case status
 *
 * This route is only called from within the app (no external access needed).
 * It validates that a Supabase session exists before sending any email.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  sendApplicationSubmittedEmail,
  sendApplicationStatusEmail,
  sendTicketReplyEmail,
  sendAppointmentBookedEmail,
  sendAppointmentStatusEmail,
  sendCaseStatusEmail,
} from '@/lib/email/resend'

export async function POST(req: NextRequest) {
  // Auth check — must be a logged-in user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { type, ...payload } = body

  let result
  switch (type) {
    case 'application_submitted':
      result = await sendApplicationSubmittedEmail(payload)
      break
    case 'application_status':
      result = await sendApplicationStatusEmail(payload)
      break
    case 'ticket_reply':
      result = await sendTicketReplyEmail(payload)
      break
    case 'appointment_booked':
      result = await sendAppointmentBookedEmail(payload)
      break
    case 'appointment_status':
      result = await sendAppointmentStatusEmail(payload)
      break
    case 'case_status':
      result = await sendCaseStatusEmail(payload)
      break
    default:
      return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 })
  }

  return NextResponse.json(result)
}
