/**
 * app/api/admin/update-appointment/route.ts
 *
 * Internal API route — updates appointment status using the service role key
 * which bypasses RLS. Required because the lawyer updating a client's appointment
 * would otherwise be blocked by "Users see own appointments" RLS policy.
 *
 * Only callable by authenticated lawyers/admins — checks role before updating.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify the user is a lawyer or admin
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'lawyer' && profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { apptId, status } = await req.json()
  const admin = createAdminClient()
  const { error } = await admin.from('appointments').update({ status }).eq('id', apptId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
