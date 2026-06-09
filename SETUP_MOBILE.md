# One Stop Immigration Station — Mobile App Setup Guide

**Last updated:** 2026-06-09 (all phases complete except Phase 6)
**Branch:** `mobile`
**Location:** `apps/mobile/`
**Framework:** React Native + Expo SDK 54

---

## 1. Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18+ | nodejs.org |
| npm | 9+ | comes with Node |
| Git | any | git-scm.com |
| Expo CLI | latest | `npm install -g expo-cli` |
| EAS CLI | latest | `npm install -g eas-cli` |

---

## 2. First-Time Setup

### Step 1 — Clone the repo and switch to mobile branch
```bash
git clone https://github.com/subhojitr-dev/onestop-immigrationstation.git
cd onestop-immigrationstation
git checkout mobile
```

### Step 2 — Install mobile dependencies
```bash
cd apps/mobile
npm install --legacy-peer-deps
```

### Step 3 — Environment variables
The `.env` file is already in `apps/mobile/` with:
```
EXPO_PUBLIC_SUPABASE_URL=https://xrhmnyyrufahqaintmvt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_H2HNWNkpsWmcqNZrVYIHLg_ZQufiUXg
EXPO_PUBLIC_API_URL=https://onestop-immigrationstation-web.vercel.app
```
⚠️ Never commit secret keys. The anon key is safe to expose (it's public).

### Step 4 — Run Supabase migrations
Go to **Supabase Dashboard → SQL Editor** and run each file in order:

| File | Purpose | Status |
|------|---------|--------|
| `009_mobile_lawyer_rls.sql` | Lawyers can update apps/appointments/timeline/slots | ✅ Run |
| `010_push_notifications.sql` | push_tokens + notifications tables | ✅ Run |
| `011_lawyer_create_cases.sql` | Lawyers can create/update cases directly | ✅ Run |

### Step 5 — Configure Google OAuth redirect (for Google login)
Go to **Supabase Dashboard → Authentication → URL Configuration → Redirect URLs**
Add: `onestop-immigration://`

This allows the mobile app to redirect back after Google sign-in.

---

## 3. Running the App (Development)

### Start the dev server
```bash
cd apps/mobile
npx expo start
```

### Test on iPhone (Expo Go)
1. Install **Expo Go** from the App Store (free)
2. Create a free account at **expo.dev**
3. Log into Expo Go on your phone
4. Log into Expo on your PC: `npx expo login`
5. Run `npx expo start` — your project appears in Expo Go automatically
6. Tap the project to open it

### Test on Android
Same as above but install **Expo Go** from Google Play Store.

### Web preview (limited)
Press **`w`** in the terminal while the server is running.
Note: Web mode doesn't fully replicate mobile behaviour.

---

## 4. Key Files Reference

| File | Purpose |
|------|---------|
| `apps/mobile/App.tsx` | Root component — wraps AuthProvider + AppNavigator |
| `apps/mobile/app.json` | Expo config — app name, slug, icons, plugins |
| `apps/mobile/metro.config.js` | Metro bundler config — fixes duplicate React in monorepo |
| `apps/mobile/.env` | Expo env vars (EXPO_PUBLIC_*) |
| `apps/mobile/.npmrc` | `legacy-peer-deps=true` — needed for monorepo install |
| `apps/mobile/src/lib/supabase.ts` | Supabase client with AsyncStorage session |
| `apps/mobile/src/lib/AuthContext.tsx` | Auth provider — session, user, profile, role |
| `apps/mobile/src/navigation/index.tsx` | Navigation — ClientTabs vs AdminTabs based on role |
| `apps/mobile/src/theme/index.ts` | Navy/gold design system constants |
| `apps/mobile/src/questionnaire/` | Visa questionnaire definitions (copied from web) |
| `apps/mobile/src/screens/auth/` | Login, Signup screens |
| `apps/mobile/src/screens/dashboard/` | All client-facing screens |
| `apps/mobile/src/screens/apply/` | Visa application questionnaire screens |
| `apps/mobile/src/screens/admin/` | Lawyer/admin management screens |
| `apps/mobile/src/screens/notifications/` | In-app notification centre |
| `apps/mobile/src/lib/notifications.ts` | Push token registration + badge helpers |
| `apps/web/lib/push/sendPush.ts` | Server-side Expo push notification sender |

---

## 5. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81.5 |
| Build tool | Expo SDK 54 |
| Language | TypeScript 5.3 |
| Navigation | React Navigation v6 (stack + bottom tabs) |
| Auth + Database | Supabase (`@supabase/supabase-js` v2) |
| Session storage | AsyncStorage |
| File upload | expo-document-picker |
| Push notifications | expo-notifications (foreground in Expo Go, background needs EAS build) |
| Secure storage | expo-secure-store |
| Env vars | Expo public env vars (EXPO_PUBLIC_*) |

---

## 6. Navigation Structure

### Client users (beneficiary / sponsor / contact)
```
Bottom Tabs: Home | Cases | Apply | Appointments | Profile
  Home → HomeScreen, DocumentsScreen
  Cases → CasesScreen, CaseDetailScreen
  Apply → VisaSelectionScreen, QuestionnaireScreen, ApplicationStatusScreen
  Appointments → AppointmentsScreen, BookAppointmentScreen,
                 TicketsScreen, TicketDetailScreen, NewTicketScreen
  Profile → ProfileScreen
```

### Lawyer / Admin users
```
Bottom Tabs: Admin | Cases | Appointments | Apply | Profile
  Admin → AdminHomeScreen, AdminApplicationsScreen,
          AdminApplicationDetailScreen, AdminAppointmentsScreen,
          AdminAvailabilityScreen
  Cases → CasesScreen (shows ALL cases), CaseDetailScreen (+ Timeline button)
  Appointments → AppointmentsScreen (shows ALL appointments), BookAppointmentScreen
  Apply → VisaSelectionScreen, QuestionnaireScreen, ApplicationStatusScreen
  Profile → ProfileScreen
```

---

## 7. Supabase Migrations Required

| Migration | File | Status |
|-----------|------|--------|
| 001–008 | `supabase/migrations/` | ✅ Already run |
| 009 | `009_mobile_lawyer_rls.sql` | ✅ Run 2026-06-09 |
| 010 | `010_push_notifications.sql` | ✅ Run 2026-06-09 |
| 011 | `011_lawyer_create_cases.sql` | ✅ Run 2026-06-09 |

Migration 009 adds RLS policies so lawyers can directly update:
- `applications` (status + notes)
- `appointments` (status + location + meeting link)
- `case_timeline` (insert timeline events)
- `consultation_slots` (manage own slots)

Migration 010 creates:
- `push_tokens` table — stores Expo push tokens per user/device
- `notifications` table — stores in-app notification history with read/unread status

Migration 011 adds:
- RLS policy: lawyers can INSERT new cases
- RLS policy: lawyers can UPDATE case status

---

## 8. Sharing with Testers (Free — Expo Go)

```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Log in to Expo
npx expo login

# Publish update to Expo's cloud
npx eas update --branch mobile --message "Latest build"
```

Testers need:
1. **Expo Go** app installed (free)
2. Free **expo.dev** account
3. Your project link: `exp.host/@subhojitr/onestop-immigration`

---

## 9. Publishing to App Store (Future)

### iOS (requires $99/year Apple Developer account)
```bash
# Configure EAS
npx eas build:configure

# Build iOS app
npx eas build --platform ios

# Submit to App Store
npx eas submit --platform ios
```

### Android (requires $25 one-time Google Play account)
```bash
npx eas build --platform android
npx eas submit --platform android
```

---

## 10. Vercel Configuration

The mobile app is **never deployed to Vercel**. Vercel only handles the web app.

To stop Vercel from trying to build the mobile branch:
1. Go to **vercel.com** → your project → **Settings → Git**
2. In **"Ignored Build Step"** add:
   ```bash
   [[ "$VERCEL_GIT_COMMIT_REF" == "mobile" ]] && exit 0 || exit 1
   ```

---

## 11. Common Commands

```bash
# Start dev server
cd apps/mobile && npx expo start

# Start with cache cleared (fixes most weird errors)
cd apps/mobile && npx expo start --clear

# TypeScript check
cd apps/mobile && npx tsc --noEmit

# Install a new package (use expo install for native packages)
cd apps/mobile && npx expo install <package-name>

# Regular npm packages
cd apps/mobile && npm install <package-name> --legacy-peer-deps

# Push to mobile branch
git add . && git commit -m "your message" && git push origin mobile
```

---

## 12. Known Gotchas

- Always use `npm install --legacy-peer-deps` (not plain `npm install`) in `apps/mobile/`
- Expo env vars MUST be prefixed with `EXPO_PUBLIC_` to be accessible in the app
- `npx expo start --clear` fixes most caching issues
- The duplicate React error (monorepo issue) is fixed by `metro.config.js` — don't delete it
- Document download opens in browser (not native download) — this is intentional
- API calls to web backend use `EXPO_PUBLIC_API_URL` pointing to Vercel
- Lawyers/admins need migrations 009, 010, 011 run before all features work on mobile
- Login: email field uses `.toLowerCase().trim()` to handle iOS keyboard autocorrect
- Google OAuth: requires `onestop-immigration://` added to Supabase redirect URLs
- Google OAuth: background redirect only works in Expo Go if URL scheme is registered in app.json
