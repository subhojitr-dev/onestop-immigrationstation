# One Stop Immigration Station

Full-stack rebuild of [onestopimmigrationstation.com](https://onestopimmigrationstation.com)

## Stack
- **Web** — Next.js 14 + TypeScript (Vercel)
- **Mobile** — React Native + Expo (iOS + Android)
- **Backend** — Supabase Edge Functions
- **Database** — Supabase PostgreSQL
- **Auth** — Supabase Auth (JWT)
- **Storage** — Supabase Storage

## Structure
```
apps/
  web/        → Next.js public website + client portal
  mobile/     → React Native mobile app
packages/
  types/      → Shared TypeScript interfaces
  api/        → Shared Supabase API calls
  utils/      → Shared utility functions
supabase/
  functions/  → Edge Functions (replaces PHP APIs)
  migrations/ → Database schema (replaces MySQL)
```

## Getting Started
```bash
# Install dependencies
npm install

# Run web app
cd apps/web && npm run dev

# Run mobile app
cd apps/mobile && npx expo start
```

## User Roles
- **Beneficiary** — Immigration client
- **Sponsor** — Employer / petitioner
- **Contact** — Attorney / paralegal
