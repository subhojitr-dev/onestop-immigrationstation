# One Stop Immigration Station — TODO Tasks

Last updated: 2026-06-04

---

## 🔴 HIGH PRIORITY — Complete Before Launch

### 1. Forgot Password Page
- [ ] Build `/forgot-password` page
- [ ] Build `/reset-password` page (handles the reset link from email)
- [ ] Wire up Supabase `resetPasswordForEmail()`
- [ ] Test the full reset flow

### 2. Email Delivery (Resend.com)
- [ ] Sign up at resend.com and get API key
- [ ] Verify domain `onestopimmigrationstation.com` in Resend
- [ ] Configure SMTP settings in Supabase → Authentication → Emails
- [ ] Re-enable "Confirm email" toggle in Supabase
- [ ] Test confirmation email delivery
- [ ] Test password reset email delivery

### 3. Dashboard — Cases Page
- [ ] Build `/dashboard/cases` — list all cases with status filters
- [ ] Build `/dashboard/cases/[id]` — case detail with timeline
- [ ] Wire up to Supabase `cases` and `case_timeline` tables
- [ ] Role-based view: sponsor sees their beneficiaries' cases, beneficiary sees own cases

### 4. Dashboard — Appointments Page
- [ ] Build `/dashboard/appointments` — list upcoming + past appointments
- [ ] Build booking form — select date/time from `consultation_slots` table
- [ ] Show "2 free consultations" counter per user
- [ ] Wire up to Supabase `appointments` table

### 5. Dashboard — Documents Page
- [ ] Build `/dashboard/documents` — list uploaded documents
- [ ] File upload using Supabase Storage
- [ ] Download/delete documents
- [ ] Organize by case

### 6. Dashboard — Profile Page
- [ ] Build `/dashboard/profile` — view and edit profile
- [ ] Update name, phone, avatar
- [ ] Show role badge
- [ ] Change password option

---

## 🟡 MEDIUM PRIORITY — Sponsor Features

### 7. Dashboard — Beneficiaries Page (Sponsor only)
- [ ] Build `/dashboard/beneficiaries` — list sponsored beneficiaries
- [ ] Add new beneficiary form
- [ ] Edit beneficiary details
- [ ] View beneficiary's cases
- [ ] Wire up to Supabase `beneficiaries` table

### 8. Dashboard — Contacts Page (Sponsor only)
- [ ] Build `/dashboard/contacts` — HR contacts at company
- [ ] Add/edit/delete contacts
- [ ] Wire up to Supabase `contacts` table

### 9. Support Tickets
- [ ] Build `/dashboard/tickets` — list support tickets
- [ ] Create new ticket form
- [ ] View ticket replies
- [ ] Wire up to `support_tickets` and `ticket_replies` tables

---

## 🟢 LOWER PRIORITY — Nice to Have

### 10. Admin Panel
- [ ] Build `/admin` — admin-only dashboard
- [ ] View all users, cases, appointments
- [ ] Assign cases to lawyers
- [ ] Manage consultation slots

### 11. Lawyer Portal
- [ ] Build lawyer-specific dashboard views
- [ ] View assigned cases
- [ ] Add case timeline events
- [ ] Upload documents to cases

### 12. Blog CMS
- [ ] Connect blog page to Supabase `blog_posts` table
- [ ] Admin can create/edit/delete posts
- [ ] Dynamic blog post pages `/blog/[slug]`

---

## 📱 MOBILE APP

### 13. React Native Setup
- [ ] Set up Expo in `apps/mobile/`
- [ ] Configure Turborepo to include mobile app
- [ ] Set up shared packages (types, API calls)
- [ ] Supabase auth in React Native

### 14. Mobile Screens
- [ ] Login / Signup screens
- [ ] Dashboard home screen
- [ ] Cases list + detail screens
- [ ] Appointments screen
- [ ] Documents screen
- [ ] Profile screen

### 15. Mobile Publishing
- [ ] Set up EAS Build (Expo Application Services)
- [ ] iOS App Store submission
- [ ] Google Play Store submission

---

## 🌐 INFRASTRUCTURE

### 16. Custom Domain
- [ ] Go to Vercel → project → Settings → Domains
- [ ] Add `onestopimmigrationstation.com`
- [ ] Update DNS at domain registrar:
  - A record → `76.76.21.21`
  - CNAME www → `cname.vercel-dns.com`
- [ ] Verify SSL certificate auto-provisioned

### 17. Production Email
- [ ] Set up `noreply@onestopimmigrationstation.com` in Resend
- [ ] Update email templates in Supabase with branding

### 18. Analytics
- [ ] Enable Vercel Analytics (free)
- [ ] Add Google Analytics or Plausible

---

## ✅ COMPLETED

- [x] GitHub repo created
- [x] Turborepo monorepo structure
- [x] Supabase project — 14 tables, RLS, storage
- [x] Claude Design integrated into Next.js
- [x] All 6 public pages (/, /blog, /success-stories, /videos, /press-media, /contact)
- [x] Deployed to Vercel — https://onestop-immigrationstation-web.vercel.app
- [x] Login page (email + Google OAuth)
- [x] Signup page (2-step with role selection)
- [x] Dashboard home page (protected, role-aware)
- [x] Auth callback route
- [x] Route protection middleware
- [x] Google OAuth — Google Cloud project + Supabase provider enabled
- [x] Tested signup/login — working
- [x] SETUP.md documentation
- [x] MEMORY.md context file
