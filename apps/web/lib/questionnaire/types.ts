export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'date'
  | 'number'
  | 'select'
  | 'radio'
  | 'textarea'
  | 'checkbox'
  | 'heading'   // visual separator, no input
  | 'info'      // informational callout

export interface FieldOption {
  value: string
  label: string
}

export interface QuestionField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required?: boolean
  options?: FieldOption[]        // for select / radio
  hint?: string                  // helper text below field
  showIf?: { field: string; value: string | string[] } // conditional display
  text?: string                  // for heading / info types
  uscisRef?: string              // e.g. "I-129 Part 2, Item 1"
}

export interface Section {
  id: number
  title: string
  subtitle: string
  icon: string
  fields: QuestionField[]
}

export interface VisaQuestionnaire {
  visaType: string
  label: string
  description: string
  estimatedMinutes: number
  uscisforms: string[]
  sections: Section[]
}
