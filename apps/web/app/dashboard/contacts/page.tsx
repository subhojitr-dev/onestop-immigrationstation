import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role !== 'sponsor' && profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('sponsor_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <div className="portal-header">
        <div>
          <h1>HR Contacts</h1>
          <p style={{color:'#586176', fontSize:'15px', margin:'4px 0 0'}}>
            HR and admin contacts at your company
          </p>
        </div>
        <Link href="/dashboard/contacts/add" className="btn btn--gold btn--sm">
          + Add Contact
        </Link>
      </div>

      {/* Stats */}
      <div className="portal-stats" style={{gridTemplateColumns:'repeat(2,1fr)', maxWidth:'500px', marginBottom:'28px'}}>
        <div className="portal-stat">
          <div className="stat-top">
            <span className="stat-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </span>
            <span className="stat-lbl">Total Contacts</span>
          </div>
          <div className="ps-num">{contacts?.length ?? 0}</div>
        </div>
        <div className="portal-stat">
          <div className="stat-top">
            <span className="stat-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </span>
            <span className="stat-lbl">With Role Defined</span>
          </div>
          <div className="ps-num">{contacts?.filter(c => c.role_description).length ?? 0}</div>
        </div>
      </div>

      {/* Contact list */}
      {contacts && contacts.length > 0 ? (
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          {contacts.map(contact => {
            const initials = contact.full_name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()
            return (
              <div key={contact.id} style={{
                background:'#fff', border:'1px solid #e7e9f0', borderRadius:'14px',
                padding:'18px 22px', display:'flex', alignItems:'center', gap:'16px',
                boxShadow:'0 1px 2px rgba(17,27,49,.04)'
              }}>
                {/* Avatar */}
                <div style={{
                  width:46, height:46, borderRadius:'50%',
                  background:'linear-gradient(150deg,#243355,#16223d)',
                  border:'1px solid rgba(184,149,42,.35)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'Lora, serif', fontSize:'16px', fontWeight:700,
                  color:'#cfa94a', flexShrink:0
                }}>
                  {initials}
                </div>

                {/* Info */}
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:'15px', fontWeight:600, color:'#1a2744', marginBottom:'3px'}}>
                    {contact.full_name}
                  </div>
                  <div style={{fontSize:'13px', color:'#586176', display:'flex', gap:'14px', flexWrap:'wrap'}}>
                    <span>{contact.email}</span>
                    {contact.phone && <span>· {contact.phone}</span>}
                  </div>
                  {contact.role_description && (
                    <div style={{
                      display:'inline-flex', marginTop:'6px',
                      background:'#eef1f7', color:'#1a2744',
                      borderRadius:'6px', padding:'2px 10px',
                      fontSize:'12px', fontWeight:600
                    }}>
                      {contact.role_description}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{display:'flex', gap:'8px', flexShrink:0}}>
                  <a
                    href={`mailto:${contact.email}`}
                    className="btn btn--outline-navy btn--sm"
                    style={{textDecoration:'none'}}
                  >
                    Email
                  </a>
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="btn btn--outline-navy btn--sm"
                      style={{textDecoration:'none'}}
                    >
                      Call
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="portal-empty" style={{marginTop:'60px'}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <h3 style={{color:'#1a2744', fontFamily:'Lora, serif', margin:'12px 0 6px'}}>No contacts yet</h3>
          <p>Add the HR and admin contacts at your company who handle immigration matters.</p>
          <Link href="/dashboard/contacts/add" className="btn btn--navy"
            style={{marginTop:'16px', display:'inline-block', textDecoration:'none'}}>
            Add First Contact
          </Link>
        </div>
      )}

      {/* Info box */}
      <div style={{
        marginTop:'32px', background:'#eff6ff', border:'1px solid #bfdbfe',
        borderRadius:'12px', padding:'18px 22px', display:'flex', gap:'14px', alignItems:'flex-start'
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{width:18,height:18,flexShrink:0,marginTop:2}}>
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
        </svg>
        <div>
          <div style={{fontSize:'14px', fontWeight:600, color:'#1d4ed8', marginBottom:'3px'}}>About HR Contacts</div>
          <div style={{fontSize:'13px', color:'#1d4ed8', opacity:.8, lineHeight:1.6}}>
            These are the HR managers or administrators at your company who coordinate with our team on immigration cases. They are different from beneficiaries — they manage the process, not the visa applications themselves.
          </div>
        </div>
      </div>
    </>
  )
}
