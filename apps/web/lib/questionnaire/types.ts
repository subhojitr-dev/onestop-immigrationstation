/**
 * lib/questionnaire/types.ts
 *
 * TypeScript type definitions for the Smart Form Assistant questionnaire system.
 *
 * How the system works:
 *   - Each visa type (H-1B, L-1, Green Card, etc.) has one VisaQuestionnaire object.
 *   - A questionnaire is broken into Sections (e.g. "Employer Info", "Education").
 *   - Each Section contains an ordered array of QuestionFields.
 *   - The questionnaire engine (app/dashboard/apply/[visaType]/page.tsx) renders
 *     one section at a time and stores all answers in Supabase applications.data (JSONB).
 *   - Fields can be conditionally shown/hidden using the showIf property.
 *   - USCIS form field references are stored alongside each field for the lawyer's reference.
 */

/**
 * All supported input types.
 * 'heading' and 'info' are display-only (no user input captured).
 */
export type FieldType =
  | 'text'       // single-line text input
  | 'email'      // email input (browser validates format)
  | 'tel'        // telephone number input
  | 'date'       // date picker
  | 'number'     // numeric input
  | 'select'     // dropdown (single choice from options[])
  | 'radio'      // radio group (single choice from options[], shown as styled cards)
  | 'textarea'   // multi-line text
  | 'checkbox'   // single boolean toggle (yes/no)
  | 'heading'    // visual section divider — renders as a bold label, no input
  | 'info'       // informational callout box (blue background) — no input

/** A single selectable option for 'select' and 'radio' field types. */
export interface FieldOption {
  value: string  // stored in answers[field.id]
  label: string  // displayed to the user
}

/**
 * A single form field within a Section.
 *
 * Field IDs must be globally unique across all sections of a questionnaire
 * because all answers are stored flat in a single JSONB object: { [fieldId]: value }.
 *
 * Naming convention used: prefix_fieldname
 *   - employer_* → Section 1 (Employer Info)
 *   - ben_*      → Section 2 (Beneficiary / Employee personal info)
 *   - edu_*      → Section 3 (Education)
 *   - pos_*      → Section 4 (Job Position)
 *   - hist_*     → Section 5 (Immigration History)
 *   - doc_*      → Section 6 (Documents Checklist)
 */
export interface QuestionField {
  /** Unique identifier — used as the key in the answers object stored in Supabase */
  id: string

  /** Controls how the field is rendered */
  type: FieldType

  /**
   * Display label shown above the input.
   * For 'heading' and 'info' types, use the `text` property instead.
   * For 'checkbox', the label is shown inline next to the checkbox.
   */
  label: string

  /** Placeholder text inside the input (text/email/tel/number/textarea) */
  placeholder?: string

  /** If true, a red asterisk (*) is shown next to the label */
  required?: boolean

  /** Options list for 'select' and 'radio' types */
  options?: FieldOption[]

  /** Helper text displayed below the input in grey — tips, where to find the value, etc. */
  hint?: string

  /**
   * Conditional visibility rule.
   * The field is only shown when answers[field] === value (or is in value[] for multi-match).
   * Example: show I-94 field only when ben_in_us === 'yes'
   */
  showIf?: {
    field: string           // the field ID whose value we're checking
    value: string | string[] // show this field when the watched field has this value
  }

  /**
   * Text content for 'heading' and 'info' types.
   * For 'heading': rendered as a bold uppercase section separator.
   * For 'info': rendered as a blue callout box with an ℹ️ icon.
   */
  text?: string

  /**
   * Reference to the USCIS form and item number this field maps to.
   * Displayed in small grey italic text next to the field label.
   * Example: "I-129 Part 2, Item 1"
   * Helps the lawyer know exactly which USCIS form field this answer populates.
   */
  uscisRef?: string
}

/**
 * A group of related fields shown together as one "page" of the questionnaire.
 * The user navigates section by section — one section per screen.
 * Completed sections are stored in applications.completed_sections (integer[]).
 */
export interface Section {
  /** 1-based integer. Used in completed_sections[] and to track current progress. */
  id: number

  /** Bold title shown at the top of the section card, e.g. "Employer Information" */
  title: string

  /** Subtitle / description shown below the title */
  subtitle: string

  /** Emoji icon displayed next to the title */
  icon: string

  /** Ordered list of fields to render in this section */
  fields: QuestionField[]
}

/**
 * The top-level questionnaire for a single visa type.
 * One file per visa type: h1b.ts, l1.ts, green_card.ts, k1.ts, family_petition.ts
 */
export interface VisaQuestionnaire {
  /** Must match the URL param and the visa_type column in Supabase applications table */
  visaType: string

  /** Human-readable visa name shown in UI, e.g. "H-1B Specialty Occupation" */
  label: string

  /** Short description of who this visa is for — shown on the /dashboard/apply selection page */
  description: string

  /** Estimated minutes to complete — displayed in the sidebar of the questionnaire engine */
  estimatedMinutes: number

  /** USCIS forms that will be prepared based on this questionnaire's answers */
  uscisforms: string[]

  /** Ordered list of sections. The questionnaire engine iterates through these in order. */
  sections: Section[]
}
