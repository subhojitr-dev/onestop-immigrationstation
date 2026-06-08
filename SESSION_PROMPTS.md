# Session Starter Prompts

Use these prompts at the start of every Claude Code session to ensure
the AI has full context and stays within its designated scope.

**Key principle: 2-3 focused tasks per session = better quality than rushing through many.**

---

## Web App Sessions — Planned Task Batches

### Web Session 1 — Security + Lawyer Flow + Email fix
```
We are continuing work on the One Stop Immigration Station project.

Repo: C:\Users\subho\onestop-immigrationstation
Live site: https://onestop-immigrationstation-web.vercel.app
Branch: main

IMPORTANT RULES FOR THIS SESSION:
- Work ONLY in apps/web/
- Never touch apps/mobile/, TODO.md, ISSUES.md, TECHNICAL.md unless I explicitly ask
- git pull before making any changes
- Run dev server from apps/web/ with: npm run dev
- Test on: http://localhost:3000

Read these files before we start:
1. C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md
2. C:\Users\subho\onestop-immigrationstation\TODO.md
3. C:\Users\subho\onestop-immigrationstation\ISSUES.md

Today's task: Work through the items below in order.
Complete each one fully before moving to the next.
At the end of the session update TODO.md, ISSUES.md and the memory file.

1. Fix lawyer appointment visibility (security gap)
   - Lawyers see only THEIR OWN appointments in /admin/appointments
   - Admin sees ALL appointments
   - Best approach: add lawyer_id FK to appointments table, filter by it

2. Fix lawyer login flow (session isolation)
   - Add "Resend Setup Email" button to /admin/users for existing lawyers
   - Clicking it regenerates a fresh recovery link and resends welcome email via Resend
   - This fixes the case where a lawyer's link expired or failed

3. Appointment location/meeting link on confirmation email
   - When lawyer confirms and adds location/link, include it in the email to client
   - Currently client sees it in portal but email doesn't include it
```

---

### Web Session 2 — Case Management Improvements
```
We are continuing work on the One Stop Immigration Station project.

Repo: C:\Users\subho\onestop-immigrationstation
Live site: https://onestop-immigrationstation-web.vercel.app
Branch: main

IMPORTANT RULES FOR THIS SESSION:
- Work ONLY in apps/web/
- Never touch apps/mobile/, TODO.md, ISSUES.md, TECHNICAL.md unless I explicitly ask
- git pull before making any changes
- Run dev server from apps/web/ with: npm run dev
- Test on: http://localhost:3000

Read these files before we start:
1. C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md
2. C:\Users\subho\onestop-immigrationstation\TODO.md
3. C:\Users\subho\onestop-immigrationstation\ISSUES.md

Today's task: Work through the items below in order.
Complete each one fully before moving to the next.
At the end of the session update TODO.md, ISSUES.md and the memory file.

1. Create Case directly from Admin Cases page
   - "+ New Case" button on /admin/cases
   - Form: client dropdown (from users), visa type, description, assigned attorney
   - No application required — for walk-in/phone clients
   - Auto case number (OSIS-YYYY-NNN), initial timeline event "Case Opened"

2. Case Status Update from Admin
   - Lawyer can change case status from case detail page
   - Status options: open → in_progress → pending_documents → submitted → approved → denied → closed
   - Email client when status changes
```

---

### Web Session 3 — Pre-Filled USCIS PDF Forms
```
We are continuing work on the One Stop Immigration Station project.

Repo: C:\Users\subho\onestop-immigrationstation
Live site: https://onestop-immigrationstation-web.vercel.app
Branch: main

IMPORTANT RULES FOR THIS SESSION:
- Work ONLY in apps/web/
- Never touch apps/mobile/, TODO.md, ISSUES.md, TECHNICAL.md unless I explicitly ask
- git pull before making any changes
- Run dev server from apps/web/ with: npm run dev
- Test on: http://localhost:3000

Read these files before we start:
1. C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md
2. C:\Users\subho\onestop-immigrationstation\TODO.md
3. C:\Users\subho\onestop-immigrationstation\ISSUES.md

Today's task: Work through the items below in order.
Complete each one fully before moving to the next.
At the end of the session update TODO.md, ISSUES.md and the memory file.

1. Pre-Filled USCIS PDF Forms using pdf-lib
   - Install pdf-lib
   - Download official I-129 PDF, map H-1B questionnaire field answers to I-129 form fields
   - Generate pre-filled I-129 downloadable from admin application detail page
   - Extend to I-130 (Family Petition), I-129F (K-1), I-140 (Green Card) if time allows
   - Why: reduces attorney prep time from hours to minutes
```

---

