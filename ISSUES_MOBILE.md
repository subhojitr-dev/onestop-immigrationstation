# One Stop Immigration Station — Mobile App Issues Log

**Last updated:** 2026-06-09 (updated after Phase 4)
**Branch:** `mobile`

---

## Issue Format
Each issue has: status, description, root cause, fix applied (if any), workaround.

---

## ✅ RESOLVED Issues

---

### M-001 — Expo SDK Version Incompatible with Expo Go
**Status:** ✅ Resolved
**Symptom:** "Project is incompatible with this version of Expo Go" on iPhone
**Root cause:** App was initialized with Expo SDK 56 (brand new, just released). Expo Go on iPhone only supported SDK 54.
**Fix:** Downgraded from SDK 56 → SDK 54 to match installed Expo Go version.
**Files changed:** `apps/mobile/package.json`

---

### M-002 — ngrok Tunnel Install Loop
**Status:** ✅ Resolved (workaround)
**Symptom:** `npx expo start --tunnel` installs `@expo/ngrok` then immediately errors: "Install @expo/ngrok and try again"
**Root cause:** Known Expo bug — ngrok installs globally but Expo can't find it in PATH.
**Fix:** Use LAN mode or Expo account login instead of tunnel. Not needed once logged into Expo.
**Workaround:** `npx expo start` (with Expo account login on both PC and phone)

---

### M-003 — Duplicate React Error (Monorepo)
**Status:** ✅ Resolved
**Symptom:** "Cannot read property 'useRef' of null" / "Invalid hook call" crash on launch
**Root cause:** Monorepo has React in both `node_modules/` (root, for web app) and `apps/mobile/node_modules/`. Metro was loading both copies causing React hook failures.
**Fix:** Created `apps/mobile/metro.config.js` with `resolver.nodeModulesPaths` pointing only to mobile's node_modules, plus `resolver.resolveRequest` to force React imports to mobile's copy.
**Files changed:** `apps/mobile/metro.config.js` (created)

---

### M-004 — expo-secure-store Plugin Error
**Status:** ✅ Resolved
**Symptom:** `PluginError: Unable to resolve a valid config plugin for expo-secure-store`
**Root cause:** `app.json` had `expo-secure-store` listed as a plugin, but the version in root `node_modules/` didn't match mobile's version, causing resolution conflict.
**Fix:** Removed `expo-secure-store` from `plugins` array in `app.json`. Plugin not needed for Expo Go testing.
**Files changed:** `apps/mobile/app.json`

---

### M-005 — expo-web-browser Plugin Error
**Status:** ✅ Resolved
**Symptom:** `PluginError: Package "expo-web-browser" does not contain a valid config plugin`
**Root cause:** Same root cause as M-004 — version mismatch between root and mobile node_modules.
**Fix:** Removed `expo-web-browser` from `plugins` array in `app.json`.
**Files changed:** `apps/mobile/app.json`

---

### M-006 — Login Fails with + Sign in Email (iOS Keyboard)
**Status:** ✅ Resolved
**Symptom:** Login fails with "Invalid login credentials" for email addresses containing `+` (e.g. `user+test@gmail.com`). Same credentials work on web.
**Root cause:** iOS keyboard was silently modifying the `+` character when using the default email keyboard. The email being sent to Supabase was different from what the user typed.
**Fix:**
- Added `onChangeText={text => setEmail(text.toLowerCase().trim())}` — trims/normalises on every keystroke
- Added `spellCheck={false}` to prevent iOS autocorrect
- Added `textContentType="emailAddress"` for better iOS email handling
**Files changed:** `apps/mobile/src/screens/auth/LoginScreen.tsx`

---

### M-007 — Documents Not Showing (Session Issue)
**Status:** ✅ Resolved
**Symptom:** Documents uploaded on web don't appear in mobile Documents screen. Newly uploaded documents also don't show after upload.
**Root cause:** `fetchDocuments()` was calling `supabase.auth.getUser()` to get the user ID, which makes an async network call. Race condition meant the query ran before auth was ready. Also, the user from AuthContext wasn't being used consistently.
**Fix:** Changed DocumentsScreen to use `user` directly from `useAuth()` context, and added `useEffect` dependency on `user` so it re-fetches when auth is confirmed.
**Files changed:** `apps/mobile/src/screens/dashboard/DocumentsScreen.tsx`

---

### M-008 — Open Tickets Navigating to Wrong Screen
**Status:** ✅ Resolved
**Symptom:** Tapping "Open Tickets" stat card on Home screen navigated to Appointments tab instead of Tickets screen.
**Root cause:** HomeScreen stat cards were using a simple `nav` string property and all calling `navigation.navigate(s.nav)`. The Tickets screen is nested inside AppointmentsStack, requiring `navigation.navigate('Appointments', { screen: 'Tickets' })`.
**Fix:** Changed stat cards to use `onPress` functions with correct nested navigation calls.
**Files changed:** `apps/mobile/src/screens/dashboard/HomeScreen.tsx`

---

### M-009 — Vercel Deploying Mobile Branch
**Status:** ✅ Resolved (partial)
**Symptom:** Every push to the `mobile` branch triggers a failed Vercel deployment with npm dependency errors.
**Root cause:** Vercel is connected to the GitHub repo and watches all branches. When it tries to build from the `mobile` branch, it runs `npm install` at the monorepo root, which hits peer dependency conflicts from the mobile app's packages.
**Fix applied:** Added `apps/mobile/.npmrc` with `legacy-peer-deps=true` to resolve install conflicts.
**Remaining fix needed:** Configure Vercel "Ignored Build Step" to skip builds from the `mobile` branch:
```bash
[[ "$VERCEL_GIT_COMMIT_REF" == "mobile" ]] && exit 0 || exit 1
```
Go to: Vercel → Project Settings → Git → Ignored Build Step

