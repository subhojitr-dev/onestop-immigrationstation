# Session Starter Prompts

Use these prompts at the start of every Claude Code session to ensure
the AI has full context and stays within its designated scope.

---

## Session A — Web App (main branch)

```
We are continuing work on the One Stop Immigration Station project.

Repo: C:\Users\subho\onestop-immigrationstation
Live site: https://onestop-immigrationstation-web.vercel.app
Branch: main

IMPORTANT RULES FOR THIS SESSION:
- You work ONLY in apps/web/
- Never touch apps/mobile/, TODO.md, ISSUES.md, TECHNICAL.md unless I explicitly ask
- git pull before making any changes
- Run dev server from apps/web/ with: npm run dev
- Test on: http://localhost:3000

Read these files before we start:
1. C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md
2. C:\Users\subho\onestop-immigrationstation\TODO.md
3. C:\Users\subho\onestop-immigrationstation\ISSUES.md

Today's task: [describe what you want to build]
```

---

## Session B — Mobile App (mobile branch)

```
We are working on the React Native mobile app for One Stop Immigration Station.

Repo: C:\Users\subho\onestop-immigrationstation
Mobile app: apps/mobile/
Branch: mobile (run: git checkout mobile && git pull)

IMPORTANT RULES FOR THIS SESSION:
- You work ONLY in apps/mobile/ and packages/ (shared logic)
- Never touch apps/web/ unless explicitly asked
- Never edit TODO.md, ISSUES.md, TECHNICAL.md unless I explicitly ask
- git pull before making any changes
- Test using Expo Go on iPhone or Android — run: npx expo start

Read these files before we start:
1. C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md
2. C:\Users\subho\onestop-immigrationstation\TODO.md
3. C:\Users\subho\onestop-immigrationstation\TECHNICAL.md

Today's task: [describe what you want to build]
```

---

## End of Every Session (both A and B)

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

## Rules for Running Both Sessions in Parallel

| Rule | Why |
|------|-----|
| Session A stays on `main` branch | Avoids conflicts with mobile work |
| Session B stays on `mobile` branch | Keeps mobile code isolated |
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

Then switch back to web:
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
