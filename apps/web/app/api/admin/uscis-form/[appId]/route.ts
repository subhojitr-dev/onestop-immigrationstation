/**
 * GET /api/admin/uscis-form/[appId]
 *
 * Generates and streams a USCIS Pre-Fill Data Sheet PDF for the given application.
 * Only accessible to authenticated lawyers/admins.
 *
 * The PDF is generated server-side using pdf-lib and returned as a binary
 * application/pdf response — the browser triggers a native download.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateUscisFormPdf } from '@/lib/uscis/generatePdf'
import { formsByVisaType } from '@/lib/uscis/formMaps'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const { appId } = await params

  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: callerProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (callerProfile?.role !== 'lawyer' && callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Fetch application
  const admin = createAdminClient()
  const { data: app } = await admin.from('applications').select('*').eq('id', appId).single()
  if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

  // Check we have a form mapping for this visa type
  if (!formsByVisaType[app.visa_type]) {
    return NextResponse.json(
      { error: `No USCIS form mapping available for visa type: ${app.visa_type}` },
      { status: 422 }
    )
  }

  // Fetch client profile
  const { data: profile } = await admin.from('profiles').select('full_name, email').eq('id', app.user_id).single()
  const clientName  = (profile as any)?.full_name || (profile as any)?.email?.split('@')[0] || 'Client'
  const clientEmail = (profile as any)?.email || ''

  // Generate PDF
  const pdfBytes = await generateUscisFormPdf(
    app.visa_type,
    app.data as Record<string, any>,
    clientName,
    clientEmail,
    app.submitted_at,
  )

  // Filename: i129-prefill-maria-garcia.pdf
  const formNum = formsByVisaType[app.visa_type].formNumber.toLowerCase().replace('-', '')
  const safeName = clientName.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '')
  const filename = `${formNum}-prefill-${safeName}.pdf`

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(pdfBytes.length),
    },
  })
}
