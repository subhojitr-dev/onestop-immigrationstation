import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { questionnaires } from '@/lib/questionnaire'
import ApplicationActions from './ApplicationActions'
import DownloadPdf from './DownloadPdf'

const visaLabels: Record<string,string> = {
  h1b:'H-1B', l1:'L-1', green_card:'Green Card', k1:'K-1', family_petition:'Family Petition'
}

export default async function AdminApplicationDetailPage({ params }: { params: Promise<{id: string}> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Admin client bypasses RLS — reads any user's application
  const admin = createAdminClient()
  const { data: app } = await admin
    .from('applications')
    .select('*')
    .eq('id', id)
    .single()

  if (!app) notFound()

  // Fetch profile separately (join fails with service role client)
  const { data: profileData } = await admin
    .from('profiles')
    .select('full_name, email, phone, role')
    .eq('id', app.user_id)
    .single()

  const q = questionnaires[app.visa_type]
  const profile = profileData as any
  const answers = app.data as Record<string, any>

  const statusColors: Record<string, {bg:string;color:string;label:string}> = {
    draft:          { bg:'#eef0f4', color:'#566173', label:'Draft' },
    submitted:      { bg:'#e6f6ef', color:'#047857', label:'Submitted' },
    under_review:   { bg:'#fdf3e3', color:'#b45309', label:'Under Review' },
    info_requested: { bg:'#fdeceb', color:'#b42318', label:'Info Requested' },
    approved:       { bg:'#e8effe', color:'#1d4ed8', label:'Approved' },
    rejected:       { bg:'#fdeceb', color:'#b42318', label:'Rejected' },
  }
  const s = statusColors[app.status] || statusColors.draft

  function formatAnswer(value: any): string {
    if (value === true || value === 'true') return '✓ Yes'
    if (value === false || value === 'false') return '✗ No'
    if (typeof value === 'string' && value.length > 0) return value
    if (Array.isArray(value)) return value.join(', ')
    return '—'
  }

  return (
    <div style={{padding:'32px'}}>
      {/* Breadcrumb */}
      <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#98a0b0', marginBottom:'20px'}}>
        <Link href="/admin/applications" style={{color:'#586176', textDecoration:'none', fontWeight:500}}>Applications</Link>
        <span>›</span>
        <span style={{color:'#1a2744', fontWeight:600}}>{profile?.full_name || profile?.email}</span>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 300px', gap:'24px', alignItems:'start'}}>

        {/* ── LEFT: Application answers ── */}
        <div>
          {/* Header */}
          <div style={{background:'#fff', borderRadius:'16px', padding:'24px', border:'1px solid #e7e9f0', boxShadow:'0 1px 2px rgba(17,27,49,.04)', marginBottom:'20px'}}>
            <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px', marginBottom:'16px'}}>
              <div>
                <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px'}}>
                  <span style={{background:'linear-gradient(150deg,#243355,#16223d)', color:'#cfa94a', border:'1px solid rgba(184,149,42,.3)', borderRadius:'6px', padding:'4px 10px', fontSize:'13px', fontWeight:700, fontFamily:'monospace'}}>
                    {visaLabels[app.visa_type]}
                  </span>
                  <span style={{background:s.bg, color:s.color, borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:600}}>
                    {s.label}
                  </span>
                </div>
                <h1 style={{fontFamily:'Lora, serif', fontSize:'22px', color:'#1a2744', margin:'0 0 4px'}}>
                  {profile?.full_name || 'Unknown Applicant'}
                </h1>
                <div style={{fontSize:'13px', color:'#586176'}}>
                  {profile?.email} {profile?.phone && `· ${profile.phone}`}
                </div>
              </div>
            </div>
            <div style={{display:'flex', gap:'20px', fontSize:'13px', color:'#98a0b0', paddingTop:'14px', borderTop:'1px solid #eef1f7'}}>
              <span><strong style={{color:'#586176'}}>Submitted:</strong> {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit'}) : 'Not submitted'}</span>
              <span><strong style={{color:'#586176'}}>Sections:</strong> {app.completed_sections?.length ?? 0} / {q?.sections.length ?? 6} complete</span>
              <span><strong style={{color:'#586176'}}>ID:</strong> {app.id.slice(0,8)}</span>
            </div>
          </div>

          {/* Answers by section */}
          {q?.sections.map(section => {
            const sectionAnswers = section.fields.filter(f =>
              f.type !== 'heading' && f.type !== 'info' && answers[f.id] !== undefined && answers[f.id] !== '' && answers[f.id] !== false
            )
            if (sectionAnswers.length === 0) return null
            return (
              <div key={section.id} style={{background:'#fff', borderRadius:'16px', padding:'24px', border:'1px solid #e7e9f0', boxShadow:'0 1px 2px rgba(17,27,49,.04)', marginBottom:'16px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px', paddingBottom:'14px', borderBottom:'1px solid #eef1f7'}}>
                  <span style={{fontSize:'20px'}}>{section.icon}</span>
                  <h2 style={{fontFamily:'Lora, serif', fontSize:'17px', color:'#1a2744', margin:0}}>{section.title}</h2>
                  <span style={{marginLeft:'auto', background: app.completed_sections?.includes(section.id) ? '#e6f6ef' : '#eef0f4', color: app.completed_sections?.includes(section.id) ? '#047857' : '#566173', borderRadius:'20px', padding:'2px 10px', fontSize:'11px', fontWeight:600}}>
                    {app.completed_sections?.includes(section.id) ? '✓ Complete' : 'Incomplete'}
                  </span>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px'}}>
                  {section.fields
                    .filter(f => f.type !== 'heading' && f.type !== 'info')
                    .map(field => {
                      const val = answers[field.id]
                      if (val === undefined || val === '' || val === false) return null
                      return (
                        <div key={field.id} style={{padding:'10px 14px', background:'#f5f6fa', borderRadius:'10px'}}>
                          <div style={{fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#98a0b0', marginBottom:'4px'}}>
                            {field.label}
                            {field.uscisRef && <span style={{marginLeft:'6px', fontWeight:400, fontStyle:'italic', textTransform:'none', letterSpacing:'normal'}}>{field.uscisRef}</span>}
                          </div>
                          <div style={{fontSize:'14px', color:'#1a2744', fontWeight:500, wordBreak:'break-word', whiteSpace:'pre-wrap'}}>
                            {formatAnswer(val)}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )
          })}

          {!q && (
            <div style={{background:'#fff', borderRadius:'16px', padding:'24px', border:'1px solid #e7e9f0'}}>
              <pre style={{fontSize:'13px', color:'#586176', whiteSpace:'pre-wrap', wordBreak:'break-word'}}>
                {JSON.stringify(answers, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* ── RIGHT: Actions panel ── */}
        <div style={{position:'sticky', top:'20px'}}>
          <ApplicationActions
            appId={app.id}
            currentStatus={app.status}
            lawyerNotes={app.lawyer_notes || ''}
            visaType={app.visa_type}
            clientUserId={app.user_id}
            clientName={profile?.full_name || profile?.email || 'Client'}
            existingCaseId={app.case_id ?? null}
          />
          <DownloadPdf
            application={{ id: app.id, visa_type: app.visa_type, status: app.status, submitted_at: app.submitted_at, data: app.data, profiles: profile }}
            questionnaire={q || null}
          />

          {/* Quick links */}
          <div style={{background:'#fff', borderRadius:'16px', padding:'20px', border:'1px solid #e7e9f0', boxShadow:'0 1px 2px rgba(17,27,49,.04)'}}>
            <div style={{fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#98a0b0', marginBottom:'12px'}}>Quick Actions</div>
            <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
              <Link href={`/dashboard/tickets/new`} style={{display:'flex', alignItems:'center', gap:'8px', padding:'10px 13px', background:'#f5f6fa', borderRadius:'10px', textDecoration:'none', fontSize:'13px', color:'#1a2744', fontWeight:500}}>
                <span>💬</span> Message Client
              </Link>
              <Link href="/admin/cases" style={{display:'flex', alignItems:'center', gap:'8px', padding:'10px 13px', background:'#f5f6fa', borderRadius:'10px', textDecoration:'none', fontSize:'13px', color:'#1a2744', fontWeight:500}}>
                <span>📁</span> Open a Case for Client
              </Link>
              <Link href="/admin/applications" style={{display:'flex', alignItems:'center', gap:'8px', padding:'10px 13px', background:'#f5f6fa', borderRadius:'10px', textDecoration:'none', fontSize:'13px', color:'#1a2744', fontWeight:500}}>
                <span>←</span> Back to All Applications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
