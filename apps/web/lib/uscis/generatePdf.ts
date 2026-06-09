/**
 * lib/uscis/generatePdf.ts
 *
 * Generates a USCIS Pre-Fill Data Sheet PDF using pdf-lib.
 *
 * The output is a professionally formatted PDF organized by the USCIS form's
 * Part and Item numbers. Attorneys use this alongside the blank official form
 * to transfer values quickly — reducing prep time from 1-2 hours to ~15 minutes.
 *
 * Layout:
 *   - Firm header (navy/gold branding)
 *   - Form number, client name, generation date
 *   - Each Part as a navy header bar
 *   - Fields in two columns (short fields) or full width (long text)
 *   - Attorney-complete fields highlighted in amber
 *   - Page numbers in footer
 */

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib'
import { formsByVisaType, type FormDefinition, type FormField } from './formMaps'

// ─── Colors ───────────────────────────────────────────────────────────────────

const NAVY   = rgb(26/255, 39/255, 68/255)      // #1a2744
const GOLD   = rgb(207/255, 169/255, 74/255)    // #cfa94a
const LIGHT  = rgb(240/255, 244/255, 255/255)   // #f0f4ff — normal field background
const AMBER  = rgb(255/255, 243/255, 227/255)   // #fff3e3 — attorney-complete background
const GREY   = rgb(88/255, 97/255, 118/255)     // #586176
const LGREY  = rgb(152/255, 160/255, 176/255)   // #98a0b0
const WHITE  = rgb(1, 1, 1)
const BLACK  = rgb(22/255, 32/255, 58/255)      // #16203a

// ─── Page dimensions (US Letter) ─────────────────────────────────────────────

const PW = 612   // page width in points
const PH = 792   // page height in points
const ML = 45    // margin left
const MR = 45    // margin right
const MT = 45    // margin top
const MB = 45    // margin bottom
const CW = PW - ML - MR  // content width = 522

// ─── Helper: format raw questionnaire value ──────────────────────────────────

function formatValue(raw: any, fieldId?: string): string {
  if (raw === undefined || raw === null || raw === '') return ''
  if (typeof raw === 'boolean') return raw ? 'Yes' : 'No'
  const s = String(raw)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(s + 'T12:00:00')
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  }
  if (fieldId && (fieldId.includes('wage') || fieldId.includes('salary') || fieldId.includes('income')) && /^\d+$/.test(s)) {
    return `$${Number(s).toLocaleString('en-US')} / year`
  }
  const degreeMap: Record<string, string> = {
    bachelors: "Bachelor's Degree", masters: "Master's Degree",
    doctorate: 'Doctorate / PhD', associates: "Associate's Degree",
    diploma: 'Diploma / Certificate', equivalent: 'Foreign Equivalent',
  }
  if (degreeMap[s.toLowerCase()]) return degreeMap[s.toLowerCase()]
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function getFieldValue(field: FormField, answers: Record<string, any>): string {
  if (field.compute) {
    try { return field.compute(answers) || '' } catch { return '' }
  }
  if (field.sourceField) {
    return formatValue(answers[field.sourceField], field.sourceField)
  }
  return ''
}

// ─── Drawing helpers ─────────────────────────────────────────────────────────

interface DrawCtx {
  page: PDFPage
  regular: PDFFont
  bold: PDFFont
  y: number                          // current Y position (from top)
  addPage: () => void
}

function drawText(ctx: DrawCtx, text: string, x: number, y: number, size: number, font: PDFFont, color = BLACK) {
  ctx.page.drawText(text, {
    x, y: PH - y, size, font, color,
    maxWidth: CW - (x - ML),
  })
}

function checkPage(ctx: DrawCtx, needed: number) {
  if (ctx.y + needed > PH - MB) ctx.addPage()
}

// ─── Draw page header (firm + form info) ─────────────────────────────────────

function drawPageHeader(page: PDFPage, bold: PDFFont, regular: PDFFont, formDef: FormDefinition, clientName: string, pageNum: number, totalPages: number) {
  // Navy header bar
  page.drawRectangle({ x: 0, y: PH - 52, width: PW, height: 52, color: NAVY })
  // Gold accent line
  page.drawRectangle({ x: 0, y: PH - 54, width: PW, height: 2, color: GOLD })

  page.drawText('One Stop Immigration Station', { x: ML, y: PH - 20, size: 11, font: bold, color: GOLD })
  page.drawText('USCIS Pre-Fill Data Sheet — ATTORNEY WORKING DOCUMENT — CONFIDENTIAL', { x: ML, y: PH - 34, size: 7.5, font: regular, color: WHITE })
  page.drawText(`${formDef.formNumber}  ·  ${clientName}`, { x: ML, y: PH - 46, size: 8, font: bold, color: WHITE })
  page.drawText(`Page ${pageNum} of ${totalPages}`, { x: PW - MR - 60, y: PH - 34, size: 8, font: regular, color: LGREY })
}

