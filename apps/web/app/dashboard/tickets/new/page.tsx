'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewTicketPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cases, setCases] = useState<any[]>([])
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [caseId, setCaseId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data } = await supabase
        .from('cases')
        .select('id, case_number, visa_type')
        .eq('user_id', user.id)
        .order('opened_date', { ascending: false })
      setCases(data ?? [])
    }
    load()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) {
      setError('Subject and description are required')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.from('tickets').insert({
      user_id:     user.id,
      subject:     subject.trim(),
      description: description.trim(),
      priority,
      case_id:     caseId || null,
      status:      'open',
    })

    if (err) {
      setError('Failed to create ticket: ' + err.message)
      setLoading(false)
    } else {
      router.push('/dashboard/tickets')
    }
  }

  return (
    <>
      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px', fontSize:'14px', color:'#6b7280'}}>
          <Link href="/dashboard/tickets" style={{color:'#6b7280', textDecoration:'none'}}>Support Tickets</Link>
          <span>→</span>
          <span style={{color:'#1a2744', fontWeight:500}}>New Ticket</span>
        </div>

        <div className="portal-header">
          <div>
            <h1>Open a Support Ticket</h1>
            <p style={{color:'#6b7280', fontSize:'15px', margin:'4px 0 0'}}>
              Our team responds within one business day
            </p>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 300px', gap:'24px', alignItems:'start'}}>
          <div className="portal-section">
            {error && (
              <div className="auth-error" style={{marginBottom:'16px'}}>{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="subject">Subject *</label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Brief summary of your question or issue"
                  required
                  style={{fontSize:'15px', padding:'10px 14px'}}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Please describe your issue in detail. Include any relevant dates, reference numbers, or documents."
                  required
                  style={{
                    width:'100%', padding:'10px 14px',
                    border:'1.5px solid #e5e7eb', borderRadius:'8px',
                    fontSize:'15px', minHeight:'140px', boxSizing:'border-box',
                    fontFamily:'inherit', resize:'vertical'
                  }}
                />
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
                <div className="auth-field">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    style={{
                      width:'100%', padding:'10px 14px',
                      border:'1.5px solid #e5e7eb', borderRadius:'8px',
                      fontSize:'15px', background:'#fff'
                    }}
                  >
                    <option value="low">Low — General question</option>
                    <option value="medium">Medium — Need help soon</option>
                    <option value="high">High — Urgent matter</option>
                    <option value="urgent">🚨 Urgent — Time-sensitive deadline</option>
                  </select>
                </div>

                <div className="auth-field">
                  <label htmlFor="case">Related Case (optional)</label>
                  <select
                    id="case"
                    value={caseId}
                    onChange={e => setCaseId(e.target.value)}
                    style={{
                      width:'100%', padding:'10px 14px',
                      border:'1.5px solid #e5e7eb', borderRadius:'8px',
                      fontSize:'15px', background:'#fff'
                    }}
                  >
                    <option value="">Not related to a case</option>
                    {cases.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.case_number} — {c.visa_type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{display:'flex', gap:'12px', marginTop:'8px'}}>
                <button
                  type="submit"
                  className="btn btn--navy"
                  disabled={loading}
                  style={{flex:1, padding:'13px', justifyContent:'center'}}
                >
                  {loading ? 'Submitting…' : 'Submit Ticket'}
                </button>
                <Link
                  href="/dashboard/tickets"
                  className="btn btn--outline-navy"
                  style={{padding:'13px 24px', textDecoration:'none'}}
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Info card */}
          <div className="portal-section">
            <h2 style={{fontFamily:'Lora, serif', fontSize:'17px', color:'#1a2744', margin:'0 0 16px'}}>What to expect</h2>
            <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
              {[
                {icon:'⏱️', title:'Response within 1 business day', desc:'Our team monitors tickets Monday–Friday 9am–6pm EST'},
                {icon:'🌐', title:'Bilingual support', desc:'We respond in English or Español'},
                {icon:'📎', title:'You can attach documents', desc:'Reply to our response to add files to your ticket'},
                {icon:'📞', title:'Urgent? Call us', desc:'(800) SUB-HROY for time-sensitive matters'},
              ].map((item, i) => (
                <div key={i} style={{display:'flex', gap:'12px', alignItems:'flex-start', paddingBottom:'12px', borderBottom: i < 3 ? '1px solid #e5e7eb' : 'none'}}>
                  <span style={{fontSize:'20px', flexShrink:0}}>{item.icon}</span>
                  <div>
                    <div style={{fontSize:'14px', fontWeight:600, color:'#1a2744'}}>{item.title}</div>
                    <div style={{fontSize:'13px', color:'#6b7280', marginTop:'2px'}}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </>
  )
}