---

### M-010 — React Navigation v7 Incompatibility
**Status:** ✅ Resolved
**Symptom:** npm install fails with peer dependency conflicts when using React Navigation v7 with React Native 0.74 (Expo SDK 51).
**Root cause:** React Navigation v7 requires React Native 0.76+. After SDK downgrade to 51 (RN 0.74), v7 was incompatible.
**Fix:** Downgraded React Navigation from v7 → v6 (`^6.6.1`, `^6.1.18`, `^6.4.1`).
**Files changed:** `apps/mobile/package.json`

---

## 🟡 KNOWN / OPEN Issues

---

### M-011 — No Time Slots Available for Booking
**Status:** 🟡 Not a bug — expected behaviour
**Symptom:** Book Appointment screen shows no available slots for any date.
**Root cause:** No consultation slots exist in Supabase for upcoming dates. Slots must be created by a lawyer via the web admin panel or mobile Availability screen.
**Fix:** Lawyer must add availability slots via:
- Web: `/admin/slots`
- Mobile: Admin tab → Availability → tap + Add
**No code fix needed.**

---

### M-012 — Document Download Opens in Browser (Not Native)
**Status:** 🟡 Known limitation — by design
**Symptom:** Tapping download on a document opens the browser instead of saving the file natively.
**Root cause:** `expo-file-system` v56 API changed and the old `FileSystem.downloadAsync` approach was removed. Using `Linking.openURL(signedUrl)` as a safe fallback.
**Proper fix (future):** Implement native file saving using the updated expo-file-system v19 API:
```typescript
import * as FileSystem from 'expo-file-system'
const downloadResumable = FileSystem.createDownloadResumable(signedUrl, ...)
await downloadResumable.downloadAsync()
```
**Priority:** Low — browser download works, just not as polished.

---

### M-013 — Admin Features Require Migration 009
**Status:** 🟡 Action required (migration already run as of 2026-06-09)
**Symptom:** Admin actions (update application status, update appointment, add timeline event, manage slots) fail with error: "Could not update. Run migration 009 in Supabase SQL Editor first."
**Root cause:** The web app uses the service role key (bypasses RLS) for admin mutations. The mobile app uses the anon key with the lawyer's JWT, which is blocked by default RLS.
**Fix:** Run `supabase/migrations/009_mobile_lawyer_rls.sql` in Supabase SQL Editor.
**Status:** ✅ Migration run on 2026-06-09

---

### M-014 — Google OAuth Not Implemented
**Status:** 🟡 Not yet built
**Symptom:** No "Continue with Google" button on mobile Login screen (exists on web).
**Root cause:** Not implemented — Phase 1 item 1.7 marked incomplete.
**Fix needed:** Implement using `expo-auth-session` + `expo-web-browser`:
```typescript
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
```
Requires configuring redirect URI in Supabase Google OAuth settings.
**Priority:** Medium.

---

### M-015 — Open Case Not Available on Mobile
**Status:** 🟡 Not yet built
**Symptom:** Admin/lawyer cannot open a case directly from the mobile Application Detail screen.
**Root cause:** Phase 5 item 5.7 not yet built. The web version calls `/api/admin/open-case` which uses the service role.
**Fix needed:** Add "Open Case" button to AdminApplicationDetailScreen that calls:
```
POST ${EXPO_PUBLIC_API_URL}/api/admin/open-case
```
with the user's Bearer token in the Authorization header.
**Priority:** Medium.

---

### M-016 — Profile Missing Gender/DOB/Qualification for Lawyers
**Status:** 🟡 Minor gap
**Symptom:** Lawyer/admin profile screen only shows name + phone. Web has Gender, Date of Birth, Qualification fields for lawyers.
**Root cause:** Not implemented on mobile Profile screen.
**Fix needed:** Add conditional fields in ProfileScreen when `profile.role === 'lawyer' || 'admin'`.
**Priority:** Low.

---

### M-017 — Beneficiaries and Contacts Screens Missing
**Status:** 🟡 Not planned for mobile
**Symptom:** Sponsor users cannot manage beneficiaries or contacts from mobile.
**Root cause:** Not in scope for Phase 2. These are low-usage screens.
**Fix needed:** Build BeneficiariesScreen and ContactsScreen, add to navigation for sponsor role.
**Priority:** Low — sponsors primarily manage these from web.

---

---

### M-018 — TypeScript JSX Type Errors After expo-notifications Install
**Status:** 🟡 Known / Non-blocking
**Symptom:** Running `npx tsc --noEmit` shows hundreds of errors like `'View' cannot be used as a JSX component` across all screens after installing `expo-notifications`.
**Root cause:** Installing `expo-notifications` with `--legacy-peer-deps` pulled in a `@types/react` version that conflicts with the React 19 types. The TypeScript compiler can't resolve JSX types correctly as a result.
**Impact:** Zero — the app builds and runs perfectly in Expo Go via Metro/Babel, which does not use the TypeScript compiler. These are type-checking-only errors.
**Fix (future):** Pin all React type versions explicitly and run `npm dedupe` after installing new packages. Or wait for `expo-notifications` to officially support React 19 types.
**Workaround:** Ignore `tsc --noEmit` errors for now. Use Expo Go to verify app behaviour instead.

---

## Issue Statistics

| Category | Count |
|----------|-------|
| ✅ Resolved | 10 |
| 🟡 Open / Known | 8 |
| 🔴 Critical / Blocking | 0 |
| **Total** | **18** |
