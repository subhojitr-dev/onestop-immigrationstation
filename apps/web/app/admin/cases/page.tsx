import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NewCaseForm from './NewCaseForm'

const statusColors: Record<string,{bg:string;color:string;label:string}> = {
  open:               { bg:'#e8effe', color:'#1d4ed8', label:'Open' },
  in_progress:        { bg:'#fdf3e3', color:'#b45309', label:'In Progress' },
  pending_documents:  { bg:'#fdeceb', color:'#b42318', label:'Pending Docs' },
  submitted:          { bg:'#f1ecfe', color:'#6d28d9', label:'Submitted' },
  approved:           { bg:'#e6f6ef', color:'#047857', label:'Approved' },
  denied:             { bg:'#fdeceb', color:'#b42318', label:'Denied' },
  closed:             { bg:'#eef0f4', color:'#566173', label:'Closed' },
}

export default async function AdminCasesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: callerProfile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()

  // Admin client bypasses RLS — reads ALL users' data
  const admin = createAdminClient()

  const { data: cases } = await admin
    .from('cases')
    .select('*, profiles!cases_user_id_fkey(full_name, email)')
    .order('opened_date', { ascending: false })

  // Fetch all clients (non-lawyer/admin) for the New Case form
  const { data: clients } = await admin
    .from('profiles')
    .select('id, full_name, email')
    .in('role', ['beneficiary', 'sponsor', 'contact'])
    .order('full_name')

  return (
    <div style={{padding:'32px'}}>
      <div style={{marginBottom:'24px', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'16px'}}>
        <div>
          <h1 style={{fontFamily:'Lora, serif', fontSize:'28px', color:'#1a2744', margin:'0 0 6px'}}>Cases</h1>
          <p style={{color:'#586176', fontSize:'15px', margin:0}}>All immigration cases — {cases?.length ?? 0} total</p>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap'}}>
          <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
            {Object.entries(statusColors).map(([key, val]) => {
              const count = cases?.filter(c => c.status === key).length ?? 0
              if (!count) return null
              return <span key={key} style={{background:val.bg, color:val.color, borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:600}}>{val.label} ({count})</span>
            })}
          </div>
          <NewCaseForm clients={clients ?? []} lawyerName={callerProfile?.full_name || ''} />
        </div>
      </div>

      <div style={{background:'#fff', borderRadius:'16px', border:'1px solid #e7e9f0', overflow:'hidden', boxShadow:'0 1px 2px rgba(17,27,49,.04)'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
          <thead>
            <tr style={{background:'#f5f6fa'}}>
              {['Case #','Visa','Client','Attorney','Status','Opened'].map(h => (
                <th key={h} style={{textAlign:'left', padding:'11px 16px', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#98a0b0', borderBottom:'1px solid #e7e9f0'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cases?.map(c => {
              const s = statusColors[c.status] || statusColors.open
              const profile = c.profiles as any
              return (
                <tr key={c.id} style={{borderBottom:'1px solid #eef1f7'}}>
                  <td style={{padding:'13px 16px'}}>
                    <Link href={`/admin/cases/${c.id}`} style={{fontFamily:'monospace', fontWeight:700, color:'#1a2744', textDecoration:'none', fontSize:'13px'}}>
                      {c.case_number}
                    </Link>
                  </td>
                  <td style={{padding:'13px 16px'}}>
                    <span style={{background:'linear-gradient(150deg,#243355,#16223d)', color:'#cfa94a', border:'1px solid rgba(184,149,42,.3)', borderRadius:'5px', padding:'3px 8px', fontSize:'11px', fontWeight:700, fontFamily:'monospace'}}>
                      {c.visa_type}
                    </span>
                  </td>
                  <td style={{padding:'13px 16px'}}>
                    <div style={{fontSize:'14px', fontWeight:500, color:'#1a2744'}}>{profile?.full_name || '—'}</div>
                    <div style={{fontSize:'12px', color:'#98a0b0'}}>{profile?.email}</div>
                  </td>
                  <td style={{padding:'13px 16px', color:'#586176'}}>{c.assigned_attorney || '—'}</td>
                  <td style={{padding:'13px 16px'}}>
                    <span style={{background:s.bg, color:s.color, borderRadius:'20px', padding:'3px 10px', fontSize:'12px', fontWeight:600}}>
                      {s.label}
                    </span>
                  </td>
                  <td style={{padding:'13px 16px', color:'#98a0b0', fontSize:'13px'}}>
                    {new Date(c.opened_date).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(!cases || cases.length === 0) && (
          <div style={{textAlign:'center', padding:'40px', color:'#98a0b0', fontSize:'14px'}}>
            No cases yet — use "+ New Case" to create one, or open a case from an application.
          </div>
        )}
      </div>
    </div>
  )
}
