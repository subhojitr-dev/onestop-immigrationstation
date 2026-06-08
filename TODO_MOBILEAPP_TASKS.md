# One Stop Immigration Station — Mobile App Tasks

**Last updated:** 2026-06-08  
**Branch:** `mobile`  
**Location:** `apps/mobile/`  
**Test method:** Expo Go app on iPhone or Android (free, no developer account needed)

---

## Session Starter Prompt — Mobile App

Paste this at the start of every mobile session:

```
We are building the React Native mobile app for One Stop Immigration Station.

Repo: C:\Users\subho\onestop-immigrationstation
Mobile app lives in: apps/mobile/
Branch: mobile

Setup before starting:
  git checkout mobile
  git pull

IMPORTANT RULES FOR THIS SESSION:
- Work ONLY in apps/mobile/ and packages/ (shared logic)
- Never touch apps/web/ unless explicitly asked
- Never edit TODO.md, ISSUES.md, TECHNICAL.md, TODO_MOBILEAPP_TASKS.md unless I ask
- git pull before making any changes
- Test using Expo Go on iPhone or Android — run: npx expo start from apps/mobile/

Read these files before we start:
1. C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md
2. C:\Users\subho\onestop-immigrationstation\TECHNICAL.md
3. C:\Users\subho\onestop-immigrationstation\TODO_MOBILEAPP_TASKS.md

Today's task: [describe what you want to build from the task list below]
```

---

## End of Mobile Session Checklist

Paste this before finishing:

```
Before we finish:
1. Update TODO_MOBILEAPP_TASKS.md — mark completed items, add new ones
2. Update ISSUES.md — log any mobile-specific bugs found
3. Update the memory file:
   C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md
4. Commit and push all changes to the mobile branch
5. Summarize: what was completed, what's next, any decisions needed
```

---

## One-Time Branch Setup (run once in terminal)

```bash
cd C:\Users\subho\onestop-immigrationstation
git checkout -b mobile
git push -u origin mobile
```

To switch back to web after:
```bash
git checkout main
```

---

## Key Technical Context for Mobile

- **Framework:** React Native + Expo
- **Auth:** Supabase Auth via `@supabase/supabase-js` (same as web)
- **Google OAuth:** `expo-auth-session` package
- **Navigation:** React Navigation (bottom tabs + stack)
- **Styling:** React Native StyleSheet (no CSS — must recreate navy/gold design)
- **File uploads:** Expo DocumentPicker / ImagePicker
- **Push notifications:** Expo Notifications
- **Testing:** Expo Go app (free, no Apple/Google developer account needed)
- **Shared with web:** Supabase queries, TypeScript types, questionnaire definitions, API calls

---

## Phase 1 — Setup & Foundation
**Goal:** Get a working app shell with navigation and auth

- [ ] **1.1** Initialize Expo project in `apps/mobile/`
  - `npx create-expo-app apps/mobile --template blank-typescript`
  - Install dependencies: `@supabase/supabase-js`, `@react-navigation/native`, `expo-auth-session`
  - Configure `.env` with Supabase URL + anon key

- [ ] **1.2** Move shared logic to `packages/shared/`
  - Copy `lib/supabase/` → `packages/shared/supabase/`
  - Copy `lib/questionnaire/` → `packages/shared/questionnaire/`
  - Copy TypeScript types → `packages/shared/types/`
  - Update Turborepo `packages/` config

- [ ] **1.3** Bottom tab navigation
  - Tabs: Home, Cases, Appointments, Documents, Profile
  - Admin tab (visible only for lawyer/admin role)
  - Navy/gold color scheme matching web

- [ ] **1.4** Login screen
  - Email + password fields with eye toggle
  - "Continue with Google" button (expo-auth-session)
  - Role-based redirect: admin/lawyer → Admin tab, others → Home tab
  - Forgot password link → calls same `/api/auth/forgot-password` endpoint

- [ ] **1.5** Signup screen
  - Step 1: Role selection (Beneficiary / Sponsor)
  - Step 2: Details form (name, phone, email, password with eye toggle)
  - Same Supabase auth signup as web

- [ ] **1.6** Auth persistence
  - Session stored in AsyncStorage
  - Auto-login on app reopen if session valid
  - Middleware equivalent: redirect unauthenticated to Login screen

---

## Phase 2 — Client Features
**Goal:** Core client portal screens working end-to-end

- [ ] **2.1** Dashboard Home screen
  - Live stats: active cases, upcoming appointments, open tickets
  - Quick action buttons: Book Appointment, View Cases, Upload Document
  - Welcome message with user name

- [ ] **2.2** Cases list screen
  - All cases for logged-in user (role-aware)
  - Case number, visa type, status badge, date opened
  - Tap → Case Detail screen

- [ ] **2.3** Case Detail screen
  - Case info (number, visa type, status, attorney)
  - Timeline events list (scrollable)
  - Documents attached to case (downloadable)
  - Lawyer/admin: show Add Timeline + Upload Document actions

- [ ] **2.4** Appointments screen
  - Upcoming and past appointments list
  - Status badge (Pending / Confirmed / Cancelled)
  - Location + "Join Meeting" link when confirmed
  - "Book Appointment" button → Booking screen

- [ ] **2.5** Appointment Booking screen
  - Date picker → available slots for that date
  - Time slot selector
  - Notes field
  - Confirm booking → inserts to Supabase + sends confirmation email

- [ ] **2.6** Documents screen
  - List of uploaded documents (name, type, date, size)
  - Upload button → Expo DocumentPicker
  - Download via signed Supabase Storage URL
  - Delete document