// ─── Draw a section part header ───────────────────────────────────────────────

function drawPartHeader(ctx: DrawCtx, partNumber: number, partTitle: string) {
  checkPage(ctx, 22)
  ctx.page.drawRectangle({ x: ML, y: PH - ctx.y - 18, width: CW, height: 18, color: NAVY })
  drawText(ctx, `PART ${partNumber} — ${partTitle.toUpperCase()}`, ML + 8, ctx.y + 14, 8.5, ctx.bold, WHITE)
  ctx.y += 22
}

// ─── Draw a single field row ──────────────────────────────────────────────────

function drawField(ctx: DrawCtx, itemNum: string, label: string, value: string, isAttorney: boolean, note: string | undefined, colX: number, colW: number) {
  const rowH = value.length > 60 ? 36 : 26
  checkPage(ctx, rowH + 4)

  const bg = isAttorney ? AMBER : LIGHT
  ctx.page.drawRectangle({ x: colX, y: PH - ctx.y - rowH, width: colW, height: rowH, color: bg })
  // Left accent bar for attorney fields
  if (isAttorney) {
    ctx.page.drawRectangle({ x: colX, y: PH - ctx.y - rowH, width: 3, height: rowH, color: GOLD })
  }

  // Item number
  drawText(ctx, `[${itemNum}]`, colX + 6, ctx.y + 8, 6.5, ctx.regular, LGREY)
  // Label
  drawText(ctx, label.toUpperCase(), colX + 30, ctx.y + 8, 6, ctx.regular, GREY)

  if (isAttorney && !value) {
    drawText(ctx, 'ATTORNEY COMPLETES', colX + 6, ctx.y + 18, 7.5, ctx.bold, rgb(180/255, 83/255, 9/255))
  } else if (value) {
    // Value — handle wrapping
    const lines = value.length > 70
      ? [value.slice(0, 70), value.slice(70, 140)].filter(Boolean)
      : [value]
    drawText(ctx, lines[0], colX + 6, ctx.y + 19, 9, ctx.bold, BLACK)
    if (lines[1]) drawText(ctx, lines[1], colX + 6, ctx.y + 28, 8, ctx.bold, BLACK)
  } else {
    drawText(ctx, '—', colX + 6, ctx.y + 19, 9, ctx.regular, LGREY)
  }

  if (note) {
    drawText(ctx, `ℹ ${note}`, colX + 6, ctx.y + rowH - 2, 5.5, ctx.regular, LGREY)
  }
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function generateUscisFormPdf(
  visaType: string,
  answers: Record<string, any>,
  clientName: string,
  clientEmail: string,
  submittedAt: string | null,
): Promise<Uint8Array> {
  const formDef: FormDefinition | undefined = formsByVisaType[visaType]
  if (!formDef) throw new Error(`No USCIS form mapping for visa type: ${visaType}`)

  const pdfDoc = await PDFDocument.create()
  const bold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const pages: PDFPage[] = []

  function addPage(): PDFPage {
    const p = pdfDoc.addPage([PW, PH])
    pages.push(p)
    return p
  }

  // Start first page
  let currentPage = addPage()

  const ctx: DrawCtx = {
    page: currentPage,
    bold,
    regular,
    y: MT + 54 + 16,    // start below header
    addPage: () => {
      currentPage = addPage()
      ctx.page = currentPage
      ctx.y = MT + 54 + 16
    },
  }

  // ── Cover block ────────────────────────────────────────────────────────────
  ctx.page.drawRectangle({ x: ML, y: PH - ctx.y - 50, width: CW, height: 50, color: LIGHT })
  drawText(ctx, formDef.formNumber, ML + 8, ctx.y + 12, 22, bold, NAVY)
  drawText(ctx, formDef.title, ML + 8, ctx.y + 28, 9, bold, NAVY)
  if (formDef.supplement) drawText(ctx, `Includes: ${formDef.supplement}`, ML + 8, ctx.y + 39, 7.5, regular, GREY)
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  drawText(ctx, `Client: ${clientName}  ·  ${clientEmail}  ·  Generated: ${date}`, ML + 8, ctx.y + 48, 7, regular, GREY)
  ctx.y += 58

  // ── Disclaimer ─────────────────────────────────────────────────────────────
  ctx.page.drawRectangle({ x: ML, y: PH - ctx.y - 20, width: CW, height: 20, color: AMBER })
  ctx.page.drawRectangle({ x: ML, y: PH - ctx.y - 20, width: 3, height: 20, color: GOLD })
  drawText(ctx, `⚠ ${formDef.disclaimer}`, ML + 8, ctx.y + 9, 6.5, regular, rgb(180/255, 83/255, 9/255))
  ctx.y += 26

  // ── Legend ─────────────────────────────────────────────────────────────────
  ctx.page.drawRectangle({ x: ML, y: PH - ctx.y - 16, width: CW, height: 16, color: rgb(245/255, 246/255, 250/255) })
  drawText(ctx, 'LEGEND:  White/Blue = from client intake    Amber = ATTORNEY COMPLETES (no client data)',
    ML + 8, ctx.y + 11, 6.5, regular, GREY)
  ctx.y += 22

  // ── Parts ──────────────────────────────────────────────────────────────────
  for (const part of formDef.parts) {
    drawPartHeader(ctx, part.number, part.title)

    // Determine which fields to draw in two columns vs single column
    for (let i = 0; i < part.fields.length; ) {
      const field = part.fields[i]
      const value = getFieldValue(field, answers)

      // Long text fields (duties, history text) go full width
      const isLong = value.length > 80 || (field.sourceField && ['pos_duties', 'hist_prev_details', 'hist_denial_details', 'hist_criminal_details', 'hist_violation_details', 'edu_additional', 'ben_immigration_history', 'niw_evidence', 'qualifications_summary'].includes(field.sourceField))

      if (isLong || i === part.fields.length - 1) {
        // Full-width
        const rowH = value.length > 80 ? 46 : 28
        checkPage(ctx, rowH + 6)
        const bg = field.attorneyCompletes ? AMBER : LIGHT
        ctx.page.drawRectangle({ x: ML, y: PH - ctx.y - rowH, width: CW, height: rowH, color: bg })
        if (field.attorneyCompletes) ctx.page.drawRectangle({ x: ML, y: PH - ctx.y - rowH, width: 3, height: rowH, color: GOLD })
        drawText(ctx, `[${field.item}]`, ML + 6, ctx.y + 8, 6.5, regular, LGREY)
        drawText(ctx, field.label.toUpperCase(), ML + 30, ctx.y + 8, 6, regular, GREY)
        if (field.attorneyCompletes && !value) {
          drawText(ctx, 'ATTORNEY COMPLETES', ML + 6, ctx.y + 20, 8, bold, rgb(180/255, 83/255, 9/255))
        } else if (value) {
          const segments = value.length > 80
            ? [value.slice(0, 90), value.length > 90 ? value.slice(90, 180) + (value.length > 180 ? '…' : '') : ''].filter(Boolean)
            : [value]
          drawText(ctx, segments[0], ML + 6, ctx.y + 21, 9, bold, BLACK)
          if (segments[1]) drawText(ctx, segments[1], ML + 6, ctx.y + 32, 8, bold, BLACK)
        } else {
          drawText(ctx, '—', ML + 6, ctx.y + 21, 9, regular, LGREY)
        }
        if (field.note) drawText(ctx, `ℹ ${field.note}`, ML + 6, ctx.y + rowH - 2, 5.5, regular, LGREY)
        ctx.y += rowH + 4
        i++
      } else {
        // Try to pair two fields side by side
        const nextField = part.fields[i + 1]
        const colW = (CW - 4) / 2

        drawField(ctx, field.item, field.label, value, !!field.attorneyCompletes, field.note, ML, colW)

        if (nextField) {
          const nextValue = getFieldValue(nextField, answers)
          const nextIsLong = nextValue.length > 80 || (nextField.sourceField && ['pos_duties','hist_prev_details'].includes(nextField.sourceField))
          if (!nextIsLong) {
            drawField(ctx, nextField.item, nextField.label, nextValue, !!nextField.attorneyCompletes, nextField.note, ML + colW + 4, colW)
            // Advance Y by the taller of the two rows
            const h1 = value.length > 60 ? 36 : 26
            const h2 = nextValue.length > 60 ? 36 : 26
            ctx.y += Math.max(h1, h2) + 4
            i += 2
            continue
          }
        }

        const h = value.length > 60 ? 36 : 26
        ctx.y += h + 4
        i++
      }
    }

    ctx.y += 8
  }

  // ── Footer line ────────────────────────────────────────────────────────────
  checkPage(ctx, 20)
  ctx.page.drawRectangle({ x: ML, y: PH - ctx.y - 14, width: CW, height: 14, color: rgb(245/255, 246/255, 250/255) })
  drawText(ctx, `End of pre-fill data for ${clientName}  ·  ${formDef.formNumber}  ·  Do not file this document with USCIS`, ML + 6, ctx.y + 10, 7, regular, LGREY)

  // ── Stamp page headers on all pages now that we know total ─────────────────
  const total = pages.length
  for (let i = 0; i < total; i++) {
    drawPageHeader(pages[i], bold, regular, formDef, clientName, i + 1, total)
  }

  return pdfDoc.save()
}
