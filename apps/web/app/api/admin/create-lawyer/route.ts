/**
 * app/api/admin/create-lawyer/route.ts
 *
 * Creates a new lawyer account directly from the admin panel.
 * Only admins can call this endpoint.
 *
 * What it does:
 *   1. Uses Supabase Admin Auth API (service role) to create the auth user
 *      with a temporary password — no email confirmation required
 *   2. Inserts a profile row with role = 'lawyer' and all provided details
 *   3. Returns the new user's ID
 *
 * The lawyer receives a welcome email (if RESEND_API_KEY is set) with
 * instructions to log in and set their own password via forgot-password.
 *
 * Fields: firstName, lastName, email, phone, address
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  // Auth check — only admins
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: callerProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can create lawyer accounts' }, { status: 403 })
  }

  const { firstName, lastName, email, phone, address, gender, dateOfBirth, qualification } = await req.json()

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: 'First name, last name, and email are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const fullName = `${firstName.trim()} ${lastName.trim()}`

  // Step 1: Create the Supabase auth user
  // email_confirm: true skips the confirmation email (admin-created accounts are pre-verified)
  // Set a random temp password so Supabase doesn't treat the account as
  // "no password" — otherwise its reuse-prevention logic errors when the
  // lawyer tries to set their real password via the recovery link.
  const tempPassword = crypto.randomUUID() + crypto.randomUUID()

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    email_confirm: true,
    password: tempPassword,
    user_metadata: { full_name: fullName },
  })

  if (authError) {
    // Common case: email already registered
    if (authError.message.includes('already')) {
      return NextResponse.json({ error: 'A user with this email already exists. Use the role dropdown on the Users page to promote them to lawyer.' }, { status: 409 })
    }
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  const newUserId = authData.user.id

  // Step 2: Upsert the profile row with lawyer role + all details
  // The auth trigger auto-creates a basic profile row, so we update it
  const { error: profileError } = await admin.from('profiles').upsert({
    id: newUserId,
    email: email.trim().toLowerCase(),
    full_name: fullName,
    phone: phone?.trim() || null,
    address: address?.trim() || null,
    gender: gender || null,
    date_of_birth: dateOfBirth || null,
    qualification: qualification || null,
    role: 'lawyer',
  }, { onConflict: 'id' })

  if (profileError) {
    return NextResponse.json({ error: 'Account created but profile update failed: ' + profileError.message }, { status: 500 })
  }

  // Step 3: Generate a direct password-reset link (no second email needed)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onestop-immigrationstation-web.vercel.app'
  const { data: linkData } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email: email.trim().toLowerCase(),
    options: { redirectTo: `${siteUrl}/reset-password` },
  })
  const resetLink = linkData?.properties?.action_link ||
    `${process.env.NEXT_PUBLIC_SITE_URL || 'https://onestop-immigrationstation-web.vercel.app'}/forgot-password`

  // Step 4: Send welcome email with the direct reset link
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'One Stop Immigration Station <noreply@onestopimmigrationstation.com>',
        to: [email.trim().toLowerCase()],
        subject: 'Welcome to One Stop Immigration Station — Set Your Password',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e7e9f0">
            <div style="background:linear-gradient(135deg,#1a2744,#243355);padding:28px;text-align:center">
              <div style="color:#cfa94a;font-size:20px;font-weight:700">One Stop Immigration Station</div>
            </div>
            <div style="padding:32px">
              <h2 style="color:#1a2744;margin:0 0 16px">Welcome, ${firstName}!</h2>
              <p style="color:#586176;line-height:1.7;margin:0 0 16px">
                Your attorney account has been created at One Stop Immigration Station.
                You have been set up with the <strong>Lawyer</strong> role.
              </p>
              <p style="color:#586176;line-height:1.7;margin:0 0 24px">
                To get started, please set your password by clicking the button below:
              </p>
              <div style="text-align:center;margin:24px 0">
                <a href="${resetLink}" style="background:linear-gradient(135deg,#cfa94a,#b8952a);color:#0b1322;padding:13px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
                  Set My Password
                </a>
              </div>
              <p style="color:#98a0b0;font-size:13px;margin:0">
                After setting your password, log in at
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://onestop-immigrationstation-web.vercel.app'}/login" style="color:#b8952a">the portal</a>
                and you'll be taken directly to the admin dashboard.
              </p>
            </div>
          </div>
        `,
      }),
    }).catch(() => {}) // Don't fail if email fails
  }

  return NextResponse.json({ ok: true, userId: newUserId, name: fullName })
}