- [ ] **2.7** Support Tickets screen
  - Ticket list (subject, status, last reply date)
  - Tap → Ticket Detail (threaded replies)
  - New Ticket button → create ticket form

- [ ] **2.8** Profile screen
  - Edit name, phone
  - Lawyer/Admin: edit Gender, DOB, Qualification
  - Change Password → forgot-password flow
  - Sign Out button

---

## Phase 3 — Questionnaire Engine
**Goal:** Full visa application flow on mobile

- [ ] **3.1** Visa Type Selection screen
  - 5 visa type cards: H-1B, L-1, Green Card, K-1, Family Petition
  - Tap → starts questionnaire for that type

- [ ] **3.2** Multi-step questionnaire engine
  - Uses same `lib/questionnaire/` definitions as web
  - Step-by-step sections (one section per screen)
  - Progress bar (e.g. "Section 2 of 6")
  - Auto-save answers to Supabase on each step
  - Save & Resume — continue from last saved section
  - Conditional fields (show/hide based on previous answers)
  - Submit → status changes to "submitted"

- [ ] **3.3** Application status screen
  - List of submitted applications
  - Status badge (Submitted / Under Review / Approved etc.)
  - View answers (read-only summary)

---

## Phase 4 — Push Notifications
**Goal:** Real-time alerts for key events

- [ ] **4.1** Setup Expo Notifications
  - Request permissions on first launch
  - Register device push token in Supabase (new `push_tokens` table)

- [ ] **4.2** Notification triggers (server-side)
  - Case timeline updated → push notification to client
  - Appointment confirmed/cancelled → push notification
  - Ticket reply received → push notification
  - New case opened → push notification

- [ ] **4.3** In-app notification centre
  - Bell icon in header
  - List of recent notifications
  - Mark as read
  - Tap notification → navigate to relevant screen

---

## Phase 5 — Admin/Lawyer Mobile Screens
**Goal:** Basic admin functionality for lawyers on the go

- [ ] **5.1** Admin Cases screen
  - All cases list
  - Tap → case detail with Add Timeline action

- [ ] **5.2** Admin Applications screen
  - All submitted applications
  - Tap → application summary (read-only)
  - Change status + add notes

- [ ] **5.3** Admin Appointments screen
  - All appointments
  - Change status + add location/meeting link

- [ ] **5.4** Admin Availability screen
  - Lawyer's own slots
  - Add single slot
  - View booked slots

---

## Phase 6 — Polish & App Store
**Goal:** Production-ready app

- [ ] **6.1** Loading states and error handling
  - Skeleton screens while loading
  - Friendly error messages
  - Offline detection + graceful message

- [ ] **6.2** UI polish
  - Match web design (navy `#1a2744`, gold `#cfa94a`)
  - Consistent fonts (system font — Lora not available in React Native)
  - Smooth transitions between screens

- [ ] **6.3** iOS App Store submission
  - Apple Developer account ($99/year)
  - EAS Build: `npx eas build --platform ios`
  - App Store Connect listing

- [ ] **6.4** Google Play Store submission
  - Google Play Console ($25 one-time)
  - EAS Build: `npx eas build --platform android`
  - Play Store listing

---

## Screens Summary

| Screen | Phase | Maps to Web Page |
|--------|-------|-----------------|
| Login | 1 | /login |
| Signup | 1 | /signup |
| Dashboard Home | 2 | /dashboard |
| Cases List | 2 | /dashboard/cases |
| Case Detail | 2 | /dashboard/cases/[id] |
| Appointments | 2 | /dashboard/appointments |
| Book Appointment | 2 | /dashboard/appointments/book |
| Documents | 2 | /dashboard/documents |
| Support Tickets | 2 | /dashboard/tickets |
| Ticket Detail | 2 | /dashboard/tickets/[id] |
| Profile | 2 | /dashboard/profile |
| Visa Type Selection | 3 | /dashboard/apply |
| Questionnaire | 3 | /dashboard/apply/[visaType] |
| Application Status | 3 | (new) |
| Notifications | 4 | (new) |
| Admin Cases | 5 | /admin/cases |
| Admin Applications | 5 | /admin/applications |
| Admin Appointments | 5 | /admin/appointments |
| Admin Availability | 5 | /admin/slots |

---

## Dependencies to Install (apps/mobile/)

```bash
npx expo install @supabase/supabase-js
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npx expo install expo-auth-session expo-web-browser
npx expo install expo-document-picker expo-file-system
npx expo install expo-notifications
npx expo install @react-native-async-storage/async-storage
npx expo install expo-secure-store
npx expo install react-native-safe-area-context react-native-screens
```

---

## Known Differences vs Web

| Web | Mobile Equivalent |
|-----|------------------|
| `<div>`, `<p>`, `<span>` | `<View>`, `<Text>` |
| CSS classes / inline styles | `StyleSheet.create({})` |
| Next.js router | React Navigation |
| `<input type="file">` | `expo-document-picker` |
| Google OAuth (Supabase web) | `expo-auth-session` |
| Browser cookies for session | `AsyncStorage` + `expo-secure-store` |
| jsPDF | `expo-print` or `react-native-pdf` |
| `fetch('/api/...')` | `fetch('https://onestop-immigrationstation-web.vercel.app/api/...')` |

---

## Timeline Estimate

| Phase | Effort |
|-------|--------|
| Phase 1 — Setup & Auth | 1 week |
| Phase 2 — Client Features | 1-2 weeks |
| Phase 3 — Questionnaire | 1 week |
| Phase 4 — Push Notifications | 3-4 days |
| Phase 5 — Admin Screens | 3-4 days |
| Phase 6 — Polish & App Store | 1 week |
| **Total** | **~4-5 weeks** |
