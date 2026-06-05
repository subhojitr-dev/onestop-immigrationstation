'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { questionnaires } from '@/lib/questionnaire'
import type { QuestionField } from '@/lib/questionnaire'

export default function QuestionnairePage() {
  const router = useRouter()
  const params = useParams()
  const visaType = params.visaType as string

  const q = questionnaires[visaType]

  const [appId, setAppId] = useState<string | null>(null)
  const [currentSection, setCurrentSection] = useState(1)
  const [completedSections, setCompletedSections] = useState<number[]>([])
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Load or create application
  useEffect(() => {
    if (!q) return
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Check for existing draft
      const { data: existing } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .eq('visa_type', visaType)
        .eq('status', 'draft')
        .single()

      if (existing) {
        setAppId(existing.id)
        setCurrentSection(existing.current_section || 1)
        setCompletedSections(existing.completed_sections || [])
        setAnswers(existing.data || {})
      } else {
        // Create new application
        const { data: newApp } = await supabase
          .from('applications')
          .insert({ user_id: user.id, visa_type: visaType, status: 'draft', current_section: 1, completed_sections: [], data: {} })
          .select('id').single()
        if (newApp) setAppId(newApp.id)
      }
    }
    load()
  }, [visaType, q, router])

  // Auto-save answers
  const saveProgress = useCallback(async (data: Record<string, any>, section: number, completed: number[]) => {
    if (!appId) return
    setSaveStatus('saving')
    const supabase = createClient()
    const { error } = await supabase
      .from('applications')
      .update({ data, current_section: section, completed_sections: completed })
      .eq('id', appId)
    setSaveStatus(error ? 'error' : 'saved')
    setTimeout(() => setSaveStatus(null), 2000)
  }, [appId])

  function handleAnswer(fieldId: string, value: any) {
    setAnswers(prev => ({ ...prev, [fieldId]: value }))
  }

  async function handleNext() {
    const newCompleted = completedSections.includes(currentSection)
      ? completedSections
      : [...completedSections, currentSection]
    const nextSection = currentSection + 1
    setCompletedSections(newCompleted)
    setCurrentSection(nextSection)
    await saveProgress(answers, nextSection, newCompleted)
    window.scrollTo(0, 0)
  }

  async function handleBack() {
    const prev = currentSection - 1
    setCurrentSection(prev)
    await saveProgress(answers, prev, completedSections)
    window.scrollTo(0, 0)
  }

  async function handleSubmit() {
    setSubmitting(true)
    const supabase = createClient()
    const allCompleted = q.sections.map(s => s.id)
    await supabase.from('applications').update({
      status: 'submitted',
      data: answers,
      completed_sections: allCompleted,
      submitted_at: new Date().toISOString(),
    }).eq('id', appId)
    setSubmitted(true)
    setSubmitting(false)
  }

  function isFieldVisible(field: QuestionField): boolean {
    if (!field.showIf) return true
    const val = answers[field.showIf.field]
    if (Array.isArray(field.showIf.value)) return field.showIf.value.includes(val)
    return val === field.showIf.value
  }

  function renderField(field: QuestionField) {
    if (!isFieldVisible(field)) return null

    if (field.type === 'heading') {
      return (
        <div key={field.id} style={{marginTop:'24px', marginBottom:'8px', paddingTop:'20px', borderTop:'1px solid #e7e9f0'}}>
          <div style={{fontSize:'13px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#98a0b0'}}>
            {field.text}
          </div>
        </div>
      )
    }

    if (field.type === 'info') {
      return (
        <div key={field.id} style={{background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'10px', padding:'14px 16px', marginBottom:'20px', fontSize:'13.5px', color:'#1d4ed8', lineHeight:1.6}}>
          ℹ️ {field.text}
        </div>
      )
    }

    const inputStyle: React.CSSProperties = {
      width:'100%', padding:'10px 14px', border:'1.5px solid #e7e9f0',
      borderRadius:'10px', fontFamily:'inherit', fontSize:'14px',
      color:'#16203a', outline:'none', background:'#fff', boxSizing:'border-box'
    }

    return (
      <div key={field.id} style={{marginBottom:'18px'}}>
        <label style={{display:'block', fontSize:'13px', fontWeight:600, color:'#16203a', marginBottom:'6px'}}>
          {field.label}
          {field.required && <span style={{color:'#b42318', marginLeft:'3px'}}>*</span>}
          {field.uscisRef && (
            <span style={{marginLeft:'8px', fontSize:'11px', fontWeight:400, color:'#98a0b0', fontStyle:'italic'}}>
              {field.uscisRef}
            </span>
          )}
        </label>

        {(field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'date' || field.type === 'number') && (
          <input
            type={field.type}
            value={answers[field.id] || ''}
            onChange={e => handleAnswer(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            style={inputStyle}
          />
        )}

        {field.type === 'textarea' && (
          <textarea
            value={answers[field.id] || ''}
            onChange={e => handleAnswer(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            style={{...inputStyle, resize:'vertical', minHeight:'100px'}}
          />
        )}

        {field.type === 'select' && (
          <select
            value={answers[field.id] || ''}
            onChange={e => handleAnswer(field.id, e.target.value)}
            style={inputStyle}
          >
            <option value="">— Select —</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}

        {field.type === 'radio' && (
          <div style={{display:'flex', flexDirection:'column', gap:'8px', marginTop:'4px'}}>
            {field.options?.map(opt => (
              <label key={opt.value} style={{display:'flex', alignItems:'flex-start', gap:'10px', cursor:'pointer', padding:'10px 14px', border:'1.5px solid', borderColor: answers[field.id] === opt.value ? '#1a2744' : '#e7e9f0', borderRadius:'10px', background: answers[field.id] === opt.value ? '#f0f4ff' : '#fff', transition:'all .15s'}}>
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={answers[field.id] === opt.value}
                  onChange={() => handleAnswer(field.id, opt.value)}
                  style={{marginTop:'2px', flexShrink:0, accentColor:'#1a2744'}}
                />
                <span style={{fontSize:'14px', color:'#16203a'}}>{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {field.type === 'checkbox' && (
          <label style={{display:'flex', alignItems:'flex-start', gap:'10px', cursor:'pointer', padding:'10px 14px', border:'1.5px solid', borderColor: answers[field.id] ? '#1a2744' : '#e7e9f0', borderRadius:'10px', background: answers[field.id] ? '#f0f4ff' : '#fff', transition:'all .15s'}}>
            <input
              type="checkbox"
              checked={!!answers[field.id]}
              onChange={e => handleAnswer(field.id, e.target.checked)}
              style={{marginTop:'2px', flexShrink:0, accentColor:'#1a2744'}}
            />
            <span style={{fontSize:'14px', color:'#16203a'}}>{field.label}</span>
          </label>
        )}

        {field.hint && (
          <div style={{fontSize:'12px', color:'#98a0b0', marginTop:'5px', lineHeight:1.5}}>
            💡 {field.hint}
          </div>
        )}
      </div>
    )
  }

  // ── NOT FOUND ────────────────────────────────────────────
  if (!q) {
    return (
      <div className="portal-empty" style={{marginTop:'60px'}}>
        <h3>Questionnaire not found</h3>
        <p>This visa type questionnaire is not available yet.</p>
        <Link href="/dashboard/apply" className="btn btn--navy" style={{textDecoration:'none', marginTop:'16px', display:'inline-block'}}>
          ← Back to Apply
        </Link>
      </div>
    )
  }

  // ── SUBMITTED ───────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{maxWidth:'560px', margin:'60px auto', textAlign:'center'}}>
        <div style={{width:72, height:72, borderRadius:'50%', background:'#e6f6ef', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'32px'}}>
          ✅
        </div>
        <h1 style={{fontFamily:'Lora, serif', color:'#1a2744', marginBottom:'12px'}}>Application Submitted!</h1>
        <p style={{color:'#586176', lineHeight:1.7, marginBottom:'8px'}}>
          Your <strong>{q.label}</strong> intake questionnaire has been submitted to our team.
        </p>
        <p style={{color:'#586176', lineHeight:1.7, marginBottom:'28px'}}>
          Our attorneys will review your responses within <strong>1–2 business days</strong> and reach out with next steps. You can also open a support ticket if you have questions.
        </p>
        <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap'}}>
          <Link href="/dashboard" className="btn btn--navy" style={{textDecoration:'none'}}>Go to Dashboard</Link>
          <Link href="/dashboard/tickets/new" className="btn btn--outline-navy" style={{textDecoration:'none'}}>Open Support Ticket</Link>
        </div>
      </div>
    )
  }

  const section = q.sections.find(s => s.id === currentSection)
  if (!section) return null

  const isLastSection = currentSection === q.sections.length
  const progressPct = Math.round((completedSections.length / q.sections.length) * 100)

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/dashboard/apply">Applications</Link>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        <span style={{color:'#1a2744', fontWeight:600}}>{q.label} Application</span>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 280px', gap:'24px', alignItems:'start'}}>

        {/* ── MAIN FORM ── */}
        <div>
          {/* Section header */}
          <div className="card" style={{marginBottom:'20px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px'}}>
              <div style={{fontSize:'28px'}}>{section.icon}</div>
              <div>
                <h2 style={{fontFamily:'Lora, serif', fontSize:'22px', color:'#1a2744', margin:'0 0 4px'}}>
                  {section.title}
                </h2>
                <p style={{color:'#586176', fontSize:'14px', margin:0}}>{section.subtitle}</p>
              </div>
              {saveStatus && (
                <div style={{marginLeft:'auto', fontSize:'12px', color: saveStatus === 'saved' ? '#047857' : saveStatus === 'error' ? '#b42318' : '#586176'}}>
                  {saveStatus === 'saving' ? '💾 Saving…' : saveStatus === 'saved' ? '✓ Saved' : '⚠ Save failed'}
                </div>
              )}
            </div>

            {/* Fields */}
            <div>
              {section.fields.map(field => renderField(field))}
            </div>

            {/* Navigation */}
            <div style={{display:'flex', gap:'12px', marginTop:'24px', paddingTop:'20px', borderTop:'1px solid #e7e9f0'}}>
              {currentSection > 1 && (
                <button onClick={handleBack} className="btn btn--outline-navy" style={{padding:'11px 22px'}}>
                  ← Back
                </button>
              )}
              <div style={{flex:1}} />
              {!isLastSection ? (
                <button onClick={handleNext} className="btn btn--navy" style={{padding:'11px 28px'}}>
                  Save & Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn btn--gold"
                  style={{padding:'11px 28px'}}
                >
                  {submitting ? 'Submitting…' : '✓ Submit Application'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div style={{position:'sticky', top:'88px'}}>
          {/* Progress */}
          <div className="card" style={{marginBottom:'16px'}}>
            <div style={{fontSize:'13px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#98a0b0', marginBottom:'14px'}}>
              Progress
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px'}}>
              <div style={{flex:1, height:'6px', background:'#eef1f7', borderRadius:'99px', overflow:'hidden'}}>
                <div style={{height:'100%', width:`${progressPct}%`, background:'linear-gradient(135deg,#cfa94a,#b8952a)', borderRadius:'99px', transition:'width .3s'}} />
              </div>
              <span style={{fontSize:'13px', fontWeight:600, color:'#1a2744', flexShrink:0}}>{progressPct}%</span>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
              {q.sections.map(s => {
                const done = completedSections.includes(s.id)
                const current = s.id === currentSection
                return (
                  <div key={s.id} style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 10px', borderRadius:'8px', background: current ? '#f0f4ff' : 'transparent', cursor: done ? 'pointer' : 'default'}}
                    onClick={() => done && (setCurrentSection(s.id), window.scrollTo(0,0))}>
                    <div style={{
                      width:22, height:22, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:700,
                      background: done ? 'linear-gradient(135deg,#cfa94a,#b8952a)' : current ? '#1a2744' : '#eef1f7',
                      color: done ? '#0b1322' : current ? '#fff' : '#98a0b0',
                    }}>
                      {done ? '✓' : s.id}
                    </div>
                    <span style={{fontSize:'13px', fontWeight: current ? 600 : 400, color: current ? '#1a2744' : done ? '#586176' : '#98a0b0'}}>
                      {s.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Forms required */}
          <div className="card" style={{marginBottom:'16px'}}>
            <div style={{fontSize:'13px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#98a0b0', marginBottom:'12px'}}>
              Forms We'll Prepare
            </div>
            {q.uscisforms.map(form => (
              <div key={form} style={{display:'flex', alignItems:'center', gap:'8px', padding:'6px 0', borderBottom:'1px solid #eef1f7', fontSize:'13px', color:'#1a2744'}}>
                <span style={{fontSize:'16px'}}>📄</span> {form}
              </div>
            ))}
            <div style={{marginTop:'12px', fontSize:'12px', color:'#98a0b0', lineHeight:1.5}}>
              Est. {q.estimatedMinutes} min to complete
            </div>
          </div>

          {/* Help */}
          <div style={{background:'linear-gradient(150deg,#243355,#16223d)', borderRadius:'12px', padding:'18px 20px'}}>
            <div style={{fontFamily:'Lora, serif', fontSize:'15px', color:'#fff', marginBottom:'6px'}}>Need help?</div>
            <div style={{fontSize:'12.5px', color:'rgba(255,255,255,.65)', lineHeight:1.5, marginBottom:'14px'}}>
              Not sure how to answer a question? Our team is here to help.
            </div>
            <Link href="/dashboard/tickets/new" style={{display:'block', textAlign:'center', padding:'9px', background:'linear-gradient(135deg,#cfa94a,#b8952a)', color:'#0b1322', borderRadius:'8px', textDecoration:'none', fontSize:'13px', fontWeight:700}}>
              Ask a Question
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