### Web Session 4 — News/Videos CMS
```
We are continuing work on the One Stop Immigration Station project.

Repo: C:\Users\subho\onestop-immigrationstation
Live site: https://onestop-immigrationstation-web.vercel.app
Branch: main

IMPORTANT RULES FOR THIS SESSION:
- Work ONLY in apps/web/
- Never touch apps/mobile/, TODO.md, ISSUES.md, TECHNICAL.md unless I explicitly ask
- git pull before making any changes
- Run dev server from apps/web/ with: npm run dev
- Test on: http://localhost:3000

Read these files before we start:
1. C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md
2. C:\Users\subho\onestop-immigrationstation\TODO.md
3. C:\Users\subho\onestop-immigrationstation\ISSUES.md

Today's task: Work through the items below in order.
Complete each one fully before moving to the next.
At the end of the session update TODO.md, ISSUES.md and the memory file.

1. News/Videos CMS — post_type system
   - Add post_type column to blog_posts: article | youtube_video | uscis_news
   - Add youtube_url column to blog_posts
   - Update Blog CMS /admin/blog/new — add Post Type selector:
     * Article → publishes to /blog
     * YouTube Video → admin pastes URL + summary → publishes to /videos page
     * USCIS News → saved as draft, admin reviews/publishes → appears on /blog
   - Update /videos page to render posts where post_type=youtube_video with embedded player
   - Archive logic: posts > 90 days → archived section, > 1 year → deleted
   - Add collapsible Archive section on /blog and /videos

2. USCIS RSS auto-import
   - Vercel cron job — daily fetch of USCIS RSS feed
   - Insert new items as drafts (post_type=uscis_news, is_published=false)
   - Admin notified of new drafts awaiting review
   - Decisions: Admin approves only (not lawyer), USCIS RSS → Draft first
```

---

### Web Session 5 — Blog Filtering + Notifications
```
We are continuing work on the One Stop Immigration Station project.

Repo: C:\Users\subho\onestop-immigrationstation
Live site: https://onestop-immigrationstation-web.vercel.app
Branch: main

IMPORTANT RULES FOR THIS SESSION:
- Work ONLY in apps/web/
- Never touch apps/mobile/, TODO.md, ISSUES.md, TECHNICAL.md unless I explicitly ask
- git pull before making any changes
- Run dev server from apps/web/ with: npm run dev
- Test on: http://localhost:3000

Read these files before we start:
1. C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md
2. C:\Users\subho\onestop-immigrationstation\TODO.md
3. C:\Users\subho\onestop-immigrationstation\ISSUES.md

Today's task: Work through the items below in order.
Complete each one fully before moving to the next.
At the end of the session update TODO.md, ISSUES.md and the memory file.

1. Blog Category/Archive Filtering
   - Wire sidebar category links on /blog to filter posts by category
   - Add pagination (currently loads 20 max — add Next/Prev page buttons)

2. Real-Time In-Portal Notifications
   - Bell icon in portal topbar (dashboard + admin layouts)
   - Wired to existing notifications table in Supabase
   - Shows unread count badge on bell icon
   - Dropdown list of recent notifications
   - Mark as read on click
   - Notification triggers: case timeline updated, appointment confirmed, ticket reply received
```

---

## Mobile App Session — Phase 1 + 2
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

Today's task: Work through Phase 1 and Phase 2 from TODO_MOBILEAPP_TASKS.md in order.
Complete each task fully before moving to the next.
At the end of the session run the End of Session Checklist from TODO_MOBILEAPP_TASKS.md.
```

---

## End of Every Session (both Web and Mobile)

Paste this before finishing any session:

```
Before we finish this session:
1. Update TODO.md — mark completed items, add any new ones discovered
2. Update ISSUES.md — log any new bugs or workarounds found
3. Update the memory file:
   C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md
4. Commit and push all changes to GitHub
5. Give me a summary: what was completed, what's next, any decisions needed
```

---

## Web Session Order (recommended)

| Session | Tasks | Estimated Time |
|---------|-------|---------------|
| Web Session 1 | Security fix + Lawyer login + Email fix | 1 session |
| Web Session 2 | Create Case + Case Status Update | 1 session |
| Web Session 3 | Pre-filled USCIS PDF forms | 1-2 sessions |
| Web Session 4 | News/Videos CMS + USCIS RSS | 1-2 sessions |
| Web Session 5 | Blog filtering + Notifications | 1 session |
| Mobile Session 1 | Phase 1 + 2 (Setup + Client screens) | 2-3 sessions |
| Mobile Session 2 | Phase 3 (Questionnaire engine) | 1-2 sessions |
| Mobile Session 3 | Phase 4 + 5 (Notifications + Admin) | 1-2 sessions |
| Mobile Session 4 | Phase 6 (Polish + App Store) | 1 session |

---

## Rules for Running Both Sessions in Parallel

| Rule | Why |
|------|-----|
| Web session stays on `main` branch | Avoids conflicts with mobile work |
| Mobile session stays on `mobile` branch | Keeps mobile code isolated |
| Always `git pull` at session start | Picks up changes from the other session |
| Only ONE session does DB migrations at a time | Prevents schema conflicts |
| Shared files (TODO.md, ISSUES.md, TECHNICAL.md) — update at end of session only | Prevents overwrites |
| If Git conflict occurs — resolve before continuing | Never force push |

---

## Branch Setup (run once before starting mobile sessions)

```bash
cd C:\Users\subho\onestop-immigrationstation
git checkout -b mobile
git push -u origin mobile
```

Switch back to web after:
```bash
git checkout main
```

---

## Key Credentials (for reference)

| Item | Value |
|------|-------|
| Supabase URL | https://xrhmnyyrufahqaintmvt.supabase.co |
| Live site | https://onestop-immigrationstation-web.vercel.app |
| Vercel | vercel.com → subhojitr-dev's projects |
| Resend | resend.com → key "onestop-immigration" |
| GitHub | github.com/subhojitr-dev/onestop-immigrationstation |
| Local dev | http://localhost:3000 (run from apps/web/) |
| Memory file | C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md |
