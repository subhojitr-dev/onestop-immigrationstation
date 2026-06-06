/**
 * app/admin/slots/page.tsx
 *
 * Lawyer Availability Manager — lets lawyers/admins create and manage
 * consultation time slots that clients can then book.
 *
 * Left panel: Add new slots (date + time, bulk add by week)
 * Right panel: Calendar-style view of all slots for the next 4 weeks,
 *              with booked/available status and a delete button on unbooked slots.
 *
 * The consultation_slots table has: lawyer_id, slot_date, slot_time, is_booked, booked_by
 * Run migration 003_slots.sql in Supabase first.
 */
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import SlotManager from './SlotManager'

export default async function AdminSlotsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Admin client bypasses RLS — reads ALL users' data
  const admin = createAdminClient()

  // Fetch existing slots for the next 60 days
  const today = new Date().toISOString().split('T')[0]
  const in60 = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Each lawyer only sees their OWN slots — filtered by lawyer_id = current user
  const { data: rawSlots } = await admin
    .from('consultation_slots')
    .select('*')
    .eq('lawyer_id', user.id)   // ← key: only this lawyer's slots
    .gte('slot_date', today)
    .lte('slot_date', in60)
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true })

  // Manually join booked_by profile
  const bookedByIds = [...new Set((rawSlots ?? []).filter(s => s.booked_by).map(s => s.booked_by))]
  const { data: bookedProfiles } = bookedByIds.length > 0
    ? await admin.from('profiles').select('id, full_name, email').in('id', bookedByIds)
    : { data: [] }
  const bookedMap = Object.fromEntries((bookedProfiles ?? []).map(p => [p.id, p]))

  const slots = (rawSlots ?? []).map(s => ({
    ...s,
    booked_profile: s.booked_by ? bookedMap[s.booked_by] ?? null : null,
  }))

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: '28px', color: '#1a2744', margin: '0 0 6px' }}>My Availability</h1>
        <p style={{ color: '#586176', fontSize: '15px', margin: 0 }}>
          Your consultation slots — {slots.filter(s => !s.is_booked).length} available · {slots.filter(s => s.is_booked).length} booked
        </p>
      </div>

      <SlotManager slots={slots} lawyerId={user.id} />
    </div>
  )
}
