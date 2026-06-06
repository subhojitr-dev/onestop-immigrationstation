import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import LawyerActions from './LawyerActions'

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  open:               { bg: '#e8effe', color: '#1d4ed8', label: 'Open' },
  in_progress:        { bg: '#fdf3e3', color: '#b45309', label: 'In Progress' },
  pending_documents:  { bg: '#fdeceb', color: '#b42318', label: 'Pending Documents' },
  submitted:          { bg: '#f1ecfe', color: '#6d28d9', label: 'Submitted' },
  approved:           { bg: '#e6f6ef', color: '#047857', label: 'Approved ✓' },
  denied:             { bg: '#fdeceb', color: '#b42318', label: 'Denied' },
  closed:             { bg: '#eef0f4', color: '#566173', label: 'Closed' },
}

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile to know role (lawyers get extra action panel)
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isLawyer = profile?.role === 'lawyer' || profile?.role === 'admin'

  const { data: c } = await supabase
    .from('cases').select('*').eq('id', id).single()

  if (!c) notFound()

  const { data: timeline } = await supabase
    .from('case_timeline').select('*').eq('case_id', id)
    .order('created_at', { ascending: false })

  const { data: documents } = await supabase
    .from('documents').select('*').eq('case_id', id)
    .order('uploaded_at', { ascending: false })

  const s = statusColors[c.status] || statusColors.open

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/dashboard">Dashboard</Link>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        <Link href="/dashboard/cases">Cases</Link>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        <span style={{color:'#1a2744', fontWeight:600}}>{c.case_number}</span>
      </div>

      {/* Header */}
      <div className="portal-header">
        <div>
          <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px', flexWrap:'wrap'}}>
            <h1 style={{margin:0}}>{c.visa_type} Case</h1>
            <span className="badge" style={{background: s.bg, color: s.color}}>{s.label}</span>
          </div>
          <p style={{color:'#586176', fontSize:'14px', margin:0}}>Case #{c.case_number}</p>
        </div>
        <Link href="/dashboard/tickets/new" className="btn btn--gold btn--sm">Need Help?</Link>
      </div>

      <div className="detail-grid">
        {/* Left column */}
        <div>
          {/* Case info */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">
                <span className="ti">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </span>
                Case Information
              </span>
            </div>
            <div className="meta-grid">
              <div className="meta-item">
                <span className="meta-label">Visa Type</span>
                <span className="meta-value">{c.visa_type}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Status</span>
                <span className="meta-value">
                  <span className="badge" style={{background: s.bg, color: s.color}}>{s.label}</span>
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Opened</span>
                <span className="meta-value">{new Date(c.opened_date).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'})}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Last Updated</span>
                <span className="meta-value">{new Date(c.updated_at).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'})}</span>
              </div>
              {c.assigned_attorney && (
                <div className="meta-item">
                  <span className="meta-label">Assigned Attorney</span>
                  <span className="meta-value">{c.assigned_attorney}</span>
                </div>
              )}
              {c.closed_date && (
                <div className="meta-item">
                  <span className="meta-label">Closed Date</span>
                  <span className="meta-value">{new Date(c.closed_date).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'})}</span>
                </div>
              )}
            </div>
            {c.description && (
              <div className="divider-block">
                <span className="meta-label">Description</span>
                <p style={{fontSize:'14px', color:'#586176', margin:'6px 0 0', lineHeight:1.6}}>{c.description}</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card">
            <div className="card-head">
              <span className="card-title">
                <span className="ti">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </span>
                Case Timeline
              </span>
            </div>
            {timeline && timeline.length > 0 ? (
              <div className="timeline">
                {timeline.map((item, i) => (
                  <div key={item.id} className={`tl-item${i === 0 ? ' is-current' : ''}`}>
                    <span className="tl-dot" />
                    <div>
                      <div className="tl-event">{item.event}</div>
                      {item.description && <div className="tl-desc">{item.description}</div>}
                      <div className="tl-date">
                        {new Date(item.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}
                        {' · '}
                        {new Date(item.created_at).toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="portal-empty" style={{padding:'20px 0'}}>
                <p>No timeline events yet. Your attorney will add updates as the case progresses.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Documents */}
          <div className="card" style={{marginBottom:'16px'}}>
            <div className="card-head">
              <span className="card-title">
                <span className="ti">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                </span>
                Documents
              </span>
            </div>
            {documents && documents.length > 0 ? (
              <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                {documents.map(doc => (
                  <div key={doc.id} className="doc-row">
                    <div className="doc-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                    </div>
                    <div style={{flex:1, minWidth:0}}>
                      <div className="doc-name">{doc.file_name}</div>
                      <div className="doc-meta">{doc.doc_type}</div>
                    </div>
                    <a href={doc.file_url} target="_blank" rel="noreferrer" className="doc-act dl">Download</a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="portal-empty" style={{padding:'16px 0'}}>
                <p style={{fontSize:'13px'}}>No documents for this case yet.</p>
                <Link href="/dashboard/documents" style={{fontSize:'13px', color:'#1a2744', fontWeight:600}}>
                  Upload documents →
                </Link>
              </div>
            )}
          </div>

          {/* Lawyer actions — only shown to lawyers/admins */}
          {isLawyer && (
            <LawyerActions
              caseId={c.id}
              caseNumber={c.case_number}
              clientUserId={c.user_id}
            />
          )}

          {/* Help card */}
          <div className="help-card">
            <h3>Need assistance?</h3>
            <p>Have questions about your case? Our bilingual team is ready to help.</p>
            <Link href="/dashboard/tickets/new" className="btn btn--gold"
              style={{display:'block', textAlign:'center', textDecoration:'none', fontSize:'14px', position:'relative'}}>
              Open a Support Ticket
            </Link>
            <div className="help-phone">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              (800) SUB-HROY
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
