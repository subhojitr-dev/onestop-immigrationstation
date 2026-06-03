// ============================================================
// Shared TypeScript Types — used by web, mobile AND backend
// ============================================================

// ── User & Auth ──────────────────────────────────────────────
export type UserRole = 'beneficiary' | 'sponsor' | 'contact' | 'admin'

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  role: UserRole
  created_at: string
  updated_at: string
}

// ── Cases ────────────────────────────────────────────────────
export type CaseStatus =
  | 'open'
  | 'in_progress'
  | 'pending_documents'
  | 'submitted'
  | 'approved'
  | 'denied'
  | 'closed'

export type VisaType =
  | 'H-1B' | 'H-3' | 'H-4'
  | 'L-1'
  | 'O-1' | 'O-1A' | 'O-1B'
  | 'TN' | 'E-1' | 'E-2' | 'E-3'
  | 'F-1' | 'M-1' | 'J-1'
  | 'K-1' | 'K-3'
  | 'F2A' | 'F2B' | 'F3' | 'F4'
  | 'U' | 'DACA' | 'Asylum' | 'Refugee' | 'SIJ'
  | 'R-1' | 'P-1A' | 'P-3' | 'B-1'
  | 'Green Card' | 'Citizenship'
  | 'Other'

export interface ImmigrationCase {
  id: string
  case_number: string
  user_id: string
  sponsor_id?: string
  contact_id?: string
  visa_type: VisaType
  status: CaseStatus
  description?: string
  assigned_attorney?: string
  opened_date: string
  updated_at: string
  closed_date?: string
}

export interface CaseTimeline {
  id: string
  case_id: string
  event: string
  description?: string
  created_by: string
  created_at: string
}

// ── Appointments / Consultations ─────────────────────────────
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show'

export interface Appointment {
  id: string
  user_id: string
  case_id?: string
  date: string
  time_slot: string
  status: AppointmentStatus
  is_free: boolean
  free_session_number?: 1 | 2
  notes?: string
  attorney_notes?: string
  created_at: string
}

// ── Dependents ───────────────────────────────────────────────
export interface Dependent {
  id: string
  user_id: string
  full_name: string
  relationship: string
  date_of_birth?: string
  country_of_birth?: string
  passport_number?: string
  created_at: string
}

// ── Beneficiaries (added by sponsors) ────────────────────────
export interface Beneficiary {
  id: string
  sponsor_id: string
  user_id?: string
  full_name: string
  email: string
  phone?: string
  visa_type?: VisaType
  status: 'invited' | 'active' | 'inactive'
  created_at: string
}

// ── Contacts (paralegal / attorney assistants) ───────────────
export interface Contact {
  id: string
  sponsor_id: string
  full_name: string
  email: string
  phone?: string
  role_description?: string
  created_at: string
}

// ── Tickets / Support ────────────────────────────────────────
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Ticket {
  id: string
  user_id: string
  case_id?: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  created_at: string
  updated_at: string
  closed_at?: string
}

export interface TicketReply {
  id: string
  ticket_id: string
  user_id: string
  message: string
  is_staff_reply: boolean
  created_at: string
}

// ── Documents ────────────────────────────────────────────────
export type DocumentType =
  | 'passport'
  | 'visa'
  | 'i94'
  | 'employment_letter'
  | 'tax_return'
  | 'bank_statement'
  | 'birth_certificate'
  | 'marriage_certificate'
  | 'other'

export interface Document {
  id: string
  case_id?: string
  user_id: string
  file_name: string
  file_url: string
  file_size?: number
  doc_type: DocumentType
  description?: string
  uploaded_at: string
}

// ── Blog ─────────────────────────────────────────────────────
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  author_id: string
  author_name?: string
  category: string
  tags?: string[]
  featured_image?: string
  is_published: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

// ── Contact Form ─────────────────────────────────────────────
export type ServiceType =
  | 'green_card_employment'
  | 'green_card_family'
  | 'removal_defense'
  | 'appeals'
  | 'non_immigrant_visa'
  | 'citizenship'
  | 'i9_audit'
  | 'other'

export interface ContactForm {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  subject: string
  service_type?: ServiceType
  message: string
  is_read: boolean
  created_at: string
}

// ── Notifications ────────────────────────────────────────────
export type NotificationType =
  | 'case_update'
  | 'appointment_reminder'
  | 'appointment_confirmed'
  | 'ticket_reply'
  | 'document_required'
  | 'general'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  link?: string
  created_at: string
}

// ── Loyalty Program ──────────────────────────────────────────
export interface LoyaltyProgram {
  id: string
  user_id: string
  points: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  updated_at: string
}

// ── API Response wrapper ─────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// ── Pagination ───────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
