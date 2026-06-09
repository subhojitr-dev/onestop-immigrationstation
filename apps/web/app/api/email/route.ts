/**
 * app/api/email/route.ts
 *
 * Internal API route for triggering emails + push notifications from client components.
 * Client components cannot import server-only libs directly, so they POST here instead.
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
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  sendApplicationSubmittedEmail,
  sendApplicationStatusEmail,
  sendTicketReplyEmail,
  sendAppointmentBookedEmail,
  sendAppointmentStatusEmail,
  sendCaseStatusEmail,
} from '@/lib/email/resend'
import { sendPushToUser } from '@/lib/push/sendPush'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { type, ...payload } = body
  const admin = createAdminClient()

  let result
  switch (type) {
    case 'application_submitted':
      result = await sendApplicationSubmittedEmail(payload)
      break

    case 'application_status':
      result = await sendApplicationStatusEmail(payload)
      // Push to client when application status changes
      if (payload.clientUserId && payload.newStatus) {
        sendPushToUser(admin, payload.clientUserId, {
          title: '📋 Application Status Updated',
          body: `Your ${payload.visaType ?? 'visa'} application status changed to: ${payload.newStatus.replace(/_/g, ' ')}.`,
          type: 'case_update',
          data: { appId: payload.appId ?? '' },
        }).catch(() => {})
      }
      break

    case 'ticket_reply':
      result = await sendTicketReplyEmail(payload)
      // Push to ticket owner when staff replies
      if (payload.clientUserId && payload.ticketId) {
        sendPushToUser(admin, payload.clientUserId, {
          title: '🎫 New Reply on Your Ticket',
          body: payload.replyPreview ? `"${payload.replyPreview.slice(0, 80)}..."` : 'You have a new reply on your support ticket.',
          type: 'ticket_reply',
          data: { ticketId: payload.ticketId },
        }).catch(() => {})
      }
      break

    case 'appointment_booked':
      result = await sendAppointmentBookedEmail(payload)
      break

    case 'appointment_status':
      result = await sendAppointmentStatusEmail(payload)
      break

    case 'case_status':
      result = await sendCaseStatusEmail(payload)
      // Push to client when case timeline is updated
      if (payload.clientUserId && payload.caseId) {
        sendPushToUser(admin, payload.clientUserId, {
          title: '📁 Case Update',
          body: payload.event ?? 'Your case has been updated.',
          type: 'case_update',
          data: { caseId: payload.caseId },
        }).catch(() => {})
      }
      break

    default:
      return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 })
  }

  return NextResponse.json(result)
}
