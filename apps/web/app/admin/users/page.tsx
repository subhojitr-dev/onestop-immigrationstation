import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import UserRoleChanger from './UserRoleChanger'

const roleColors: Record<string,{bg:string;color:string}> = {
  beneficiary: { bg:'#eef0f4', color:'#566173' },
  sponsor:     { bg:'#fdf3e3', color:'#b45309' },
  contact:     { bg:'#e8effe', color:'#1d4ed8' },
  lawyer:      { bg:'#f1ecfe', color:'#6d28d9' },
  admin:       { bg:'#fdeceb', color:'#b42318' },
}

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Admin client bypasses RLS — reads ALL users' data
  const admin = createAdminClient()

  const { data: users } = await admin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const roleCount = users?.reduce((acc: Record<string,number>, u) => { acc[u.role] = (acc[u.role]||0)+1; return acc }, {} as Record<string,number>) ?? {}

  return (
    <div style={{padding:'32px'}}>
      <div style={{marginBottom:'28px', display:'flex', alignItems:'flex-start', justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontFamily:'Lora, serif', fontSize:'28px', color:'#1a2744', margin:'0 0 6px'}}>Users</h1>
          <p style={{color:'#586176', fontSize:'15px', margin:0}}>All registered users — {users?.length ?? 0} total</p>
        </div>
        <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
          {Object.entries(roleCount).map(([role, count]) => {
            const c = roleColors[role] || roleColors.beneficiary
            return <span key={role} style={{background:c.bg, color:c.color, borderRadius:'20px', padding:'5px 13px', fontSize:'12px', fontWeight:600, textTransform:'capitalize'}}>{role} ({count})</span>
          })}
        </div>
      </div>

      <div style={{background:'#fff', borderRadius:'16px', border:'1px solid #e7e9f0', overflow:'hidden', boxShadow:'0 1px 2px rgba(17,27,49,.04)'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
          <thead>
            <tr style={{background:'#f5f6fa'}}>
              {['Name','Email','Role','Phone','Joined','Change Role'].map(h => (
                <th key={h} style={{textAlign:'left', padding:'11px 16px', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#98a0b0', borderBottom:'1px solid #e7e9f0'}}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.map(u => {
              const rc = roleColors[u.role] || roleColors.beneficiary
              return (
                <tr key={u.id} style={{borderBottom:'1px solid #eef1f7'}}>
                  <td style={{padding:'13px 16px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <div style={{width:34, height:34, borderRadius:'50%', background:'linear-gradient(150deg,#243355,#16223d)', border:'1px solid rgba(184,149,42,.3)', display:'grid', placeItems:'center', fontFamily:'Lora, serif', fontSize:'13px', fontWeight:700, color:'#cfa94a', flexShrink:0}}>
                        {u.full_name?.charAt(0)?.toUpperCase() || u.email?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <span style={{fontWeight:600, color:'#1a2744'}}>{u.full_name || '—'}</span>
                    </div>
                  </td>
                  <td style={{padding:'13px 16px', color:'#586176'}}>{u.email}</td>
                  <td style={{padding:'13px 16px'}}>
                    <span style={{background:rc.bg, color:rc.color, borderRadius:'20px', padding:'3px 10px', fontSize:'12px', fontWeight:600, textTransform:'capitalize'}}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{padding:'13px 16px', color:'#586176'}}>{u.phone || '—'}</td>
                  <td style={{padding:'13px 16px', color:'#98a0b0', fontSize:'13px'}}>
                    {new Date(u.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}
                  </td>
                  <td style={{padding:'13px 16px'}}>
                    <UserRoleChanger userId={u.id} currentRole={u.role} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(!users || users.length === 0) && (
          <div style={{textAlign:'center', padding:'40px', color:'#98a0b0'}}>No users found</div>
        )}
      </div>
    </div>
  )
}
