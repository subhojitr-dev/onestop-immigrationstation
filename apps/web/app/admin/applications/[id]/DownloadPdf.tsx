/**
 * app/admin/applications/[id]/DownloadPdf.tsx
 *
 * Client component — "Download Summary PDF" button on the admin application detail page.
 *
 * Uses jspdf (browser-side) to generate a formatted PDF of all questionnaire answers.
 * No server round-trip needed — PDF is generated and downloaded entirely in the browser.
 *
 * The PDF includes:
 *   - Header: firm name, visa type, client name, submission date
 *   - Each questionnaire section as a bold heading
 *   - Each answered field as "Label: Value" rows
 *   - Empty/unanswered fields are skipped
 *   - Page numbers in the footer
 *   - Heading/info display-only fields are skipped (no user data)
 *
 * Props:
 *   application — the full application row from Supabase (includes data JSONB + profiles join)
 *   questionnaire — the VisaQuestionnaire definition for this visa type
 */
'use client'
import { useState } from 'react'
import type { VisaQuestionnaire } from '@/lib/questionnaire/types'

interface Props {
  application: {
    id: string
    visa_type: string
    status: string
    submitted_at: string | null
    data: Record<string, any>
    profiles: { full_name: string; email: string } | null
  }
  questionnaire: VisaQuestionnaire | null
}

export default function DownloadPdf({ application, questionnaire }: Props) {
  const [generating, setGenerating] = useState(false)

  async function handleDownload() {
    setGenerating(true)
    try {
      // Dynamic import — jspdf is large, only load when user clicks
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      const pageW = 210
      const marginL = 18
      const marginR = 18
      const contentW = pageW - marginL - marginR
      let y = 20

      const clientName = application.profiles?.full_name || 'Unknown Client'
      const clientEmail = application.profiles?.email || ''
      const submittedAt = application.submitted_at
        ? new Date(application.submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'Not submitted'

      function checkPage(needed = 10) {
        if (y + needed > 275) {
          doc.addPage()
          y = 20
        }
      }

      // ── Header ────────────────────────────────────────────
      doc.setFillColor(26, 39, 68) // navy #1a2744
      doc.rect(0, 0, pageW, 28, 'F')
      doc.setTextColor(207, 169, 74) // gold #cfa94a
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('One Stop Immigration Station', marginL, 12)
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Client Intake Summary', marginL, 20)
      y = 38

      // ── Client info block ─────────────────────────────────
      doc.setTextColor(26, 39, 68)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(`${questionnaire?.label || application.visa_type.toUpperCase()} Application`, marginL, y)
      y += 8

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(88, 97, 118)
      doc.text(`Client: ${clientName}  |  ${clientEmail}`, marginL, y)
      y += 5
      doc.text(`Submitted: ${submittedAt}  |  Status: ${application.status.replace(/_/g, ' ')}`, marginL, y)
      y += 5
      doc.text(`Application ID: ${application.id}`, marginL, y)
      y += 10

      // Divider
      doc.setDrawColor(231, 233, 240)
      doc.line(marginL, y, pageW - marginR, y)
      y += 8

      // ── Sections ──────────────────────────────────────────
      if (!questionnaire) {
        doc.setTextColor(88, 97, 118)
        doc.setFontSize(11)
        doc.text('Questionnaire definition not available for this visa type.', marginL, y)
      } else {
        const answers = application.data || {}

        for (const section of questionnaire.sections) {
          checkPage(16)

          // Section heading
          doc.setFillColor(240, 244, 255)
          doc.rect(marginL, y - 4, contentW, 9, 'F')
          doc.setTextColor(26, 39, 68)
          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          doc.text(`${section.icon}  ${section.title}`, marginL + 3, y + 1)
          y += 10

          for (const field of section.fields) {
            // Skip display-only fields and unanswered fields
            if (field.type === 'heading' || field.type === 'info') continue
            const raw = answers[field.id]
            if (raw === undefined || raw === null || raw === '' || raw === false) continue

            let valueStr: string
            if (typeof raw === 'boolean' || raw === true) valueStr = 'Yes'
            else if (Array.isArray(raw)) valueStr = raw.join(', ')
            else valueStr = String(raw)

            const labelText = field.label.replace(/\s*\(optional\)/i, '').replace(/\s*\(if known\)/i, '').trim()

            checkPage(8)

            // Label
            doc.setFontSize(8.5)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(88, 97, 118)
            doc.text(labelText, marginL, y)
            y += 4.5

            // Value — wrap long text
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(22, 32, 58)
            doc.setFontSize(10)
            const lines = doc.splitTextToSize(valueStr, contentW)
            for (const line of lines) {
              checkPage(6)
              doc.text(line, marginL, y)
              y += 5
            }
            y += 2
          }

          y += 4
          checkPage(4)
          doc.setDrawColor(231, 233, 240)
          doc.line(marginL, y, pageW - marginR, y)
          y += 6
        }
      }

      // ── Footer with page numbers ──────────────────────────
      const totalPages = (doc as any).internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(152, 160, 176)
        doc.setFont('helvetica', 'normal')
        doc.text(
          `One Stop Immigration Station — Confidential  |  Page ${i} of ${totalPages}`,
          pageW / 2, 290, { align: 'center' }
        )
      }

      const fileName = `${application.visa_type}-intake-${clientName.replace(/\s+/g, '-').toLowerCase()}.pdf`
      doc.save(fileName)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('PDF generation failed. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      style={{
        width: '100%', padding: '11px', borderRadius: '10px', border: 'none',
        background: generating ? '#eef0f4' : 'linear-gradient(135deg,#cfa94a,#b8952a)',
        color: generating ? '#98a0b0' : '#0b1322',
        fontSize: '13px', fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer',
        transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
      }}
    >
      {generating ? (
        <>Generating PDF…</>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Summary PDF
        </>
      )}
    </button>
  )
}
