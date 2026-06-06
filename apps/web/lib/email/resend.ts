/**
 * lib/email/resend.ts
 *
 * Central email sending module using the Resend API.
 *
 * All emails come from noreply@onestopimmigrationstation.com (Resend-verified domain).
 * RESEND_API_KEY must be set in apps/web/.env.local and in Vercel environment variables.
 *
 * Usage — call any of the exported functions from Server Actions or API routes:
 *   import { sendApplicationSubmittedEmail } from '@/lib/email/resend'
 *   await sendApplicationSubmittedEmail({ clientName, clientEmail, visaType, appId })
 *
 * Each function:
 *   - Builds a clean HTML email with the firm's navy/gold branding
 *   - Sends via Resend REST API (no SDK dependency issues)
 *   - Returns { ok: true } or { ok: false, error } — callers should log but not crash on failure
 *   - Never throws — email failure should never block the main action
 */

const FROM = 'One Stop Immigration Station <noreply@onestopimmigrationstation.com>'
const ADMIN_EMAIL = 'admin@onestopimmigrationstation.com' // lawyer/admin inbox

const RESEND_API = 'https://api.resend.com/emails'

/** Low-level send — returns ok/error without throwing */
async function send(to: string | string[], subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping email')
    return { ok: false, error: 'RESEND_API_KEY not configured' }
  }
  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: Array.isArray(to) ? to : [to], subject, html }),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error('[email] Resend error:', body)
      return { ok: false, error: body }
    }
    return { ok: true }
  } catch (err) {
    console.error('[email] Send failed:', err)
    return { ok: false, error: String(err) }
  }
}

/** Shared email shell — navy header + content + gold CTA button */
function emailShell(title: string, body: string, ctaText?: string, ctaUrl?: string) {
  const cta = ctaText && ctaUrl
    ? `<div style="text-align:center;margin:28px 0 8px">
         <a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#cfa94a,#b8952a);color:#0b1322;padding:13px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;font-family:'Libre Franklin',Arial,sans-serif">${ctaText}</a>
       </div>`
    : ''
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Libre Franklin',Arial,sans-serif">
<div style="max-width:580px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(17,27,49,.08)">
  <div style="background:linear-gradient(135deg,#1a2744,#243355);padding:28px 32px;text-align:center">
    <div style="color:#cfa94a;font-size:22px;font-weight:700;letter-spacing:-.01em">One Stop Immigration Station</div>
    <div style="color:rgba(255,255,255,.65);font-size:13px;margin-top:4px">Your Trusted Immigration Partner</div>
  </div>
  <div style="padding:32px">
    <h2 style="margin:0 0 16px;color:#1a2744;font-size:20px;font-weight:700">${title}</h2>
    <div style="color:#586176;font-size:15px;line-height:1.7">${body}</div>
    ${cta}
  </div>
  <div style="background:#f4f6fb;padding:18px 32px;text-align:center;font-size:12px;color:#98a0b0;border-top:1px solid #e7e9f0">
    © ${new Date().getFullYear()} One Stop Immigration Station &nbsp;·&nbsp;
    <a href="https://onestop-immigrationstation-web.vercel.app/dashboard" style="color:#b8952a;text-decoration:none">Client Portal</a>
  </div>
</div>
</body></html>`
}

// ─── APPLICATION EMAILS ──────────────────────────────────────

/** Client confirmation when they submit a visa intake questionnaire */
export async function sendApplicationSubmittedEmail(opts: {
  clientName: string
  clientEmail: string
  visaType: string
  appId: string
}) {
  const { clientName, clientEmail, visaType, appId } = opts
  const portalUrl = `https://onestop-immigrationstation-web.vercel.app/dashboard/apply`
  const html = emailShell(
    'Application Received',
    `<p>Hi ${clientName},</p>
     <p>Thank you for submitting your <strong>${visaType}</strong> intake questionnaire. Our attorneys have been notified and will review your responses within <strong>1–2 business days</strong>.</p>
     <p>You can log in to your portal at any time to check the status, open a support ticket, or upload additional documents.</p>`,
    'Go to My Dashboard',
    portalUrl
  )
  // Also notify the admin/lawyer inbox
  await send(ADMIN_EMAIL, `New ${visaType} Application — ${clientName}`,
    emailShell(
      `New Application Submitted`,
      `<p><strong>${clientName}</strong> (${clientEmail}) has submitted a <strong>${visaType}</strong> intake questionnaire.</p>
       <p>Application ID: <code>${appId}</code></p>
       <p>Please review and update the status in the admin panel.</p>`,
      'Review Application',
      `https://onestop-immigrationstation-web.vercel.app/admin/applications/${appId}`
    )
  )
  return send(clientEmail, `We received your ${visaType} application`, html)
}

/** Notify client when their application status changes */
export async function sendApplicationStatusEmail(opts: {
  clientName: string
  clientEmail: string
  visaType: string
  newStatus: string
  lawyerNote?: string
}) {
  const { clientName, clientEmail, visaType, newStatus, lawyerNote } = opts
  const statusLabels: Record<string, string> = {
    under_review:   'Under Review — our attorneys are reviewing your file',
    info_requested: 'Additional Information Required',
    approved:       'Approved — congratulations!',
    rejected:       'Application Closed',
  }
  const label = statusLabels[newStatus] || newStatus
  const noteBlock = lawyerNote
    ? `<div style="background:#f0f4ff;border-left:4px solid #1a2744;padding:14px 16px;border-radius:0 8px 8px 0;margin:16px 0;font-size:14px;color:#1a2744"><strong>Note from your attorney:</strong><br>${lawyerNote}</div>`
    : ''
  const html = emailShell(
    `Application Update: ${label}`,
    `<p>Hi ${clientName},</p>
     <p>Your <strong>${visaType}</strong> application status has been updated to: <strong>${label}</strong>.</p>
     ${noteBlock}
     <p>Log in to your portal to view the full details and any next steps.</p>`,
    'View My Application',
    `https://onestop-immigrationstation-web.vercel.app/dashboard/apply`
  )
  return send(clientEmail, `Your ${visaType} application: ${label}`, html)
}

