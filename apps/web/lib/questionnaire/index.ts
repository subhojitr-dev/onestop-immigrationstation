/**
 * lib/questionnaire/index.ts
 *
 * Central registry for all visa type questionnaires.
 *
 * HOW TO ADD A NEW VISA TYPE (Phase 2):
 *   1. Create `lib/questionnaire/l1.ts` (copy h1b.ts as a template)
 *   2. Import it here and add to the `questionnaires` map
 *   3. Set `available: true` for that visa type in `visaTypeOptions` below
 *   4. The questionnaire engine (/dashboard/apply/[visaType]/page.tsx) will
 *      automatically pick it up via the `questionnaires[visaType]` lookup.
 *
 * The `questionnaires` map key must exactly match:
 *   - The `id` in visaTypeOptions
 *   - The `visaType` column constraint in Supabase (see 002_applications.sql)
 *   - The URL segment: /dashboard/apply/h1b → visaType = 'h1b'
 */

import { h1bQuestionnaire } from './h1b'
// Phase 2 imports (uncomment when questionnaire files are created):
// import { l1Questionnaire } from './l1'
// import { greenCardQuestionnaire } from './green_card'
// import { k1Questionnaire } from './k1'
// import { familyPetitionQuestionnaire } from './family_petition'
import type { VisaQuestionnaire } from './types'

/**
 * Map of visaType string → questionnaire data.
 * Used by the questionnaire engine to load the correct set of sections and fields.
 */
export const questionnaires: Record<string, VisaQuestionnaire> = {
  h1b: h1bQuestionnaire,
  // Phase 2 — uncomment as each questionnaire is built:
  // l1: l1Questionnaire,
  // green_card: greenCardQuestionnaire,
  // k1: k1Questionnaire,
  // family_petition: familyPetitionQuestionnaire,
}

/**
 * Visa type metadata displayed on the /dashboard/apply selection page.
 * `available: false` renders the card as "Coming Soon" (greyed out, not clickable).
 * `forms` — USCIS form numbers shown as badges on each card.
 * `processingTime` — typical USCIS processing time shown to help the client plan.
 */
export const visaTypeOptions = [
  {
    id: 'h1b',
    label: 'H-1B',
    title: 'Specialty Occupation',
    description: 'For professionals in specialty occupations — tech, finance, engineering, healthcare, and more. Requires a bachelor\'s degree or equivalent.',
    icon: '💼',
    forms: ['I-129', 'LCA (ETA-9035)'],
    processingTime: '3–6 months (15 days with premium)',
    available: true,  // ✅ questionnaire built
  },
  {
    id: 'l1',
    label: 'L-1',
    title: 'Intracompany Transfer',
    description: 'For executives, managers, or specialized knowledge employees transferring from a foreign affiliate to a US office.',
    icon: '🌐',
    forms: ['I-129 with L Supplement'],
    processingTime: '2–5 months',
    available: false, // ⬜ Phase 2 — set to true after creating l1.ts
  },
  {
    id: 'green_card',
    label: 'Green Card',
    title: 'Permanent Residence',
    description: 'Employment-based or family-based permanent residence. Includes EB-1, EB-2, EB-3 categories.',
    icon: '🟢',
    forms: ['I-140', 'I-485', 'I-864'],
    processingTime: 'Varies widely by category',
    available: false, // ⬜ Phase 2
  },
  {
    id: 'k1',
    label: 'K-1',
    title: 'Fiancé Visa',
    description: 'For US citizens wishing to bring their foreign fiancé to the US to get married within 90 days.',
    icon: '💍',
    forms: ['I-129F', 'DS-160'],
    processingTime: '6–12 months',
    available: false, // ⬜ Phase 2
  },
  {
    id: 'family_petition',
    label: 'Family Petition',
    title: 'Family-Based Immigration',
    description: 'For US citizens or permanent residents sponsoring immediate relatives including spouses, children, and parents.',
    icon: '👨‍👩‍👧',
    forms: ['I-130', 'I-485', 'I-864'],
    processingTime: 'Varies by relationship category',
    available: false, // ⬜ Phase 2
  },
]

export { type VisaQuestionnaire }
export type { QuestionField, Section } from './types'
