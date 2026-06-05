import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppointmentStatusUpdater from './AppointmentStatusUpdater'

export default async function AdminAppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, profiles(full_name, email)')
    .order('date', { ascending: true })

  const upcoming = appointments?.filter(a => new Date(a.date) >= new Date()) ?? []
  const past     = appointments?.filter(a => new Date(a.date) < new Date()) ?? []

  const statusColors: Record<string,{bg:string;color:string}> = {
    pending:   { bg:'#fdf3e3', color:'#b45309' },
    confirmed: { bg:'#e6f6ef', color:'#047857' },
    cancelled: { bg:'#fdeceb', color:'#b42318' },
    completed: { bg:'#eef0f4', color:'#566173' },
    no_show:   { bg:'#fdeceb', color:'#b42318' },
  }

  function AppointmentRow({ appt }: { appt: any }) {
    const s = statusColors[appt.status] || statusColors.pending
    const profile = appt.profiles as any
    const d = new Date(appt.date)
    return (
      <div style={{display:'flex', alignItems:'center', gap:'14px', padding:'14px 20px', borderBottom:'1px solid #eef1f7'}}>
        {/* Date box */}
        <div style={{width:54, flexShrink:0, borderRadius:'10px', overflow:'hidden', textAlign:'center', background:'linear-gradient(150deg,#243355,#16223d)', border:'1px solid rgba(184,149,42,.25)'}}>
          <div style={{height:'4px', background:'linear-gradient(135deg,#cfa94a,#b8952a)'}} />
          <div style={{fontFamily:'Lora, serif', fontSize:'20px', fontWeight:700, color:'#cfa94a', lineHeight:1, padding:'6px 0 2px'}}>{d.getDate()}</div>
          <div style={{fontSize:'10px', textTransform:'uppercase', letterSpacing:'.1em', color:'#fff', fontWeight:600}}>{d.toLocaleDateString('en-US', {month:'short'})}</div>
          <div style={{fontSize:'10px', color:'rgba(255,255,255,.5)', paddingBottom:'6px'}}>{d.getFullYear()}</div>
        </div>
        {/* Info */}
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:'14px', fontWeight:600, color:'#1a2744', marginBottom:'2px'}}>
            {profile?.full_name || profile?.email}
          </div>
          <div style={{fontSize:'13px', color:'#586176'}}>
            {appt.time_slot}
            {appt.is_free && <span style={{marginLeft:'8px', background:'#f7efd9', color:'#8a6d12', borderRadius:'20px', padding:'1px 8px', fontSize:'11px', fontWeight:600}}>Free Consultation #{appt.free_session_number}</span>}
          </div>
          {appt.notes && <div style={{fontSize:'12px', color:'#98a0b0', marginTop:'2px'}}>{appt.notes}</div>}
        </div>
        {/* Status updater */}
        <AppointmentStatusUpdater apptId={appt.id} currentStatus={appt.status} statusColors={statusColors} />
      </div>
    )
  }

  return (
    <div style={{padding:'32px'}}>
      <div style={{marginBottom:'28px'}}>
        <h1 style={{fontFamily:'Lora, serif', fontSize:'28px', color:'#1a2744', margin:'0 0 6px'}}>Appointments</h1>
        <p style={{color:'#586176', fontSize:'15px', margin:0}}>Confirm, cancel, or mark appointments as completed</p>
      </div>

      {/* Pending alert */}
      {upcoming.filter(a => a.status === 'pending').length > 0 && (
        <div style={{background:'#fdf3e3', border:'1px solid #fde68a', borderRadius:'12px', padding:'14px 18px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'#b45309'}}>
          ⚠️ <strong>{upcoming.filter(a => a.status === 'pending').length} appointment{upcoming.filter(a => a.status === 'pending').length > 1 ? 's' : ''}</strong> waiting for confirmation
        </div>
      )}

      {/* Upcoming */}
      <div style={{background:'#fff', borderRadius:'16px', border:'1px solid #e7e9f0', overflow:'hidden', boxShadow:'0 1px 2px rgba(17,27,49,.04)', marginBottom:'20px'}}>
        <div style={{padding:'14px 20px', borderBottom:'1px solid #eef1f7', fontFamily:'Lora, serif', fontSize:'16px', fontWeight:600, color:'#1a2744'}}>
          Upcoming ({upcoming.length})
        </div>
        {upcoming.length > 0 ? upcoming.map(a => <AppointmentRow key={a.id} appt={a} />) : (
          <div style={{textAlign:'center', padding:'30px', color:'#98a0b0', fontSize:'14px'}}>No upcoming appointments</div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div style={{background:'#fff', borderRadius:'16px', border:'1px solid #e7e9f0', overflow:'hidden', boxShadow:'0 1px 2px rgba(17,27,49,.04)'}}>
          <div style={{padding:'14px 20px', borderBottom:'1px solid #eef1f7', fontFamily:'Lora, serif', fontSize:'16px', fontWeight:600, color:'#586176'}}>
            Past ({past.length})
          </div>
          {past.map(a => <AppointmentRow key={a.id} appt={a} />)}
        </div>
      )}
    </div>
  )
}
