import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const statusColors: Record<string,{bg:string;color:string;label:string}> = {
  open:        { bg:'#e8effe', color:'#1d4ed8', label:'Open' },
  in_progress: { bg:'#fdf3e3', color:'#b45309', label:'In Progress' },
  resolved:    { bg:'#e6f6ef', color:'#047857', label:'Resolved' },
  closed:      { bg:'#eef0f4', color:'#566173', label:'Closed' },
}
const priorityColors: Record<string,{bg:string;color:string}> = {
  low:    { bg:'#eef0f4', color:'#566173' },
  medium: { bg:'#fdf3e3', color:'#b45309' },
  high:   { bg:'#fdeceb', color:'#b42318' },
  urgent: { bg:'#fee2e2', color:'#7f1d1d' },
}

export default async function AdminTicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Admin client bypasses RLS — reads ALL users' data
  const admin = createAdminClient()

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false })

  const { data: replyCount } = await supabase
    .from('ticket_replies')
    .select('ticket_id')

  const replyCounts = replyCount?.reduce((acc, r) => { acc[r.ticket_id] = (acc[r.ticket_id]||0)+1; return acc }, {} as Record<string,number>) ?? {}

  return (
    <div style={{padding:'32px'}}>
      <div style={{marginBottom:'28px'}}>
        <h1 style={{fontFamily:'Lora, serif', fontSize:'28px', color:'#1a2744', margin:'0 0 6px'}}>Support Tickets</h1>
        <p style={{color:'#586176', fontSize:'15px', margin:0}}>All client support requests — reply from the client portal ticket page</p>
      </div>

      {/* Status filters */}
      <div style={{display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap'}}>
        {Object.entries(statusColors).map(([key, val]) => (
          <span key={key} style={{background:val.bg, color:val.color, borderRadius:'20px', padding:'5px 14px', fontSize:'13px', fontWeight:600}}>
            {val.label} ({tickets?.filter(t => t.status === key).length ?? 0})
          </span>
        ))}
      </div>

      <div style={{background:'#fff', borderRadius:'16px', border:'1px solid #e7e9f0', overflow:'hidden', boxShadow:'0 1px 2px rgba(17,27,49,.04)'}}>
        {tickets && tickets.length > 0 ? tickets.map(ticket => {
          const s = statusColors[ticket.status] || statusColors.open
          const p = priorityColors[ticket.priority] || priorityColors.medium
          const profile = ticket.profiles as any
          return (
            <Link key={ticket.id} href={`/dashboard/tickets/${ticket.id}`} style={{textDecoration:'none'}}>
              <div style={{display:'flex', alignItems:'center', gap:'14px', padding:'14px 20px', borderBottom:'1px solid #eef1f7', cursor:'pointer', transition:'background .14s'}}>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:'14px', fontWeight:600, color:'#1a2744', marginBottom:'3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                    {ticket.subject}
                  </div>
                  <div style={{fontSize:'12px', color:'#98a0b0'}}>
                    {profile?.full_name || profile?.email} · {new Date(ticket.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}
                    {replyCounts[ticket.id] ? ` · ${replyCounts[ticket.id]} repl${replyCounts[ticket.id] === 1 ? 'y' : 'ies'}` : ' · No replies yet'}
                  </div>
                </div>
                <span style={{background:p.bg, color:p.color, borderRadius:'20px', padding:'3px 10px', fontSize:'11px', fontWeight:600, textTransform:'capitalize', flexShrink:0}}>
                  {ticket.priority}
                </span>
                <span style={{background:s.bg, color:s.color, borderRadius:'20px', padding:'3px 10px', fontSize:'11px', fontWeight:600, flexShrink:0}}>
                  {s.label}
                </span>
                <span style={{color:'#98a0b0', fontSize:'13px', flexShrink:0}}>→</span>
              </div>
            </Link>
          )
        }) : (
          <div style={{textAlign:'center', padding:'40px', color:'#98a0b0', fontSize:'14px'}}>No tickets yet 🎉</div>
        )}
      </div>
    </div>
  )
}
