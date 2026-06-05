import { h1bQuestionnaire } from './h1b'
import type { VisaQuestionnaire } from './types'

export const questionnaires: Record<string, VisaQuestionnaire> = {
  h1b: h1bQuestionnaire,
  // l1, green_card, k1, family_petition — coming in Phase 2
}

export const visaTypeOptions = [
  {
    id: 'h1b',
    label: 'H-1B',
    title: 'Specialty Occupation',
    description: 'For professionals in specialty occupations — tech, finance, engineering, healthcare, and more. Requires a bachelor\'s degree or equivalent.',
    icon: '💼',
    forms: ['I-129', 'LCA (ETA-9035)'],
    processingTime: '3–6 months (15 days with premium)',
    available: true,
  },
  {
    id: 'l1',
    label: 'L-1',
    title: 'Intracompany Transfer',
    description: 'For executives, managers, or specialized knowledge employees transferring from a foreign affiliate to a US office.',
    icon: '🌐',
    forms: ['I-129 with L Supplement'],
    processingTime: '2–5 months',
    available: false,
  },
  {
    id: 'green_card',
    label: 'Green Card',
    title: 'Permanent Residence',
    description: 'Employment-based or family-based permanent residence. Includes EB-1, EB-2, EB-3 categories.',
    icon: '🟢',
    forms: ['I-140', 'I-485', 'I-864'],
    processingTime: 'Varies widely by category',
    available: false,
  },
  {
    id: 'k1',
    label: 'K-1',
    title: 'Fiancé Visa',
    description: 'For US citizens wishing to bring their foreign fiancé to the US to get married within 90 days.',
    icon: '💍',
    forms: ['I-129F', 'DS-160'],
    processingTime: '6–12 months',
    available: false,
  },
  {
    id: 'family_petition',
    label: 'Family Petition',
    title: 'Family-Based Immigration',
    description: 'For US citizens or permanent residents sponsoring immediate relatives including spouses, children, and parents.',
    icon: '👨‍👩‍👧',
    forms: ['I-130', 'I-485', 'I-864'],
    processingTime: 'Varies by relationship category',
    available: false,
  },
]

export { type VisaQuestionnaire }
export type { QuestionField, Section } from './types'
