# One Stop Immigration Station — Mobile App Tasks

**Last updated:** 2026-06-09
**Branch:** `mobile`
**Location:** `apps/mobile/`
**Test method:** Expo Go app on iPhone or Android (free, no developer account needed)
**Expo SDK:** 54 (Expo Go on iPhone supports SDK 54)

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
4. C:\Users\subho\onestop-immigrationstation\SETUP_MOBILE.md
5. C:\Users\subho\onestop-immigrationstation\ISSUES_MOBILE.md

Today's task: [describe what you want to build from the task list below]
```

---

## End of Mobile Session Checklist

Paste this before finishing:

```
Before we finish:
1. Update TODO_MOBILEAPP_TASKS.md — mark completed items, add new ones
2. Update ISSUES_MOBILE.md — log any mobile-specific bugs found
3. Update the memory file:
   C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md
4. Commit and push all changes to the mobile branch
5. Summarize: what was completed, what's next, any decisions needed
```

---

## One-Time Branch Setup (already done)

```bash
cd C:\Users\subho\onestop-immigrationstation
git checkout mobile   # already exists
git pull
```

---

## Key Technical Context for Mobile

- **Framework:** React Native + Expo SDK 54
- **Expo Go compatibility:** SDK 54 ✅ (iPhone Expo Go version)
- **Auth:** Supabase Auth via `@supabase/supabase-js` (same as web)
- **Navigation:** React Navigation v6 (bottom tabs + stack)
- **Styling:** React Native StyleSheet (navy `#1a2744` + gold `#cfa94a`)
- **File uploads:** expo-document-picker
- **Session storage:** AsyncStorage
- **Install command:** `npm install --legacy-peer-deps` (always use this in apps/mobile/)
- **Shared with web:** Questionnaire definitions (copied to `apps/mobile/src/questionnaire/`)
- **API calls:** `EXPO_PUBLIC_API_URL` → Vercel web app for email/auth API routes

---

## Phase 1 — Setup & Foundation ✅ COMPLETE
**Goal:** Get a working app shell with navigation and auth

- [x] **1.1** Initialize Expo project in `apps/mobile/`
  - Expo SDK 54, blank-typescript template
  - All dependencies installed with `--legacy-peer-deps`
  - `.env` configured with Supabase URL + anon key + API URL

- [x] **1.2** Move shared logic to `packages/shared/`
  - Questionnaire definitions copied to `apps/mobile/src/questionnaire/`
  - `packages/shared/` has questionnaire types for future use

- [x] **1.3** Bottom tab navigation
  - **Client tabs:** Home | Cases | Apply | Appointments | Profile
  - **Admin/Lawyer tabs:** Admin | Cases | Appointments | Apply | Profile
  - Role-based tab switching — lawyer/admin get Admin tab automatically
  - Navy/gold color scheme matching web

- [x] **1.4** Login screen
  - Email + password with eye toggle
  - Forgot password → calls `/api/auth/forgot-password` on Vercel
  - Role-based navigation: admin/lawyer → AdminTabs, others → ClientTabs
  - Fix: `toLowerCase().trim()` + `spellCheck={false}` for iOS keyboard issues

- [x] **1.5** Signup screen
  - Step 1: Role selection (Beneficiary / Sponsor)
  - Step 2: Details form (name, phone, email, password with eye toggle)
  - Creates Supabase auth user + profile row

- [x] **1.6** Auth persistence
  - Session stored in AsyncStorage
  - Auto-login on app reopen via `supabase.auth.getSession()`
  - Unauthenticated users redirected to Login screen

- [ ] **1.7** Google OAuth *(not yet built)*
  - Requires `expo-auth-session` setup
  - Lower priority — email/password works fine

---

## Phase 2 — Client Features ✅ COMPLETE
**Goal:** Core client portal screens working end-to-end

- [x] **2.1** Dashboard Home screen
  - Live stats: active cases, upcoming appointments, open tickets, documents
  - Quick action buttons: Apply for Visa, Book Appointment, Upload Document, Support Ticket
  - Welcome message with user name and role badge
  - Admin/lawyer: sees system-wide stats

