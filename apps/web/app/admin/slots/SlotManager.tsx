/**
 * app/admin/slots/SlotManager.tsx
 *
 * Client component — the interactive slot management UI.
 * Lawyers add slots one at a time or bulk-add a full week of slots at once.
 */
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const TIME_OPTIONS = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM',
  '3:30 PM','4:00 PM','4:30 PM','5:00 PM',
]

interface Slot {
  id: string
  slot_date: string
  slot_time: string
  is_booked: boolean
  booked_profile?: { full_name: string; email: string } | null
}

interface Props {
  slots: Slot[]
  lawyerId: string
}

export default function SlotManager({ slots, lawyerId }: Props) {
  const router = useRouter()

  // Add single slot
  const [date, setDate]       = useState('')
  const [time, setTime]       = useState('9:00 AM')
  const [adding, setAdding]   = useState(false)
  const [addError, setAddError] = useState('')

  // Bulk add: pick a start date + which times + Mon-Fri for N weeks
  const [bulkDate, setBulkDate] = useState('')
  const [bulkTimes, setBulkTimes] = useState<string[]>(['10:00 AM', '2:00 PM'])
  const [bulkWeeks, setBulkWeeks] = useState(2)
  const [bulkAdding, setBulkAdding] = useState(false)

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault()
    if (!date) { setAddError('Select a date'); return }
    setAdding(true)
    setAddError('')
    const supabase = createClient()
    const { error } = await supabase.from('consultation_slots').insert({
      lawyer_id: lawyerId, slot_date: date, slot_time: time, is_booked: false,
    })
    if (error) setAddError(error.message)
    setAdding(false)
    if (!error) router.refresh()
  }

  async function handleBulkAdd() {
    if (!bulkDate || bulkTimes.length === 0) return
    setBulkAdding(true)
    const supabase = createClient()
    const rows: any[] = []
    const start = new Date(bulkDate + 'T12:00:00')
    for (let w = 0; w < bulkWeeks; w++) {
      for (let d = 0; d < 5; d++) { // Mon–Fri
        const day = new Date(start)
        const dayOfWeek = start.getDay() // 0=Sun
        // Advance to Monday of the week
        const mondayOffset = (1 - dayOfWeek + 7) % 7
        day.setDate(start.getDate() + w * 7 + mondayOffset + d)
        const isoDate = day.toISOString().split('T')[0]
        for (const t of bulkTimes) {
          rows.push({ lawyer_id: lawyerId, slot_date: isoDate, slot_time: t, is_booked: false })
        }
      }
    }
    await supabase.from('consultation_slots').insert(rows)
    setBulkAdding(false)
    router.refresh()
  }

  async function handleDelete(slotId: string) {
    const supabase = createClient()
    await supabase.from('consultation_slots').delete().eq('id', slotId)
    router.refresh()
  }

  function toggleBulkTime(t: string) {
    setBulkTimes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  // Group slots by date for display
  const grouped: Record<string, Slot[]> = {}
  for (const s of slots) {
    if (!grouped[s.slot_date]) grouped[s.slot_date] = []
    grouped[s.slot_date].push(s)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1.5px solid #e7e9f0',
    borderRadius: '9px', fontFamily: 'inherit', fontSize: '14px', color: '#16203a',
    outline: 'none', background: '#fff', boxSizing: 'border-box',
  }
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>

      {/* ── Left: Add slots ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Single slot */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', border: '1px solid #e7e9f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#98a0b0', marginBottom: '14px' }}>
            Add Single Slot
          </div>
          <form onSubmit={handleAddSlot}>
            {addError && <div style={{ background: '#fdeceb', color: '#b42318', borderRadius: '7px', padding: '8px 12px', marginBottom: '10px', fontSize: '13px' }}>{addError}</div>}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#586176', marginBottom: '5px' }}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} min={minDate} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#586176', marginBottom: '5px' }}>Time</label>
              <select value={time} onChange={e => setTime(e.target.value)} style={inputStyle}>
                {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button type="submit" disabled={adding}
              style={{ width: '100%', padding: '10px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg,#cfa94a,#b8952a)', color: '#0b1322', fontSize: '13px', fontWeight: 700, cursor: adding ? 'not-allowed' : 'pointer' }}>
              {adding ? 'Adding…' : '+ Add Slot'}
            </button>
          </form>
        </div>

        {/* Bulk add */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', border: '1px solid #e7e9f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#98a0b0', marginBottom: '14px' }}>
            Bulk Add (Mon–Fri)
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#586176', marginBottom: '5px' }}>Starting week of</label>
            <input type="date" value={bulkDate} onChange={e => setBulkDate(e.target.value)} min={minDate} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#586176', marginBottom: '5px' }}>How many weeks?</label>
            <select value={bulkWeeks} onChange={e => setBulkWeeks(Number(e.target.value))} style={inputStyle}>
              {[1,2,3,4].map(n => <option key={n} value={n}>{n} week{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#586176', marginBottom: '8px' }}>Times to add each day</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              {TIME_OPTIONS.map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', padding: '5px 8px', borderRadius: '7px', background: bulkTimes.includes(t) ? '#f0f4ff' : '#f9fafb', border: '1px solid', borderColor: bulkTimes.includes(t) ? '#1a2744' : '#e7e9f0' }}>
                  <input type="checkbox" checked={bulkTimes.includes(t)} onChange={() => toggleBulkTime(t)} style={{ accentColor: '#1a2744' }} />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <button onClick={handleBulkAdd} disabled={bulkAdding || !bulkDate || bulkTimes.length === 0}
            style={{ width: '100%', padding: '10px', borderRadius: '9px', border: 'none', background: (bulkDate && bulkTimes.length > 0) ? 'linear-gradient(150deg,#243355,#16223d)' : '#eef0f4', color: (bulkDate && bulkTimes.length > 0) ? '#fff' : '#98a0b0', fontSize: '13px', fontWeight: 700, cursor: (bulkAdding || !bulkDate || bulkTimes.length === 0) ? 'not-allowed' : 'pointer' }}>
            {bulkAdding ? 'Adding…' : `Add ${bulkWeeks * 5 * bulkTimes.length} slots`}
          </button>
        </div>
      </div>

      {/* ── Right: Slot calendar ── */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e7e9f0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #e7e9f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a2744' }}>Upcoming Slots</div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e6f6ef', border: '1.5px solid #047857', display: 'inline-block' }} />
              Available
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#fdf3e3', border: '1.5px solid #b45309', display: 'inline-block' }} />
              Booked
            </span>
          </div>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#98a0b0' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>📅</div>
            <p style={{ fontSize: '14px' }}>No slots added yet. Use the panel on the left to add availability.</p>
          </div>
        ) : (
          <div style={{ padding: '16px 22px' }}>
            {Object.entries(grouped).map(([dateStr, daySlots]) => (
              <div key={dateStr} style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a2744', marginBottom: '8px' }}>
                  {new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 400, color: '#98a0b0' }}>
                    {daySlots.filter(s => !s.is_booked).length} available · {daySlots.filter(s => s.is_booked).length} booked
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {daySlots.map(slot => (
                    <div key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: '1.5px solid', borderColor: slot.is_booked ? '#b45309' : '#047857', background: slot.is_booked ? '#fdf3e3' : '#e6f6ef', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600, color: slot.is_booked ? '#b45309' : '#047857' }}>{slot.slot_time}</span>
                      {slot.is_booked && slot.booked_profile && (
                        <span style={{ color: '#586176', fontSize: '11px' }}>— {(slot.booked_profile as any).full_name || 'Client'}</span>
                      )}
                      {!slot.is_booked && (
                        <button onClick={() => handleDelete(slot.id)}
                          title="Remove slot"
                          style={{ marginLeft: '2px', background: 'none', border: 'none', color: '#98a0b0', cursor: 'pointer', fontSize: '13px', padding: '0 2px', lineHeight: 1 }}>
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
