/**
 * app/dashboard/appointments/book/page.tsx
 *
 * Book Appointment — client-facing booking page.
 *
 * Now pulls real available slots from the consultation_slots table
 * (set by lawyers in /admin/slots) instead of showing hardcoded time buttons.
 *
 * Flow:
 *   1. Client picks a date from the calendar — only dates that have available
 *      (is_booked = false) slots are enabled.
 *   2. The available time slots for that date appear as clickable buttons.
 *   3. On confirm: inserts a row into appointments, marks the slot as booked
 *      (is_booked = true, booked_by = user.id), sends confirmation email.
 *
 * Falls back gracefully if no slots are configured — shows a "no availability"
 * message with a link to the support ticket page.
 */
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Slot {
  id: string
  slot_date: string
  slot_time: string
}

export default function BookAppointmentPage() {
  const router = useRouter()
  const [user, setUser]                 = useState<any>(null)
  const [freeUsed, setFreeUsed]         = useState(0)
  const [availableDates, setAvailableDates] = useState<string[]>([])   // dates that have open slots
  const [slotsOnDate, setSlotsOnDate]   = useState<Slot[]>([])         // slots for selected date
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [notes, setNotes]               = useState('')
  const [loading, setLoading]           = useState(true)
  const [booking, setBooking]           = useState(false)
  const [success, setSuccess]           = useState(false)
  const [error, setError]               = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      // Count free consultations already used
      const { data: appts } = await supabase
        .from('appointments').select('is_free').eq('user_id', user.id).eq('is_free', true)
      setFreeUsed(appts?.length ?? 0)

      // Fetch all available (unbooked) slots from today onward
      const today = new Date().toISOString().split('T')[0]
      const { data: slots } = await supabase
        .from('consultation_slots')
        .select('id, slot_date, slot_time, lawyer_id, profiles(full_name)')
        .eq('is_booked', false)
        .gte('slot_date', today)
        .order('slot_date').order('slot_time')

      // Extract unique dates that have slots
      const dates = [...new Set((slots ?? []).map(s => s.slot_date))]
      setAvailableDates(dates)
      setLoading(false)
    }
    load()
  }, [router])

  // When date changes, load slots for that date
  useEffect(() => {
    if (!selectedDate) { setSlotsOnDate([]); setSelectedSlot(null); return }
    async function loadSlots() {
      const supabase = createClient()
      const { data: slots } = await supabase
        .from('consultation_slots')
        .select('id, slot_date, slot_time, lawyer_id, profiles(full_name)')
        .eq('slot_date', selectedDate)
        .eq('is_booked', false)
        .order('slot_time')
      setSlotsOnDate(slots ?? [])
      setSelectedSlot(null)
    }
    loadSlots()
  }, [selectedDate])

  async function handleBook(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate || !selectedSlot) { setError('Please select a date and time slot'); return }
    setBooking(true)
    setError('')

    const supabase = createClient()
    const isFree = freeUsed < 2

    // Get lawyer name from the slot
    const lawyerName = (selectedSlot as any).profiles?.full_name || null

    // Insert appointment row
    const { error: apptErr } = await supabase.from('appointments').insert({
      user_id: user.id,
      date: selectedDate,
      time_slot: selectedSlot.slot_time,
      status: 'pending',
      is_free: isFree,
      free_session_number: isFree ? freeUsed + 1 : null,
      notes: notes || null,
      lawyer_name: lawyerName,
    })

    if (apptErr) { setError('Booking failed: ' + apptErr.message); setBooking(false); return }

    // Mark the slot as booked
    await supabase.from('consultation_slots')
      .update({ is_booked: true, booked_by: user.id })
      .eq('id', selectedSlot.id)

    // Send confirmation email
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'appointment_booked',
        clientName: profile?.full_name || user.email?.split('@')[0] || 'Client',
        clientEmail: user.email,
        date: selectedDate,
        timeSlot: selectedSlot.slot_time,
        isFree,
        freeNumber: isFree ? freeUsed + 1 : undefined,
      }),
    }).catch(() => {})

    setSuccess(true)
    setBooking(false)
  }

  if (success) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div className="auth-success-icon" style={{ margin: '0 auto 20px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h1 style={{ fontFamily: 'Lora, serif', color: '#1a2744', marginBottom: '8px' }}>Appointment Booked!</h1>
          <p style={{ color: '#6b7280', marginBottom: '8px' }}>
            <strong>{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong>
            {' at '}
            <strong>{selectedSlot?.slot_time}</strong>
          </p>
          {freeUsed < 2 && (
            <p style={{ color: '#10b981', fontSize: '14px', marginBottom: '20px' }}>
              ✓ This counts as free consultation #{freeUsed + 1} of 2
            </p>
          )}
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
            A confirmation email has been sent. Our team will confirm your preferred format (phone or video).
          </p>
          <Link href="/dashboard/appointments" className="btn btn--navy" style={{ textDecoration: 'none', display: 'inline-block' }}>
            View My Appointments
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', color: '#6b7280' }}>
        <Link href="/dashboard/appointments" style={{ color: '#6b7280', textDecoration: 'none' }}>Appointments</Link>
        <span>→</span>
        <span style={{ color: '#1a2744', fontWeight: 500 }}>Book Appointment</span>
      </div>

      <div className="portal-header">
        <div>
          <h1>Book an Appointment</h1>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: '4px 0 0' }}>Choose from available consultation slots</p>
        </div>
      </div>

      {freeUsed < 2 && (
        <div className="appt-free-banner" style={{ marginBottom: '24px' }}>
          <div className="afb-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            <div>
              <div className="afb-title">This will be a FREE consultation</div>
              <div className="afb-sub">You have {2 - freeUsed} free consultation{2 - freeUsed > 1 ? 's' : ''} remaining</div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#98a0b0' }}>Loading available slots…</div>
      ) : availableDates.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid #e7e9f0' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📅</div>
          <h3 style={{ fontFamily: 'Lora, serif', color: '#1a2744', marginBottom: '8px' }}>No slots available right now</h3>
          <p style={{ color: '#586176', marginBottom: '20px', fontSize: '15px' }}>
            Our attorneys haven't posted upcoming availability yet. Please check back soon or reach out directly.
          </p>
          <Link href="/dashboard/tickets/new" className="btn btn--navy" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Contact Us
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
          <div className="portal-section">
            {error && <div className="auth-error" style={{ marginBottom: '16px' }}>{error}</div>}
            <form onSubmit={handleBook}>
              {/* Date selector */}
              <div className="auth-field">
                <label>Select a Date *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
                  {availableDates.slice(0, 12).map(d => {
                    const dt = new Date(d + 'T12:00:00')
                    const isSelected = selectedDate === d
                    return (
                      <button key={d} type="button" onClick={() => setSelectedDate(d)}
                        style={{ padding: '10px 8px', borderRadius: '10px', border: '1.5px solid', borderColor: isSelected ? '#1a2744' : '#e5e7eb', background: isSelected ? '#1a2744' : '#fff', color: isSelected ? '#fff' : '#374151', fontSize: '13px', cursor: 'pointer', fontWeight: isSelected ? 700 : 400, textAlign: 'center', transition: 'all .15s' }}>
                        <div style={{ fontWeight: 700 }}>{dt.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div>{dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time slot selector */}
              {selectedDate && (
                <div className="auth-field">
                  <label>Select a Time *</label>
                  {slotsOnDate.length === 0 ? (
                    <p style={{ color: '#98a0b0', fontSize: '14px', marginTop: '8px' }}>No slots available on this date</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
                      {slotsOnDate.map(slot => {
                        const isSelected = selectedSlot?.id === slot.id
                        return (
                          <button key={slot.id} type="button" onClick={() => setSelectedSlot(slot)}
                            style={{ padding: '11px', borderRadius: '8px', border: '1.5px solid', borderColor: isSelected ? '#1a2744' : '#e5e7eb', background: isSelected ? '#1a2744' : '#fff', color: isSelected ? '#fff' : '#374151', fontSize: '14px', cursor: 'pointer', fontWeight: isSelected ? 600 : 400, transition: 'all .15s' }}>
                            {slot.slot_time}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="auth-field">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Tell us briefly what you'd like to discuss…"
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', minHeight: '80px', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" className="btn btn--navy" disabled={booking || !selectedSlot} style={{ width: '100%', padding: '13px' }}>
                {booking ? 'Booking…' : 'Confirm Appointment'}
              </button>
            </form>
          </div>

          {/* Info card */}
          <div className="portal-section">
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: '18px', color: '#1a2744', margin: '0 0 16px' }}>What to expect</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: '🕐', title: '30-minute session', desc: 'Each consultation is 30 minutes with a bilingual attorney' },
                { icon: '📞', title: 'Phone or video', desc: "We'll confirm your preferred format via email" },
                { icon: '🌐', title: 'English or Español', desc: 'Our team speaks both fluently' },
                { icon: '✅', title: 'No obligation', desc: 'Free consultations come with no commitment required' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a2744' }}>{item.title}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