- [x] **2.2** Cases list screen
  - Role-aware: clients see own cases, admin/lawyer see all cases
  - Case number, visa type, status badge, date opened
  - Tap → Case Detail screen

- [x] **2.3** Case Detail screen
  - Case info (number, visa type, status, attorney)
  - Timeline events list (scrollable, gold dots)
  - **Lawyer/admin:** + Timeline button → modal to add event with description

- [x] **2.4** Appointments screen
  - Role-aware: clients see own, admin/lawyer see all
  - Status badge (Pending / Confirmed / Cancelled)
  - Location + "Join Meeting" link when confirmed
  - "Book Appointment" button in header

- [x] **2.5** Appointment Booking screen
  - 14-day horizontal date picker
  - Available slots loaded per date from Supabase
  - Notes field
  - Confirm booking → inserts to Supabase + triggers email

- [x] **2.6** Documents screen
  - List of uploaded documents (name, type, date, size)
  - Upload via expo-document-picker → Supabase Storage → documents table
  - Download via signed Supabase Storage URL (opens in browser)
  - Delete document (storage + table)

- [x] **2.7** Support Tickets screen
  - Ticket list with status badges
  - Tap → Ticket Detail (chat-style threaded replies)
  - New Ticket button → create ticket form

- [x] **2.8** Profile screen
  - Edit name, phone
  - Change Password → forgot-password flow
  - Sign Out button
  - Shows role badge

---

## Phase 3 — Questionnaire Engine ✅ COMPLETE
**Goal:** Full visa application flow on mobile

- [x] **3.1** Visa Type Selection screen
  - 5 visa type cards: H-1B, L-1, Green Card, K-1, Family Petition
  - Shows IN PROGRESS badge for drafts, SUBMITTED for completed
  - Link to My Applications

- [x] **3.2** Multi-step questionnaire engine
  - Uses same questionnaire definitions as web (all 5 visa types)
  - All field types: text, email, tel, number, select, radio, textarea, date, checkbox, heading, info
  - Conditional showIf logic (fields shown/hidden based on previous answers)
  - Progress bar at top (Section X of Y)
  - Auto-save after each section to Supabase applications table
  - Save & Resume — continues from last saved section
  - Submit → status changes to 'submitted' + email notification

- [x] **3.3** Application Status screen
  - List of all applications with status badges
  - Attorney notes displayed when present
  - Resume Draft button for in-progress applications

---

## Phase 4 — Push Notifications ⬜ NOT STARTED
**Goal:** Real-time alerts for key events

- [ ] **4.1** Setup Expo Notifications
  - Request permissions on first launch
  - Register device push token in Supabase (new `push_tokens` table)

- [ ] **4.2** Notification triggers (server-side)
  - Case timeline updated → push to client
  - Appointment confirmed/cancelled → push to client
  - Ticket reply received → push to client
  - New case opened → push to client

- [ ] **4.3** In-app notification centre
  - Bell icon in header
  - List of recent notifications
  - Mark as read
  - Tap → navigate to relevant screen

---

## Phase 5 — Admin/Lawyer Mobile Screens ✅ COMPLETE
**Goal:** Basic admin functionality for lawyers on the go

- [x] **5.1** Admin Home screen
  - Stats: active cases, pending applications, today's appointments, open tickets
  - Quick links to all admin sections

- [x] **5.2** Admin Applications screen
  - All applications filterable by status (submitted / under_review / info_requested / all)
  - Tap → Application Detail

- [x] **5.3** Admin Application Detail screen
  - View full questionnaire answers
  - Change status (submitted / under_review / info_requested / approved / rejected)
  - Add/edit attorney notes
  - Save changes directly via Supabase (requires migration 009)

- [x] **5.4** Admin Appointments screen
  - All appointments list
  - Tap → inline edit modal
  - Update status (pending / confirmed / cancelled / completed)
  - Add location + meeting link when confirming

- [x] **5.5** Admin Availability screen
  - View all upcoming slots (own only)
  - Add new slot: horizontal date picker (14 days) + time grid
  - Delete unbooked slots
  - See booked slots with client name

