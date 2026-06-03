// ============================================================
// Shared Supabase API calls — used by BOTH web and mobile
// ============================================================

import { createClient } from '@supabase/supabase-js'
import type {
  User, ImmigrationCase, Appointment, Ticket,
  TicketReply, Document, BlogPost, ContactForm,
  Dependent, Beneficiary, Notification
} from '@onestop/types'

// ── Supabase client ──────────────────────────────────────────
// These values come from environment variables
const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  || process.env.EXPO_PUBLIC_SUPABASE_URL  || ''
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Auth ─────────────────────────────────────────────────────
export const auth = {
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signUp: (email: string, password: string, metadata: Partial<User>) =>
    supabase.auth.signUp({ email, password, options: { data: metadata } }),

  signOut: () =>
    supabase.auth.signOut(),

  getUser: () =>
    supabase.auth.getUser(),

  resetPassword: (email: string) =>
    supabase.auth.resetPasswordForEmail(email),

  onAuthChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback),
}

// ── Cases ────────────────────────────────────────────────────
export const cases = {
  getAll: (userId: string) =>
    supabase.from('cases').select('*').eq('user_id', userId).order('opened_date', { ascending: false }),

  getById: (id: string) =>
    supabase.from('cases').select('*, case_timeline(*)').eq('id', id).single(),

  create: (data: Partial<ImmigrationCase>) =>
    supabase.from('cases').insert(data).select().single(),

  update: (id: string, data: Partial<ImmigrationCase>) =>
    supabase.from('cases').update(data).eq('id', id).select().single(),
}

// ── Appointments ─────────────────────────────────────────────
export const appointments = {
  getAll: (userId: string) =>
    supabase.from('appointments').select('*').eq('user_id', userId).order('date', { ascending: true }),

  getById: (id: string) =>
    supabase.from('appointments').select('*').eq('id', id).single(),

  book: (data: Partial<Appointment>) =>
    supabase.functions.invoke('book-appointment', { body: data }),

  cancel: (id: string) =>
    supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id),

  getFreeRemaining: (userId: string) =>
    supabase.functions.invoke('get-free-sessions', { body: { user_id: userId } }),
}

// ── Tickets ──────────────────────────────────────────────────
export const tickets = {
  getAll: (userId: string) =>
    supabase.from('tickets').select('*').eq('user_id', userId).order('created_at', { ascending: false }),

  getById: (id: string) =>
    supabase.from('tickets').select('*, ticket_replies(*)').eq('id', id).single(),

  create: (data: Partial<Ticket>) =>
    supabase.from('tickets').insert(data).select().single(),

  reply: (data: Partial<TicketReply>) =>
    supabase.from('ticket_replies').insert(data).select().single(),

  close: (id: string) =>
    supabase.from('tickets').update({ status: 'closed', closed_at: new Date().toISOString() }).eq('id', id),
}

// ── Documents ────────────────────────────────────────────────
export const documents = {
  getAll: (caseId: string) =>
    supabase.from('documents').select('*').eq('case_id', caseId),

  upload: async (file: File | Blob, path: string) => {
    const { data, error } = await supabase.storage.from('documents').upload(path, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path)
    return urlData.publicUrl
  },

  delete: (id: string, filePath: string) =>
    Promise.all([
      supabase.from('documents').delete().eq('id', id),
      supabase.storage.from('documents').remove([filePath]),
    ]),
}

// ── Dependents ───────────────────────────────────────────────
export const dependents = {
  getAll: (userId: string) =>
    supabase.from('dependents').select('*').eq('user_id', userId),

  create: (data: Partial<Dependent>) =>
    supabase.from('dependents').insert(data).select().single(),

  update: (id: string, data: Partial<Dependent>) =>
    supabase.from('dependents').update(data).eq('id', id).select().single(),

  delete: (id: string) =>
    supabase.from('dependents').delete().eq('id', id),
}

// ── Beneficiaries ────────────────────────────────────────────
export const beneficiaries = {
  getAll: (sponsorId: string) =>
    supabase.from('beneficiaries').select('*').eq('sponsor_id', sponsorId),

  create: (data: Partial<Beneficiary>) =>
    supabase.functions.invoke('add-beneficiary', { body: data }),

  update: (id: string, data: Partial<Beneficiary>) =>
    supabase.from('beneficiaries').update(data).eq('id', id),

  delete: (id: string) =>
    supabase.from('beneficiaries').delete().eq('id', id),
}

// ── Blog ─────────────────────────────────────────────────────
export const blog = {
  getAll: (limit = 10, page = 1) =>
    supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1),

  getBySlug: (slug: string) =>
    supabase.from('blog_posts').select('*').eq('slug', slug).single(),

  create: (data: Partial<BlogPost>) =>
    supabase.from('blog_posts').insert(data).select().single(),

  update: (id: string, data: Partial<BlogPost>) =>
    supabase.from('blog_posts').update(data).eq('id', id),
}

// ── Contact Form ─────────────────────────────────────────────
export const contactForm = {
  submit: (data: Omit<ContactForm, 'id' | 'is_read' | 'created_at'>) =>
    supabase.functions.invoke('submit-contact', { body: data }),
}

// ── Notifications ────────────────────────────────────────────
export const notifications = {
  getAll: (userId: string) =>
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),

  markRead: (id: string) =>
    supabase.from('notifications').update({ is_read: true }).eq('id', id),

  markAllRead: (userId: string) =>
    supabase.from('notifications').update({ is_read: true }).eq('user_id', userId),

  subscribe: (userId: string, callback: (payload: any) => void) =>
    supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, callback)
      .subscribe(),
}
