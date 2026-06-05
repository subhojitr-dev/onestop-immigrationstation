import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role, full_name').eq('id', user.id).single()

  if (profile?.role !== 'lawyer' && profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const userName = profile?.full_name || user.email?.split('@')[0] || 'Admin'
  const initial = userName.charAt(0).toUpperCase()

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
    { href: '/admin/applications', label: 'Applications', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6M9 15h6"/>' },
    { href: '/admin/cases', label: 'Cases', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>' },
    { href: '/admin/users', label: 'Users', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
    { href: '/admin/appointments', label: 'Appointments', icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>' },
    { href: '/admin/tickets', label: 'Support Tickets', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  ]

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'#eef0f5', fontFamily:'Libre Franklin, sans-serif'}}>
      {/* Admin Sidebar */}
      <aside style={{
        width:256, flexShrink:0, position:'fixed', top:0, left:0, height:'100vh', zIndex:100,
        background:'linear-gradient(184deg,#111b31 0%,#0d1628 52%,#080f1e 100%)',
        display:'flex', flexDirection:'column', padding:'22px 0 16px',
      }}>
        {/* Logo */}
        <div style={{padding:'0 22px 20px', borderBottom:'1px solid rgba(255,255,255,.08)', marginBottom:'12px'}}>
          <Link href="/admin" style={{textDecoration:'none', display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{width:38, height:38, borderRadius:'9px', background:'linear-gradient(135deg,#cfa94a,#b8952a)', display:'grid', placeItems:'center', fontSize:'16px', fontWeight:700, color:'#0b1322', fontFamily:'Lora, serif', flexShrink:0}}>
              A
            </div>
            <div>
              <div style={{fontSize:'14px', fontWeight:700, color:'#fff', fontFamily:'Lora, serif'}}>Admin Panel</div>
              <div style={{fontSize:'10px', letterSpacing:'.14em', textTransform:'uppercase', color:'#cfa94a', fontWeight:600}}>One Stop Immigration</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{flex:1, padding:'0 14px', overflowY:'auto'}}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{
              display:'flex', alignItems:'center', gap:'11px', padding:'10px 13px',
              borderRadius:'10px', marginBottom:'3px', color:'rgba(255,255,255,.65)',
              textDecoration:'none', fontSize:'14px', fontWeight:500,
              transition:'background .15s, color .15s',
            }}
            className="admin-nav-link"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{width:18, height:18, flexShrink:0}} dangerouslySetInnerHTML={{__html: link.icon}} />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div style={{padding:'14px 16px 0', borderTop:'1px solid rgba(255,255,255,.08)'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px'}}>
            <div style={{width:36, height:36, borderRadius:'50%', flexShrink:0, background:'linear-gradient(150deg,#2b3c60,#1a2744)', border:'1px solid rgba(184,149,42,.4)', display:'grid', placeItems:'center', fontFamily:'Lora, serif', fontWeight:700, color:'#cfa94a', fontSize:'15px'}}>
              {initial}
            </div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:'13px', fontWeight:600, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{userName}</div>
              <div style={{fontSize:'11px', color:'rgba(255,255,255,.5)', textTransform:'capitalize'}}>{profile?.role}</div>
            </div>
            <form action={signOut}>
              <button type="submit" title="Sign out" style={{width:30, height:30, borderRadius:'7px', border:'1px solid rgba(255,255,255,.12)', background:'transparent', color:'rgba(255,255,255,.5)', display:'grid', placeItems:'center', cursor:'pointer'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:14, height:14}}>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </form>
          </div>
          <Link href="/dashboard" style={{display:'flex', alignItems:'center', gap:'6px', padding:'8px 10px', fontSize:'12px', color:'rgba(255,255,255,.4)', textDecoration:'none', marginTop:'4px'}}>
            ← Back to Client Portal
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div style={{flex:1, marginLeft:256, display:'flex', flexDirection:'column'}}>
        {children}
      </div>
    </div>
  )
}
