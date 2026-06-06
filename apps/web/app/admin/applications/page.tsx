import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const statusColors: Record<string, {bg:string;color:string;label:string}> = {
  draft:          { bg:'#eef0f4', color:'#566173', label:'Draft' },
  submitted:      { bg:'#e6f6ef', color:'#047857', label:'Submitted ●' },
  under_review:   { bg:'#fdf3e3', color:'#b45309', label:'Under Review' },
  info_requested: { bg:'#fdeceb', color:'#b42318', label:'Info Requested' },
  approved:       { bg:'#e8effe', color:'#1d4ed8', label:'Approved' },
  rejected:       { bg:'#fdeceb', color:'#b42318', label:'Rejected' },
}

const visaLabels: Record<string,string> = {
  h1b:'H-1B', l1:'L-1', green_card:'Green Card', k1:'K-1', family_petition:'Family Petition'
}

export default async function AdminApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Admin client bypasses RLS — reads ALL users' data
  const admin = createAdminClient()

  const { data: applications } = await supabase
    .from('applications')
    .select('*, profiles(full_name, email, phone)')
    .order('submitted_at', { ascending: false })
    .order('created_at', { ascending: false })

  const submitted = applications?.filter(a => a.status === 'submitted') ?? []
  const inReview  = applications?.filter(a => a.status === 'under_review') ?? []
  const others    = applications?.filter(a => !['submitted','under_review'].includes(a.status)) ?? []

  function AppRow({ app }: { app: any }) {
    const s = statusColors[app.status] || statusColors.draft
    const profile = app.profiles as any
    return (
      <Link href={`/admin/applications/${app.id}`} style={{textDecoration:'none'}}>
        <div style={{display:'flex', alignItems:'center', gap:'16px', padding:'14px 20px', borderBottom:'1px solid #eef1f7', transition:'background .14s', cursor:'pointer'}} className="admin-row">
          <div style={{background:'linear-gradient(150deg,#243355,#16223d)', color:'#cfa94a', border:'1px solid rgba(184,149,42,.3)', borderRadius:'6px', padding:'4px 10px', fontSize:'12px', fontWeight:700, fontFamily:'monospace', flexShrink:0}}>
            {visaLabels[app.visa_type] || app.visa_type}
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:'14px', fontWeight:600, color:'#1a2744', marginBottom:'2px'}}>
              {profile?.full_name || profile?.email || 'Unknown User'}
            </div>
            <div style={{fontSize:'12px', color:'#98a0b0'}}>
              {profile?.email} · Sections: {app.completed_sections?.length ?? 0}/{6}
            </div>
          </div>
          <div style={{fontSize:'12px', color:'#98a0b0', flexShrink:0, textAlign:'right'}}>
            {app.submitted_at
              ? new Date(app.submitted_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})
              : `Updated ${new Date(app.updated_at).toLocaleDateString('en-US', {month:'short', day:'numeric'})}`}
          </div>
          <span style={{background:s.bg, color:s.color, borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:600, flexShrink:0}}>
            {s.label}
          </span>
          <span style={{color:'#98a0b0', fontSize:'13px', flexShrink:0}}>→</span>
        </div>
      </Link>
    )
  }

  return (
    <div style={{padding:'32px'}}>
      <div style={{marginBottom:'28px', display:'flex', alignItems:'flex-start', justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontFamily:'Lora, serif', fontSize:'28px', color:'#1a2744', margin:'0 0 6px'}}>Applications</h1>
          <p style={{color:'#586176', fontSize:'15px', margin:0}}>Review and process client intake questionnaires</p>
        </div>
        <div style={{display:'flex', gap:'10px'}}>
          {[
            { label: `${submitted.length} New`, color: '#047857', bg:'#e6f6ef' },
            { label: `${inReview.length} In Review`, color:'#b45309', bg:'#fdf3e3' },
            { label: `${applications?.length ?? 0} Total`, color:'#566173', bg:'#eef0f4' },
          ].map((chip, i) => (
            <span key={i} style={{background:chip.bg, color:chip.color, borderRadius:'20px', padding:'6px 14px', fontSize:'13px', fontWeight:600}}>
              {chip.label}
            </span>
          ))}
        </div>
      </div>

      {/* New submissions — action required */}
      {submitted.length > 0 && (
        <div style={{background:'#fff', borderRadius:'16px', border:'2px solid #047857', boxShadow:'0 0 0 4px #e6f6ef', marginBottom:'20px', overflow:'hidden'}}>
          <div style={{padding:'16px 20px', background:'#e6f6ef', display:'flex', alignItems:'center', gap:'10px'}}>
            <span style={{fontSize:'16px'}}>🔔</span>
            <span style={{fontSize:'14px', fontWeight:700, color:'#047857'}}>New Submissions — Action Required ({submitted.length})</span>
          </div>
          {submitted.map(app => <AppRow key={app.id} app={app} />)}
        </div>
      )}

      {/* Under Review */}
      {inReview.length > 0 && (
        <div style={{background:'#fff', borderRadius:'16px', border:'1px solid #e7e9f0', marginBottom:'20px', overflow:'hidden'}}>
          <div style={{padding:'14px 20px', borderBottom:'1px solid #eef1f7'}}>
            <span style={{fontSize:'14px', fontWeight:700, color:'#b45309'}}>Under Review ({inReview.length})</span>
          </div>
          {inReview.map(app => <AppRow key={app.id} app={app} />)}
        </div>
      )}

      {/* All others */}
      {others.length > 0 && (
        <div style={{background:'#fff', borderRadius:'16px', border:'1px solid #e7e9f0', overflow:'hidden'}}>
          <div style={{padding:'14px 20px', borderBottom:'1px solid #eef1f7'}}>
            <span style={{fontSize:'14px', fontWeight:700, color:'#586176'}}>All Other Applications ({others.length})</span>
          </div>
          {others.map(app => <AppRow key={app.id} app={app} />)}
        </div>
      )}

      {(!applications || applications.length === 0) && (
        <div style={{textAlign:'center', padding:'60px 20px', color:'#98a0b0'}}>
          <div style={{fontSize:'48px', marginBottom:'16px'}}>📋</div>
          <div style={{fontSize:'18px', fontFamily:'Lora, serif', color:'#1a2744', marginBottom:'8px'}}>No applications yet</div>
          <div style={{fontSize:'14px'}}>Applications submitted by clients will appear here</div>
        </div>
      )}
    </div>
  )
}
