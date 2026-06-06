'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  apptId: string
  currentStatus: string
  statusColors: Record<string,{bg:string;color:string}>
}

export default function AppointmentStatusUpdater({ apptId, currentStatus, statusColors }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  async function handleChange(newStatus: string) {
    setStatus(newStatus)
    setSaving(true)
    // Use admin API route — regular client blocked by RLS on other users' appointments
    await fetch('/api/admin/update-appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apptId, status: newStatus }),
    })
    setSaving(false)
    router.refresh()
  }

  const s = statusColors[status] || statusColors.pending
  return (
    <div style={{flexShrink:0, display:'flex', alignItems:'center', gap:'8px'}}>
      {saving && <span style={{fontSize:'12px', color:'#98a0b0'}}>Saving…</span>}
      <select
        value={status}
        onChange={e => handleChange(e.target.value)}
        style={{padding:'6px 10px', border:'1.5px solid', borderColor: s.color, borderRadius:'8px', background:s.bg, color:s.color, fontSize:'12px', fontWeight:600, cursor:'pointer', outline:'none'}}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
        <option value="no_show">No Show</option>
      </select>
    </div>
  )
}
