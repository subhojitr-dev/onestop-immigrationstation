'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  apptId: string
  currentStatus: string
  currentLocation?: string | null
  currentMeetingLink?: string | null
  statusColors: Record<string,{bg:string;color:string}>
}

export default function AppointmentStatusUpdater({ apptId, currentStatus, currentLocation, currentMeetingLink, statusColors }: Props) {
  const router = useRouter()
  const [status,      setStatus]      = useState(currentStatus)
  const [location,    setLocation]    = useState(currentLocation || '')
  const [meetingLink, setMeetingLink] = useState(currentMeetingLink || '')
  const [showDetails, setShowDetails] = useState(false)
  const [saving,      setSaving]      = useState(false)

  async function handleChange(newStatus: string) {
    setStatus(newStatus)
    if (newStatus === 'confirmed') setShowDetails(true)
    else { setShowDetails(false); await save(newStatus, location, meetingLink) }
  }

  async function save(s: string, loc: string, link: string) {
    setSaving(true)
    await fetch('/api/admin/update-appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apptId, status: s, location: loc || null, meeting_link: link || null }),
    })
    setSaving(false)
    router.refresh()
  }

  const s = statusColors[status] || statusColors.pending
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '6px 10px', border: '1.5px solid #e7e9f0',
    borderRadius: '7px', fontSize: '12px', fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', marginTop: '4px',
  }

  return (
    <div style={{flexShrink:0, minWidth:'180px'}}>
      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
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

      {/* Location + meeting link — shown when confirming */}
      {showDetails && (
        <div style={{marginTop:'10px', background:'#f8f9ff', borderRadius:'9px', padding:'10px', border:'1px solid #e0e7ff'}}>
          <div style={{fontSize:'11px', fontWeight:700, color:'#586176', marginBottom:'6px'}}>Confirmation Details</div>
          <div style={{marginBottom:'6px'}}>
            <label style={{fontSize:'11px', color:'#586176'}}>Location / Format</label>
            <select value={location} onChange={e => setLocation(e.target.value)} style={inputStyle}>
              <option value="">Select…</option>
              <option value="Office Visit">Office Visit</option>
              <option value="Phone Call">Phone Call</option>
              <option value="Zoom">Zoom</option>
              <option value="Google Meet">Google Meet</option>
              <option value="Microsoft Teams">Microsoft Teams</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{marginBottom:'8px'}}>
            <label style={{fontSize:'11px', color:'#586176'}}>Meeting Link (optional)</label>
            <input
              type="url"
              value={meetingLink}
              onChange={e => setMeetingLink(e.target.value)}
              placeholder="https://zoom.us/j/..."
              style={inputStyle}
            />
          </div>
          <button
            onClick={() => save(status, location, meetingLink)}
            style={{width:'100%', padding:'7px', borderRadius:'7px', border:'none', background:'linear-gradient(135deg,#1a2744,#243355)', color:'#fff', fontSize:'12px', fontWeight:700, cursor:'pointer'}}>
            Confirm & Notify Client
          </button>
        </div>
      )}

      {/* Show existing location/link if already set */}
      {!showDetails && (currentLocation || currentMeetingLink) && (
        <div style={{marginTop:'6px', fontSize:'11px', color:'#586176'}}>
          {currentLocation && <div>📍 {currentLocation}</div>}
          {currentMeetingLink && <a href={currentMeetingLink} target="_blank" rel="noreferrer" style={{color:'#b8952a', textDecoration:'none'}}>🔗 Meeting Link</a>}
        </div>
      )}
    </div>
  )
}