// ─── TICKET EMAILS ───────────────────────────────────────────

/** Notify the other party when a support ticket gets a new reply */
export async function sendTicketReplyEmail(opts: {
  recipientName: string
  recipientEmail: string
  ticketSubject: string
  ticketId: string
  replyBody: string
  replierName: string
  isStaffReply: boolean
}) {
  const { recipientName, recipientEmail, ticketSubject, ticketId, replyBody, replierName, isStaffReply } = opts
  const from = isStaffReply ? 'Your attorney' : replierName
  const html = emailShell(
    `New reply on: "${ticketSubject}"`,
    `<p>Hi ${recipientName},</p>
     <p><strong>${from}</strong> replied to your support ticket:</p>
     <div style="background:#f4f6fb;border-radius:10px;padding:16px;margin:16px 0;font-size:14px;color:#1a2744;white-space:pre-wrap">${replyBody}</div>
     <p>Log in to reply or view the full conversation.</p>`,
    'View Ticket',
    `https://onestop-immigrationstation-web.vercel.app/dashboard/tickets/${ticketId}`
  )
  return send(recipientEmail, `Reply on ticket: ${ticketSubject}`, html)
}

// ─── APPOINTMENT EMAILS ──────────────────────────────────────

/** Client confirmation when appointment is booked */
export async function sendAppointmentBookedEmail(opts: {
  clientName: string
  clientEmail: string
  date: string
  timeSlot: string
  isFree: boolean
  freeNumber?: number
}) {
  const { clientName, clientEmail, date, timeSlot, isFree, freeNumber } = opts
  const freeNote = isFree
    ? `<p style="color:#047857;font-weight:600">✓ This is your free consultation #${freeNumber} of 2.</p>`
    : ''
  const html = emailShell(
    'Appointment Confirmed',
    `<p>Hi ${clientName},</p>
     <p>Your appointment has been booked:</p>
     <div style="background:#f0f4ff;border-radius:10px;padding:16px;margin:16px 0">
       <div style="font-size:16px;font-weight:700;color:#1a2744">${date}</div>
       <div style="font-size:15px;color:#586176;margin-top:4px">${timeSlot}</div>
     </div>
     ${freeNote}
     <p>Our team will confirm your preferred format (phone or video) within one business day.</p>`,
    'View My Appointments',
    `https://onestop-immigrationstation-web.vercel.app/dashboard/appointments`
  )
  await send(ADMIN_EMAIL, `New appointment booked — ${clientName} on ${date} at ${timeSlot}`,
    emailShell('New Appointment Booked',
      `<p><strong>${clientName}</strong> booked an appointment for <strong>${date}</strong> at <strong>${timeSlot}</strong>.</p>`)
  )
  return send(clientEmail, `Appointment confirmed — ${date} at ${timeSlot}`, html)
}

/** Client notification when appointment is confirmed/cancelled by lawyer */
export async function sendAppointmentStatusEmail(opts: {
  clientName: string
  clientEmail: string
  date: string
  timeSlot: string
  status: 'confirmed' | 'cancelled'
}) {
  const { clientName, clientEmail, date, timeSlot, status } = opts
  const isConfirmed = status === 'confirmed'
  const html = emailShell(
    isConfirmed ? 'Appointment Confirmed by Attorney' : 'Appointment Cancelled',
    `<p>Hi ${clientName},</p>
     <p>Your appointment on <strong>${date}</strong> at <strong>${timeSlot}</strong> has been <strong>${isConfirmed ? 'confirmed' : 'cancelled'}</strong>.</p>
     ${isConfirmed ? '<p>We look forward to speaking with you. Our team will reach out if any further information is needed beforehand.</p>' : '<p>Please book a new time at your convenience.</p>'}`,
    isConfirmed ? 'View Appointments' : 'Book New Appointment',
    `https://onestop-immigrationstation-web.vercel.app/dashboard/appointments${isConfirmed ? '' : '/book'}`
  )
  return send(clientEmail, `Appointment ${status} — ${date} at ${timeSlot}`, html)
}

// ─── CASE EMAILS ─────────────────────────────────────────────

/** Client notification when their case status changes */
export async function sendCaseStatusEmail(opts: {
  clientName: string
  clientEmail: string
  caseNumber: string
  visaType: string
  newStatus: string
  lawyerNote?: string
}) {
  const { clientName, clientEmail, caseNumber, visaType, newStatus, lawyerNote } = opts
  const noteBlock = lawyerNote
    ? `<div style="background:#f0f4ff;border-left:4px solid #1a2744;padding:14px 16px;border-radius:0 8px 8px 0;margin:16px 0;font-size:14px;color:#1a2744"><strong>Attorney note:</strong><br>${lawyerNote}</div>`
    : ''
  const html = emailShell(
    `Case Update: ${caseNumber}`,
    `<p>Hi ${clientName},</p>
     <p>Your <strong>${visaType}</strong> case <strong>#${caseNumber}</strong> has been updated.</p>
     <p>New status: <strong>${newStatus}</strong></p>
     ${noteBlock}
     <p>Log in to view the full timeline and any required documents.</p>`,
    'View My Case',
    `https://onestop-immigrationstation-web.vercel.app/dashboard/cases`
  )
  return send(clientEmail, `Case update — ${caseNumber}: ${newStatus}`, html)
}
