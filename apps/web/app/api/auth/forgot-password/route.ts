/**
 * POST /api/auth/forgot-password
 *
 * Generates a password recovery link via Supabase Admin API and sends it
 * through Resend — bypasses Supabase's own unreliable email system.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const admin = createAdminClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onestop-immigrationstation-web.vercel.app'

  // Generate a direct recovery link — no email sent by Supabase
  const { data, error } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email: email.trim().toLowerCase(),
    options: { redirectTo: `${siteUrl}/reset-password` },
  })

  if (error) {
    // Don't reveal whether the email exists — just return success
    return NextResponse.json({ ok: true })
  }

  const resetLink = data?.properties?.action_link
  if (!resetLink) return NextResponse.json({ ok: true })

  // Send via Resend
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'One Stop Immigration Station <noreply@onestopimmigrationstation.com>',
        to: [email.trim().toLowerCase()],
        subject: 'Reset Your Password — One Stop Immigration Station',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e7e9f0">
            <div style="background:linear-gradient(135deg,#1a2744,#243355);padding:28px;text-align:center">
              <div style="color:#cfa94a;font-size:20px;font-weight:700">One Stop Immigration Station</div>
            </div>
            <div style="padding:32px">
              <h2 style="color:#1a2744;margin:0 0 16px">Reset Your Password</h2>
              <p style="color:#586176;line-height:1.7;margin:0 0 24px">
                We received a request to reset the password for your account.
                Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
              </p>
              <div style="text-align:center;margin:24px 0">
                <a href="${resetLink}" style="background:linear-gradient(135deg,#cfa94a,#b8952a);color:#0b1322;padding:13px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
                  Reset My Password
                </a>
              </div>
              <p style="color:#98a0b0;font-size:13px;margin:0;line-height:1.6">
                If you did not request a password reset, you can safely ignore this email.
                Your password will not be changed.
              </p>
            </div>
          </div>
        `,
      }),
    })
  }

  return NextResponse.json({ ok: true })
}
