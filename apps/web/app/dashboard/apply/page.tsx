import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { visaTypeOptions } from '@/lib/questionnaire'

export default async function ApplyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch any existing draft applications
  const { data: existing } = await supabase
    .from('applications')
    .select('id, visa_type, status, current_section, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const draftMap: Record<string, typeof existing[0]> = {}
  existing?.forEach(app => { draftMap[app.visa_type] = app })

  return (
    <>
      <div className="portal-header">
        <div>
          <h1>Start an Application</h1>
          <p style={{color:'#586176', fontSize:'15px', margin:'4px 0 0'}}>
            Select the visa type you need — we'll guide you through the entire process
          </p>
        </div>
      </div>

      {/* How it works banner */}
      <div style={{
        background:'linear-gradient(150deg,#243355,#16223d)', borderRadius:'16px',
        padding:'24px 28px', marginBottom:'32px', display:'flex', gap:'32px',
        flexWrap:'wrap', position:'relative', overflow:'hidden',
        boxShadow:'0 16px 36px rgba(13,22,44,.25)'
      }}>
        <div style={{position:'absolute', top:'-40px', right:'-20px', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(184,149,42,.2),transparent 65%)'}} />
        {[
          { step:'1', icon:'📋', title:'Answer questions', desc:'Step-by-step questionnaire tailored to your visa type' },
          { step:'2', icon:'💾', title:'Save & resume', desc:'Your progress is saved automatically — come back anytime' },
          { step:'3', icon:'⚖️', title:'Lawyer review', desc:'Our attorney reviews your intake and prepares the forms' },
          { step:'4', icon:'📄', title:'Pre-filled forms', desc:'Official USCIS forms populated with your data, ready to file' },
        ].map(item => (
          <div key={item.step} style={{display:'flex', gap:'12px', alignItems:'flex-start', position:'relative', flex:'1 1 180px'}}>
            <div style={{
              width:36, height:36, borderRadius:'50%', flexShrink:0,
              background:'linear-gradient(135deg,#cfa94a,#b8952a)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'13px', fontWeight:700, color:'#0b1322'
            }}>{item.step}</div>
            <div>
              <div style={{fontSize:'14px', fontWeight:600, color:'#fff', marginBottom:'3px'}}>{item.icon} {item.title}</div>
              <div style={{fontSize:'12px', color:'rgba(255,255,255,.65)', lineHeight:1.5}}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Visa type cards */}
      <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
        {visaTypeOptions.map(visa => {
          const draft = draftMap[visa.id]
          return (
            <div key={visa.id} style={{
              background:'#fff', border:'1px solid #e7e9f0', borderRadius:'16px',
              padding:'24px 26px', display:'flex', gap:'20px', alignItems:'center',
              boxShadow:'0 1px 2px rgba(17,27,49,.04)',
              opacity: visa.available ? 1 : .6,
              position:'relative', overflow:'hidden',
            }}>
              {/* Gold left bar for available */}
              {visa.available && (
                <div style={{position:'absolute', left:0, top:0, bottom:0, width:'4px', background:'linear-gradient(135deg,#cfa94a,#b8952a)', borderRadius:'0'}} />
              )}

              {/* Icon */}
              <div style={{fontSize:'32px', flexShrink:0, width:'56px', height:'56px', display:'flex', alignItems:'center', justifyContent:'center', background:'#eef1f7', borderRadius:'14px'}}>
                {visa.icon}
              </div>

              {/* Info */}
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px', flexWrap:'wrap'}}>
                  <span style={{
                    background:'linear-gradient(150deg,#243355,#16223d)', color:'#cfa94a',
                    border:'1px solid rgba(184,149,42,.3)', borderRadius:'6px',
                    padding:'3px 10px', fontSize:'12px', fontWeight:700, fontFamily:'monospace'
                  }}>{visa.label}</span>
                  <h3 style={{fontFamily:'Lora, serif', fontSize:'17px', color:'#1a2744', margin:0}}>{visa.title}</h3>
                  {!visa.available && (
                    <span style={{background:'#eef0f4', color:'#566173', borderRadius:'20px', padding:'2px 10px', fontSize:'11px', fontWeight:600}}>
                      Coming Soon
                    </span>
                  )}
                  {draft && (
                    <span style={{background:'#fdf3e3', color:'#b45309', borderRadius:'20px', padding:'2px 10px', fontSize:'11px', fontWeight:600}}>
                      Draft in progress
                    </span>
                  )}
                </div>
                <p style={{fontSize:'13.5px', color:'#586176', margin:'0 0 10px', lineHeight:1.55}}>{visa.description}</p>
                <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
                  <div style={{fontSize:'12px', color:'#98a0b0'}}>
                    <span style={{fontWeight:600, color:'#586176'}}>Forms: </span>{visa.forms.join(', ')}
                  </div>
                  <div style={{fontSize:'12px', color:'#98a0b0'}}>
                    <span style={{fontWeight:600, color:'#586176'}}>Processing: </span>{visa.processingTime}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div style={{flexShrink:0}}>
                {visa.available ? (
                  draft ? (
                    <Link
                      href={`/dashboard/apply/${visa.id}`}
                      className="btn btn--navy btn--sm"
                      style={{textDecoration:'none'}}
                    >
                      Resume →
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/apply/${visa.id}`}
                      className="btn btn--gold btn--sm"
                      style={{textDecoration:'none'}}
                    >
                      Start Application
                    </Link>
                  )
                ) : (
                  <button disabled className="btn btn--sm" style={{background:'#eef0f4', color:'#98a0b0', cursor:'not-allowed'}}>
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Info note */}
      <div style={{marginTop:'28px', padding:'16px 20px', background:'#f7efd9', border:'1px solid #ead9a8', borderRadius:'12px', fontSize:'13px', color:'#8a6d12', lineHeight:1.6}}>
        <strong>Not sure which visa type you need?</strong> Book a free consultation with our attorneys and we'll guide you to the right category.{' '}
        <Link href="/dashboard/appointments/book" style={{color:'#b8952a', fontWeight:600}}>Book free consultation →</Link>
      </div>
    </>
  )
}
