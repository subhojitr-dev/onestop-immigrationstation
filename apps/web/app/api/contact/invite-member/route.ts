/**
 * POST /api/contact/invite-member
 *
 * Called by a Contact (or admin) to invite a new Sponsor or Beneficiary into
 * their company. Creates a Supabase auth user + profile, then sends a
 * "Set Your Password" welcome email via Resend.
 *
 * Required fields: firstName, lastName, email, phone, role (sponsor|beneficiary)
 * Optional: address, jobTitle, notes
 *
 * The new user's company_id is set to the caller's company_id.
 * If the caller (Contact) has no company_id yet, their own user_id is used
 * as the company_id — that seeds the company for all future invites.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role, company_id, full_name')
    .eq('id', user.id)
    .single()

  if (!callerProfile || !['contact', 'admin'].includes(callerProfile.role)) {
    return NextResponse.json({ error: 'Only contacts and admins can invite members' }, { status: 403 })
  }

  const { firstName, lastName, email, phone, role, address, jobTitle } = await req.json()

  if (!firstName || !lastName || !email || !phone) {
    return NextResponse.json({ error: 'First name, last name, email, and phone are required' }, { status: 400 })
  }
  if (!['sponsor', 'beneficiary'].includes(role)) {
    return NextResponse.json({ error: 'Role must be sponsor or beneficiary' }, { status: 400 })
  }

  const admin = createAdminClient()
  const fullName = `${firstName.trim()} ${lastName.trim()}`

  // Determine company_id — use caller's existing company_id, or seed with their own user_id
  const companyId = callerProfile.company_id || user.id

  // If this is the contact's first invite, save their company_id now
  if (!callerProfile.company_id) {
    await admin.from('profiles').update({ company_id: companyId }).eq('id', user.id)
  }

  // Create the auth user
  const tempPassword = crypto.randomUUID() + crypto.randomUUID()

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    email_confirm: true,
    password: tempPassword,
    user_metadata: { full_name: fullName },
  })

  if (authError) {
    if (authError.message.includes('already')) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  const newUserId = authData.user.id

  // Upsert profile with role, company_id, and invited_by
  const { error: profileError } = await admin.from('profiles').upsert({
    id: newUserId,
    email: email.trim().toLowerCase(),
    full_name: fullName,
    phone: phone?.trim() || null,
    address: address?.trim() || null,
    role,
    company_id: companyId,
    invited_by: user.id,
  }, { onConflict: 'id' })

  if (profileError) {
    return NextResponse.json({ error: 'Account created but profile failed: ' + profileError.message }, { status: 500 })
  }

  // Generate password-setup link
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onestop-immigrationstation-web.vercel.app'
  const { data: linkData } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email: email.trim().toLowerCase(),
    options: { redirectTo: `${siteUrl}/reset-password` },
  })
  const setupLink = linkData?.properties?.action_link || `${siteUrl}/forgot-password`

  const roleLabel = role === 'sponsor' ? 'Sponsor' : 'Beneficiary'
  const inviterName = callerProfile.full_name || 'Your company contact'

  // Send welcome email
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'One Stop Immigration Station <noreply@onestopimmigrationstation.com>',
        to: [email.trim().toLowerCase()],
        subject: `You've been invited to One Stop Immigration Station — Set Your Password`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e7e9f0">
            <div style="background:linear-gradient(135deg,#1a2744,#243355);padding:28px;text-align:center">
              <div style="color:#cfa94a;font-size:20px;font-weight:700">One Stop Immigration Station</div>
            </div>
            <div style="padding:32px">
              <h2 style="color:#1a2744;margin:0 0 16px">Welcome, ${firstName}!</h2>
              <p style="color:#586176;line-height:1.7;margin:0 0 16px">
                <strong>${inviterName}</strong> has invited you to join the One Stop Immigration Station client portal
                as a <strong>${roleLabel}</strong>.
              </p>
              <p style="color:#586176;line-height:1.7;margin:0 0 24px">
                Through your portal you can track your cases, upload documents, book appointments, and
                communicate with your immigration attorney — all in one place.
              </p>
              <p style="color:#586176;line-height:1.7;margin:0 0 24px">
                To get started, click the button below to create your password:
              </p>
              <div style="text-align:center;margin:24px 0">
                <a href="${setupLink}"
                   style="background:linear-gradient(135deg,#cfa94a,#b8952a);color:#0b1322;padding:13px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
                  Set My Password &amp; Log In
                </a>
              </div>
              <p style="color:#98a0b0;font-size:13px;margin:0">
                This link expires in 24 hours. If you need a new link, visit
                <a href="${siteUrl}/forgot-password" style="color:#b8952a">forgot password</a>.
              </p>
            </div>
          </div>
        `,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true, userId: newUserId, name: fullName })
}
