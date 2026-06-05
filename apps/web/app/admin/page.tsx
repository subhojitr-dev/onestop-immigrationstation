import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch counts in parallel
  const [
    { count: totalUsers },
    { count: totalCases },
    { count: openCases },
    { count: pendingApps },
    { count: openTickets },
    { count: pendingAppts },
    { data: recentApps },
    { data: recentTickets },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('cases').select('*', { count: 'exact', head: true }),
    supabase.from('cases').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'submitted'),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('applications')
      .select('id, visa_type, status, submitted_at, profiles(full_name, email)')
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: false })
      .limit(5),
    supabase.from('tickets')
      .select('id, subject, priority, status, created_at, profiles(full_name)')
      .in('status', ['open', 'in_progress'])
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    { num: totalUsers ?? 0, label: 'Total Users', icon: '👥', href: '/admin/users', color: '#1d4ed8', bg: '#e8effe' },
    { num: openCases ?? 0, label: 'Active Cases', icon: '📁', href: '/admin/cases', color: '#b45309', bg: '#fdf3e3' },
    { num: pendingApps ?? 0, label: 'New Applications', icon: '📋', href: '/admin/applications', color: '#047857', bg: '#e6f6ef', urgent: (pendingApps ?? 0) > 0 },
    { num: openTickets ?? 0, label: 'Open Tickets', icon: '💬', href: '/admin/tickets', color: '#b42318', bg: '#fdeceb', urgent: (openTickets ?? 0) > 0 },
    { num: pendingAppts ?? 0, label: 'Pending Appointments', icon: '📅', href: '/admin/appointments', color: '#6d28d9', bg: '#f1ecfe' },
    { num: totalCases ?? 0, label: 'Total Cases', icon: '🗂️', href: '/admin/cases', color: '#566173', bg: '#eef0f4' },
  ]

  const visaLabels: Record<string, string> = { h1b:'H-1B', l1:'L-1', green_card:'Green Card', k1:'K-1', family_petition:'Family Petition' }
  const priorityColors: Record<string, string> = { low:'#566173', medium:'#b45309', high:'#b42318', urgent:'#7f1d1d' }
  const priorityBg: Record<string, string> = { low:'#eef0f4', medium:'#fdf3e3', high:'#fdeceb', urgent:'#fee2e2' }

  return (
    <div style={{padding:'32px'}}>
      {/* Header */}
      <div style={{marginBottom:'28px'}}>
        <h1 style={{fontFamily:'Lora, serif', fontSize:'28px', color:'#1a2744', margin:'0 0 6px', letterSpacing:'-.015em'}}>
          Admin Overview
        </h1>
        <p style={{color:'#586176', fontSize:'15px', margin:0}}>
          {new Date().toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric', year:'numeric'})}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'32px'}}>
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} style={{textDecoration:'none'}}>
            <div style={{
              background:'#fff', borderRadius:'16px', padding:'22px 24px',
              border: stat.urgent ? `2px solid ${stat.color}` : '1px solid #e7e9f0',
              boxShadow: stat.urgent ? `0 0 0 4px ${stat.bg}` : '0 1px 2px rgba(17,27,49,.04)',
              transition:'transform .18s, box-shadow .18s', cursor:'pointer',
            }}>
              <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px'}}>
                <div style={{width:36, height:36, borderRadius:'9px', background:stat.bg, display:'grid', placeItems:'center', fontSize:'18px'}}>
                  {stat.icon}
                </div>
                <span style={{fontSize:'13px', fontWeight:600, color:'#586176'}}>{stat.label}</span>
                {stat.urgent && <span style={{marginLeft:'auto', background:stat.color, color:'#fff', borderRadius:'20px', padding:'2px 10px', fontSize:'11px', fontWeight:700}}>Action needed</span>}
              </div>
              <div style={{fontFamily:'Lora, serif', fontSize:'36px', fontWeight:700, color: stat.urgent ? stat.color : '#1a2744', lineHeight:1}}>
                {stat.num}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
        {/* Recent submitted applications */}
        <div style={{background:'#fff', borderRadius:'16px', padding:'24px', border:'1px solid #e7e9f0', boxShadow:'0 1px 2px rgba(17,27,49,.04)'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px'}}>
            <h2 style={{fontFamily:'Lora, serif', fontSize:'17px', color:'#1a2744', margin:0}}>New Applications</h2>
            <Link href="/admin/applications" style={{fontSize:'13px', color:'#b8952a', fontWeight:600, textDecoration:'none'}}>View all →</Link>
          </div>
          {recentApps && recentApps.length > 0 ? recentApps.map((app: any) => (
            <Link key={app.id} href={`/admin/applications/${app.id}`} style={{textDecoration:'none'}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px', padding:'11px 0', borderBottom:'1px solid #eef1f7', cursor:'pointer'}}>
                <div style={{background:'linear-gradient(150deg,#243355,#16223d)', color:'#cfa94a', border:'1px solid rgba(184,149,42,.3)', borderRadius:'6px', padding:'3px 9px', fontSize:'12px', fontWeight:700, fontFamily:'monospace', flexShrink:0}}>
                  {visaLabels[app.visa_type] || app.visa_type}
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:'14px', fontWeight:600, color:'#1a2744', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                    {(app.profiles as any)?.full_name || (app.profiles as any)?.email || 'Unknown'}
                  </div>
                  <div style={{fontSize:'12px', color:'#98a0b0'}}>
                    {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-US', {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'}) : 'Draft'}
                  </div>
                </div>
                <span style={{background:'#e6f6ef', color:'#047857', borderRadius:'20px', padding:'3px 10px', fontSize:'11px', fontWeight:600, flexShrink:0}}>
                  New
                </span>
              </div>
            </Link>
          )) : (
            <div style={{textAlign:'center', padding:'24px 0', color:'#98a0b0', fontSize:'14px'}}>
              No pending applications
            </div>
          )}
        </div>

        {/* Open tickets */}
        <div style={{background:'#fff', borderRadius:'16px', padding:'24px', border:'1px solid #e7e9f0', boxShadow:'0 1px 2px rgba(17,27,49,.04)'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px'}}>
            <h2 style={{fontFamily:'Lora, serif', fontSize:'17px', color:'#1a2744', margin:0}}>Open Tickets</h2>
            <Link href="/admin/tickets" style={{fontSize:'13px', color:'#b8952a', fontWeight:600, textDecoration:'none'}}>View all →</Link>
          </div>
          {recentTickets && recentTickets.length > 0 ? recentTickets.map((ticket: any) => (
            <Link key={ticket.id} href={`/dashboard/tickets/${ticket.id}`} style={{textDecoration:'none'}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px', padding:'11px 0', borderBottom:'1px solid #eef1f7', cursor:'pointer'}}>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:'14px', fontWeight:600, color:'#1a2744', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                    {ticket.subject}
                  </div>
                  <div style={{fontSize:'12px', color:'#98a0b0'}}>
                    {(ticket.profiles as any)?.full_name} · {new Date(ticket.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric'})}
                  </div>
                </div>
                <span style={{background: priorityBg[ticket.priority] || '#eef0f4', color: priorityColors[ticket.priority] || '#566173', borderRadius:'20px', padding:'3px 10px', fontSize:'11px', fontWeight:600, flexShrink:0, textTransform:'capitalize'}}>
                  {ticket.priority}
                </span>
              </div>
            </Link>
          )) : (
            <div style={{textAlign:'center', padding:'24px 0', color:'#98a0b0', fontSize:'14px'}}>
              No open tickets 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
