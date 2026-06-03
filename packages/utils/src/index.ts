// ============================================================
// Shared Utility Functions — used by web AND mobile
// ============================================================

// ── Date formatting ──────────────────────────────────────────
export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const formatDateShort = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

export const timeAgo = (date: string | Date): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  if (seconds < 60)    return 'just now'
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// ── String helpers ───────────────────────────────────────────
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

export const titleCase = (str: string): string =>
  str.split(' ').map(capitalize).join(' ')

export const slugify = (str: string): string =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const truncate = (str: string, length: number): string =>
  str.length > length ? str.substring(0, length) + '...' : str

// ── Validation ───────────────────────────────────────────────
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const isValidPhone = (phone: string): boolean =>
  /^\+?[\d\s\-().]{10,}$/.test(phone)

export const isValidPassword = (password: string): boolean =>
  password.length >= 8

// ── Case status helpers ──────────────────────────────────────
export const getCaseStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    open:              '#1a4b8c',
    in_progress:       '#f59e0b',
    pending_documents: '#ef4444',
    submitted:         '#8b5cf6',
    approved:          '#10b981',
    denied:            '#ef4444',
    closed:            '#6b7280',
  }
  return colors[status] || '#6b7280'
}

export const getCaseStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    open:              'Open',
    in_progress:       'In Progress',
    pending_documents: 'Documents Needed',
    submitted:         'Submitted to USCIS',
    approved:          'Approved ✓',
    denied:            'Denied',
    closed:            'Closed',
  }
  return labels[status] || status
}

// ── Ticket status helpers ────────────────────────────────────
export const getTicketStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    open:        '#1a4b8c',
    in_progress: '#f59e0b',
    resolved:    '#10b981',
    closed:      '#6b7280',
  }
  return colors[status] || '#6b7280'
}

// ── Storage ──────────────────────────────────────────────────
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const getFileExtension = (filename: string): string =>
  filename.split('.').pop()?.toLowerCase() || ''

export const isImageFile = (filename: string): boolean =>
  ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(getFileExtension(filename))

export const isPdfFile = (filename: string): boolean =>
  getFileExtension(filename) === 'pdf'

// ── Role helpers ─────────────────────────────────────────────
export const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    beneficiary: 'Beneficiary',
    sponsor:     'Sponsor',
    contact:     'Contact / Paralegal',
    admin:       'Administrator',
  }
  return labels[role] || role
}

export const getRoleColor = (role: string): string => {
  const colors: Record<string, string> = {
    beneficiary: '#1a4b8c',
    sponsor:     '#c8a85a',
    contact:     '#10b981',
    admin:       '#ef4444',
  }
  return colors[role] || '#6b7280'
}
