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
import { redirect } from 'next/navigation'
import SlotManager from './SlotManager'

export default async function AdminSlotsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch existing slots for the next 60 days
  const today = new Date().toISOString().split('T')[0]
  const in60 = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data: slots } = await supabase
    .from('consultation_slots')
    .select('*, booked_profile:profiles!booked_by(full_name, email)')
    .gte('slot_date', today)
    .lte('slot_date', in60)
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true })

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: '28px', color: '#1a2744', margin: '0 0 6px' }}>Availability</h1>
        <p style={{ color: '#586176', fontSize: '15px', margin: 0 }}>Manage consultation time slots clients can book</p>
      </div>

      <SlotManager slots={slots ?? []} lawyerId={user.id} />
    </div>
  )
}
