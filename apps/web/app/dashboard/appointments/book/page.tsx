'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
]

export default function BookAppointmentPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [freeUsed, setFreeUsed] = useState(0)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: appts } = await supabase
        .from('appointments')
        .select('is_free')
        .eq('user_id', user.id)
        .eq('is_free', true)

      setFreeUsed(appts?.length ?? 0)
    }
    load()
  }, [router])

  async function handleBook(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate || !selectedSlot) {
      setError('Please select a date and time slot')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const isFree = freeUsed < 2

    const { error } = await supabase.from('appointments').insert({
      user_id: user.id,
      date: selectedDate,
      time_slot: selectedSlot,
      status: 'pending',
      is_free: isFree,
      free_session_number: isFree ? freeUsed + 1 : null,
      notes: notes || null,
    })

    if (error) {
      setError('Booking failed: ' + error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  // Get min date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Get max date (3 months out)
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  if (success) {
    return (
      <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{textAlign:'center', maxWidth:'400px'}}>
            <div className="auth-success-icon" style={{margin:'0 auto 20px'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h1 style={{fontFamily:'Lora, serif', color:'#1a2744', marginBottom:'8px'}}>Appointment Booked!</h1>
            <p style={{color:'#6b7280', marginBottom:'8px'}}>
              <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>
            </p>
            {freeUsed < 2 && (
              <p style={{color:'#10b981', fontSize:'14px', marginBottom:'20px'}}>
                ✓ This counts as free consultation #{freeUsed + 1} of 2
              </p>
            )}
            <p style={{color:'#6b7280', fontSize:'14px', marginBottom:'24px'}}>
              Our team will confirm your appointment within one business day. You&apos;ll receive an email confirmation.
            </p>
            <Link href="/dashboard/appointments" className="btn btn--navy" style={{textDecoration:'none', display:'inline-block'}}>
              View My Appointments
            </Link>
          </div>
      </div>
    )
  }

  return (
    <>
      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px', fontSize:'14px', color:'#6b7280'}}>
          <Link href="/dashboard/appointments" style={{color:'#6b7280', textDecoration:'none'}}>Appointments</Link>
          <span>→</span>
          <span style={{color:'#1a2744', fontWeight:500}}>Book Appointment</span>
        </div>

        <div className="portal-header">
          <div>
            <h1>Book an Appointment</h1>
            <p style={{color:'#6b7280', fontSize:'15px', margin:'4px 0 0'}}>
              Choose a date and time that works for you
            </p>
          </div>
        </div>

        {/* Free consultation banner */}
        {freeUsed < 2 && (
          <div className="appt-free-banner" style={{marginBottom:'24px'}}>
            <div className="afb-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
              <div>
                <div className="afb-title">This will be a FREE consultation</div>
                <div className="afb-sub">You have {2 - freeUsed} free consultation{2 - freeUsed > 1 ? 's' : ''} remaining</div>
              </div>
            </div>
          </div>
        )}

        <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px', alignItems:'start'}}>
          <div className="portal-section">
            {error && (
              <div className="auth-error" style={{marginBottom:'16px'}}>{error}</div>
            )}
            <form onSubmit={handleBook}>
              {/* Date picker */}
              <div className="auth-field">
                <label htmlFor="date">Select Date *</label>
                <input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  min={minDate}
                  max={maxDateStr}
                  required
                  style={{fontSize:'15px', padding:'10px 14px'}}
                />
              </div>

              {/* Time slots */}
              <div className="auth-field">
                <label>Select Time Slot *</label>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'8px', marginTop:'6px'}}>
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding:'10px', borderRadius:'8px', border:'1.5px solid',
                        borderColor: selectedSlot === slot ? '#1a2744' : '#e5e7eb',
                        background: selectedSlot === slot ? '#1a2744' : '#fff',
                        color: selectedSlot === slot ? '#fff' : '#374151',
                        fontSize:'14px', cursor:'pointer', fontWeight: selectedSlot === slot ? 600 : 400,
                        transition:'all .15s'
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="auth-field">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Tell us briefly what you'd like to discuss…"
                  style={{width:'100%', padding:'10px 14px', border:'1.5px solid #e5e7eb', borderRadius:'8px', fontSize:'15px', minHeight:'80px', boxSizing:'border-box'}}
                />
              </div>

              <button type="submit" className="btn btn--navy" disabled={loading} style={{width:'100%', padding:'13px'}}>
                {loading ? 'Booking…' : 'Confirm Appointment'}
              </button>
            </form>
          </div>

          {/* Info card */}
          <div className="portal-section">
            <h2 style={{fontFamily:'Lora, serif', fontSize:'18px', color:'#1a2744', margin:'0 0 16px'}}>What to expect</h2>
            <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
              {[
                {icon:'🕐', title:'30-minute session', desc:'Each consultation is 30 minutes with a bilingual attorney'},
                {icon:'📞', title:'Phone or video', desc:"We'll confirm your preferred format via email"},
                {icon:'🌐', title:'English or Español', desc:'Our team speaks both fluently'},
                {icon:'✅', title:'No obligation', desc:'Free consultations come with no commitment required'},
              ].map((item, i) => (
                <div key={i} style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
                  <span style={{fontSize:'20px', flexShrink:0}}>{item.icon}</span>
                  <div>
                    <div style={{fontSize:'14px', fontWeight:600, color:'#1a2744'}}>{item.title}</div>
                    <div style={{fontSize:'13px', color:'#6b7280'}}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{marginTop:'20px', paddingTop:'16px', borderTop:'1px solid #e5e7eb'}}>
              <p style={{fontSize:'13px', color:'#6b7280', margin:'0 0 8px'}}>Need immediate help?</p>
              <a href="tel:18007824769" style={{fontSize:'14px', fontWeight:600, color:'#1a2744', textDecoration:'none'}}>
                📞 Call (800) SUB-HROY
              </a>
            </div>
          </div>
        </div>
    </>
  )
}
