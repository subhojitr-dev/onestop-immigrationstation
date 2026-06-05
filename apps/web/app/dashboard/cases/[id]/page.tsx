import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: c } = await supabase
    .from('cases')
    .select('*')
    .eq('id', id)
    .single()

  if (!c) notFound()

  const { data: timeline } = await supabase
    .from('case_timeline')
    .select('*')
    .eq('case_id', id)
    .order('created_at', { ascending: false })

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('case_id', id)
    .order('created_at', { ascending: false })

  const statusColors: Record<string, { bg: string; color: string; label: string }> = {
    open:               { bg: '#dbeafe', color: '#1d4ed8', label: 'Open' },
    in_progress:        { bg: '#fef3c7', color: '#92400e', label: 'In Progress' },
    pending_documents:  { bg: '#fee2e2', color: '#991b1b', label: 'Pending Documents' },
    submitted:          { bg: '#ede9fe', color: '#5b21b6', label: 'Submitted' },
    approved:           { bg: '#d1fae5', color: '#065f46', label: 'Approved ✓' },
    denied:             { bg: '#fee2e2', color: '#991b1b', label: 'Denied' },
    closed:             { bg: '#f3f4f6', color: '#4b5563', label: 'Closed' },
  }

  const s = statusColors[c.status] || statusColors.open

  return (
    <>
      {/* Breadcrumb */}
        <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px', fontSize:'14px', color:'#6b7280'}}>
          <Link href="/dashboard" style={{color:'#6b7280', textDecoration:'none'}}>Dashboard</Link>
          <span>→</span>
          <Link href="/dashboard/cases" style={{color:'#6b7280', textDecoration:'none'}}>Cases</Link>
          <span>→</span>
          <span style={{color:'#1a2744', fontWeight:500}}>{c.case_number}</span>
        </div>

        {/* Header */}
        <div className="portal-header">
          <div>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px'}}>
              <h1 style={{margin:0}}>{c.visa_type} Case</h1>
              <span className="pt-status" style={{background: s.bg, color: s.color, fontSize:'13px'}}>{s.label}</span>
            </div>
            <p style={{color:'#6b7280', fontSize:'14px', margin:0}}>Case #{c.case_number}</p>
          </div>
          <Link href="/contact" className="btn btn--gold btn--sm">Need Help?</Link>
        </div>

        <div className="case-detail-grid">
          {/* Left column */}
          <div>
            {/* Case info */}
            <div className="case-info-card">
              <h2>Case Information</h2>
              <div className="case-meta-grid">
                <div className="case-meta-item">
                  <span className="cmi-label">Visa Type</span>
                  <span className="cmi-value">{c.visa_type}</span>
                </div>
                <div className="case-meta-item">
                  <span className="cmi-label">Status</span>
                  <span className="cmi-value">
                    <span className="pt-status" style={{background: s.bg, color: s.color}}>{s.label}</span>
                  </span>
                </div>
                <div className="case-meta-item">
                  <span className="cmi-label">Opened</span>
                  <span className="cmi-value">{new Date(c.opened_date).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'})}</span>
                </div>
                <div className="case-meta-item">
                  <span className="cmi-label">Last Updated</span>
                  <span className="cmi-value">{new Date(c.updated_at).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'})}</span>
                </div>
                {c.assigned_attorney && (
                  <div className="case-meta-item">
                    <span className="cmi-label">Assigned Attorney</span>
                    <span className="cmi-value">{c.assigned_attorney}</span>
                  </div>
                )}
                {c.closed_date && (
                  <div className="case-meta-item">
                    <span className="cmi-label">Closed Date</span>
                    <span className="cmi-value">{new Date(c.closed_date).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'})}</span>
                  </div>
                )}
              </div>
              {c.description && (
                <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid #e5e7eb'}}>
                  <span className="cmi-label">Description</span>
                  <p style={{fontSize:'14px', color:'#374151', margin:'6px 0 0'}}>{c.description}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="case-info-card">
              <h2>Case Timeline</h2>
              {timeline && timeline.length > 0 ? (
                <div className="timeline">
                  {timeline.map((item, i) => (
                    <div key={item.id} className="timeline-item">
                      <div style={{position:'relative', flexShrink:0}}>
                        <div className="timeline-dot"></div>
                        {i < timeline.length - 1 && <div className="timeline-line"></div>}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-event">{item.event}</div>
                        {item.description && <div className="timeline-desc">{item.description}</div>}
                        <div className="timeline-date">{new Date(item.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit'})}</div>
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
            <div className="case-info-card">
              <h2>Documents</h2>
              {documents && documents.length > 0 ? (
                <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                  {documents.map(doc => (
                    <div key={doc.id} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px', background:'#f9fafb', borderRadius:'8px'}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16,color:'#6b7280',flexShrink:0}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                      <span style={{fontSize:'13px', color:'#374151', flex:1}}>{doc.file_name}</span>
                      <a href={doc.file_url} target="_blank" rel="noreferrer" style={{fontSize:'12px', color:'#1a2744', fontWeight:600}}>Download</a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="portal-empty" style={{padding:'20px 0'}}>
                  <p style={{fontSize:'13px'}}>No documents uploaded yet.</p>
                  <Link href="/dashboard/documents" style={{fontSize:'13px', color:'#1a2744', fontWeight:600}}>Upload documents →</Link>
                </div>
              )}
            </div>

            {/* Need help card */}
            <div className="case-info-card" style={{background:'#1a2744', color:'#fff'}}>
              <h2 style={{color:'#fff'}}>Need assistance?</h2>
              <p style={{fontSize:'14px', color:'rgba(255,255,255,.7)', marginBottom:'16px'}}>
                Have questions about your case? Our bilingual team is ready to help.
              </p>
              <Link href="/contact" className="btn btn--gold" style={{display:'block', textAlign:'center', textDecoration:'none', fontSize:'14px'}}>
                Contact Us
              </Link>
              <a href="tel:18007824769" style={{display:'block', textAlign:'center', color:'rgba(255,255,255,.7)', fontSize:'13px', marginTop:'10px', textDecoration:'none'}}>
                Or call (800) SUB-HROY
              </a>
            </div>
          </div>
        </div>
    </>
  )
}