- [x] **5.6** Case Detail: Lawyer actions
  - + Timeline button visible for lawyer/admin only
  - Modal to add event title + description
  - Saves directly to case_timeline table

- [ ] **5.7** Open Case from application *(not yet built)*
  - Button on Application Detail to open a case directly from mobile
  - Equivalent to web's "Open Case" button

---

## Phase 6 — Polish & App Store ⬜ NOT STARTED
**Goal:** Production-ready app

- [ ] **6.1** Loading states and error handling
  - Skeleton screens while loading
  - Friendly error messages
  - Offline detection + graceful message

- [ ] **6.2** UI polish
  - Review all screens on different iPhone sizes
  - Smooth transitions
  - Empty state illustrations

- [ ] **6.3** iOS App Store submission
  - Apple Developer account ($99/year)
  - `npx eas build:configure`
  - `npx eas build --platform ios`
  - App Store Connect listing

- [ ] **6.4** Google Play Store submission
  - Google Play Console ($25 one-time)
  - `npx eas build --platform android`
  - Play Store listing

- [ ] **6.5** Share with testers via Expo (free)
  - `npx eas update --branch mobile --message "v1 beta"`
  - Share link with testers who have Expo Go

---

## Screens Summary

| Screen | Phase | Status | Maps to Web |
|--------|-------|--------|-------------|
| Login | 1 | ✅ | /login |
| Signup | 1 | ✅ | /signup |
| Dashboard Home | 2 | ✅ | /dashboard |
| Cases List | 2 | ✅ | /dashboard/cases |
| Case Detail | 2 | ✅ + lawyer actions | /dashboard/cases/[id] |
| Appointments | 2 | ✅ | /dashboard/appointments |
| Book Appointment | 2 | ✅ | /dashboard/appointments/book |
| Documents | 2 | ✅ | /dashboard/documents |
| Support Tickets | 2 | ✅ | /dashboard/tickets |
| Ticket Detail | 2 | ✅ | /dashboard/tickets/[id] |
| New Ticket | 2 | ✅ | /dashboard/tickets/new |
| Profile | 2 | ✅ | /dashboard/profile |
| Visa Type Selection | 3 | ✅ | /dashboard/apply |
| Questionnaire | 3 | ✅ | /dashboard/apply/[visaType] |
| Application Status | 3 | ✅ | (new) |
| Push Notifications | 4 | ⬜ | (new) |
| Admin Home | 5 | ✅ | /admin |
| Admin Applications | 5 | ✅ | /admin/applications |
| Admin App Detail | 5 | ✅ | /admin/applications/[id] |
| Admin Appointments | 5 | ✅ | /admin/appointments |
| Admin Availability | 5 | ✅ | /admin/slots |
| Open Case (mobile) | 5 | ⬜ | /admin/applications/[id] |
| Google OAuth | 1 | ⬜ | /login (Google button) |

---

## Dependencies Installed (apps/mobile/)

```json
{
  "@react-native-async-storage/async-storage": "2.2.0",
  "@react-navigation/bottom-tabs": "^6.6.1",
  "@react-navigation/native": "^6.1.18",
  "@react-navigation/stack": "^6.4.1",
  "@supabase/supabase-js": "^2.108.0",
  "expo": "~54.0.0",
  "expo-auth-session": "~7.0.11",
  "expo-document-picker": "~14.0.8",
  "expo-file-system": "~19.0.23",
  "expo-secure-store": "~15.0.8",
  "expo-status-bar": "~3.0.9",
  "expo-web-browser": "~15.0.11",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0"
}
```

---

## Timeline Estimate (Remaining)

| Phase | Effort | Status |
|-------|--------|--------|
| Phase 1 — Setup & Auth | Done | ✅ |
| Phase 2 — Client Features | Done | ✅ |
| Phase 3 — Questionnaire | Done | ✅ |
| Phase 4 — Push Notifications | 3-4 days | ⬜ |
| Phase 5 — Admin Screens | Done | ✅ |
| Phase 6 — Polish & App Store | 1 week | ⬜ |
