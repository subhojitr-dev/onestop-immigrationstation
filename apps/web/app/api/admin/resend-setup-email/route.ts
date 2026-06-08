/**
 * app/api/admin/resend-setup-email/route.ts
 *
 * Regenerates a fresh recovery link for an existing lawyer and re-sends
 * the welcome / set-password email via Resend. Only callable by admins.
 *
 * Body: { userId: string }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: callerProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can resend setup emails' }, { status: 403 })
  }

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })

  const admin = createAdminClient()

  // Fetch the lawyer's auth + profile details
  const { data: authUser, error: authErr } = await admin.auth.admin.getUserById(userId)
  if (authErr || !authUser?.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { data: profile } = await admin.from('profiles').select('full_name, role').eq('id', userId).single()
  if (profile?.role !== 'lawyer') {
    return NextResponse.json({ error: 'This is only available for lawyer accounts' }, { status: 400 })
  }

  const email = authUser.user.email!
  const firstName = profile.full_name?.split(' ')[0] || 'Attorney'

  // Generate a fresh recovery link
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://onestop-immigrationstation-web.vercel.app'}/reset-password`,
    },
  })
  if (linkErr || !linkData?.properties?.action_link) {
    return NextResponse.json({ error: 'Failed to generate reset link: ' + linkErr?.message }, { status: 500 })
  }

  const resetLink = linkData.properties.action_link

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'One Stop Immigration Station <noreply@onestopimmigrationstation.com>',
      to: [email],
      subject: 'One Stop Immigration Station — Set Your Password',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e7e9f0">
          <div style="background:linear-gradient(135deg,#1a2744,#243355);padding:28px;text-align:center">
            <div style="color:#cfa94a;font-size:20px;font-weight:700">One Stop Immigration Station</div>
          </div>
          <div style="padding:32px">
            <h2 style="color:#1a2744;margin:0 0 16px">Hello, ${firstName}!</h2>
            <p style="color:#586176;line-height:1.7;margin:0 0 16px">
              A new setup link has been generated for your attorney account at One Stop Immigration Station.
            </p>
            <p style="color:#586176;line-height:1.7;margin:0 0 24px">
              Click the button below to set your password and access the admin portal:
            </p>
            <div style="text-align:center;margin:24px 0">
              <a href="${resetLink}" style="background:linear-gradient(135deg,#cfa94a,#b8952a);color:#0b1322;padding:13px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
                Set My Password
              </a>
            </div>
            <p style="color:#98a0b0;font-size:13px;margin:0">
              This link expires in 24 hours. After setting your password, log in at
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://onestop-immigrationstation-web.vercel.app'}/login" style="color:#b8952a">the portal</a>.
            </p>
          </div>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    return NextResponse.json({ error: 'Email send failed: ' + body }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
