# Custom Domain & Analytics — Plain English Guide

**Last updated:** 2026-06-19 (Session 7)

---

## Part 1: Custom Domain — onestopimmigrationstation.com

### What we had before
When the website was first deployed, it was only accessible at a long, auto-generated Vercel address:
`onestop-immigrationstation-web.vercel.app`

That works fine technically, but it looks unprofessional and clients wouldn't recognize it. The goal was to make the site live at the real business address: **onestopimmigrationstation.com**

---

### How the internet finds a website (the simple version)

When you type a web address into a browser, the internet needs to figure out *which computer* is actually hosting that website. It does this through the **Domain Name System (DNS)** — think of it like a giant phone book that converts a human-readable name (`onestopimmigrationstation.com`) into a computer's actual address (a numbered IP address like `76.76.21.21`).

Your domain name (`onestopimmigrationstation.com`) was registered and managed through **GoDaddy**. Your website files and code, however, live on **Vercel's servers**. So the job was to tell GoDaddy's phone book: *"When someone looks up onestopimmigrationstation.com, point them to Vercel."*

---

### What we changed in GoDaddy DNS

We made two changes in the GoDaddy DNS Management panel:

#### Change 1 — The root domain (`@` A record)
| Field | Before | After |
|-------|--------|-------|
| Type | A | A |
| Name | @ (means the root domain itself) | @ |
| Data | `68.178.247.189` (GoDaddy's old hosting server) | `76.76.21.21` (Vercel's server) |

**What this does:** When anyone types `onestopimmigrationstation.com` directly into their browser, they now get sent to Vercel instead of the old GoDaddy hosting server.

#### Change 2 — The `www` subdomain (CNAME record)
| Field | Before | After |
|-------|--------|-------|
| Type | CNAME | CNAME |
| Name | www | www |
| Data | `onestopimmigrationstation.com.` (pointed back to itself) | `cname.vercel-dns.com` (Vercel's routing system) |

**What this does:** When anyone types `www.onestopimmigrationstation.com`, they now get routed through Vercel's system.

#### Records we left alone
- `admin` A record — still points to GoDaddy (for cPanel hosting management)
- `mail` A record — still points to GoDaddy (for email hosting if used)
- `NS` records — these are GoDaddy's own nameservers and should never be changed
- `cpanel`, `webdisk`, `whm` CNAMEs — GoDaddy management tools, left untouched

---

### What we set up in Vercel

Once the DNS was pointed at Vercel, we told Vercel to *accept* traffic for our domain:

1. **Added the domain** in Vercel → Settings → Domains
   - Added `onestopimmigrationstation.com`
   - Vercel automatically also added `www.onestopimmigrationstation.com`

2. **Redirect rule:** Vercel was configured to redirect `onestopimmigrationstation.com` → `www.onestopimmigrationstation.com` (308 permanent redirect). This is the standard practice — the `www` version is the "real" one, and typing the domain without `www` gets you there automatically.

3. **SSL Certificate:** Vercel automatically generated a free SSL certificate (the `https://` padlock). This happened within minutes. This means all traffic is encrypted and browsers show the site as secure.

---

### What we updated in the app code (environment variable)

The app has links embedded in emails it sends out — things like:
- "Click here to set your password"
- "Click here to reset your password"
- Welcome emails with login links

These links were previously generated using the old Vercel URL. We updated the environment variable `NEXT_PUBLIC_SITE_URL` in Vercel to:

```
https://www.onestopimmigrationstation.com
```

This means all email links now use the real domain. A redeployment was triggered so the change took effect immediately.

---

### The end result

| What you type | What happens |
|---------------|-------------|
| `onestopimmigrationstation.com` | Redirects to `www.onestopimmigrationstation.com` |
| `www.onestopimmigrationstation.com` | Loads the live website from Vercel |
| `onestop-immigrationstation-web.vercel.app` | Still works (Vercel keeps this active as a backup) |

The old GoDaddy hosting server (`68.178.247.189`) is no longer serving the main website. You can cancel that GoDaddy hosting plan when it expires — the domain registration itself should be kept active (that's separate from hosting).

---

## Part 2: Vercel Analytics

### What was enabled
Vercel Analytics was enabled through the Vercel dashboard → Analytics tab (one-click enable). This is included in the free Hobby plan at no extra cost.

**Plan limits (free tier):**
- 50,000 events per month
- 30 days of data history

---

### What it tracks

Vercel Analytics collects **page view data** automatically — no code changes needed. Here is what it measures:

#### Traffic
- **Page views** — how many times each page was visited
- **Unique visitors** — how many different people visited (counted once per device/session)
- **Sessions** — a group of page views by the same person in one sitting

#### Performance (Web Vitals)
Vercel also measures how fast your site feels to real visitors:

| Metric | What it means in plain English |
|--------|-------------------------------|
| **LCP** (Largest Contentful Paint) | How long until the main content appears on screen |
| **FID** (First Input Delay) | How quickly the page responds when a visitor clicks something |
| **CLS** (Cumulative Layout Shift) | Whether the page jumps around while loading (annoying shift effect) |
| **TTFB** (Time to First Byte) | How fast the server starts responding |

These are scored Good / Needs Improvement / Poor and are the same metrics Google uses for SEO ranking.

#### Breakdown views
- **By page** — which pages get the most traffic (Homepage vs Blog vs Services etc.)
- **By country** — where your visitors are located
- **By device** — desktop vs mobile vs tablet
- **By browser** — Chrome, Safari, Firefox etc.
- **Over time** — traffic trends by day/week

---

### What it does NOT track
- It does not track individual users by name or email
- It does not use cookies or show a cookie consent banner
- It does not track behavior inside the logged-in portal (only public-facing pages)
- It is privacy-friendly and GDPR-compliant by default

---

### How to view your analytics

1. Go to **https://vercel.com** → sign in
2. Click on your project **onestop-immigrationstation-web**
3. Click **Analytics** in the left sidebar

You will see a dashboard with traffic charts, top pages, and performance scores updating in real time as visitors arrive.

---

## Summary

| What | Status | Notes |
|------|--------|-------|
| Custom domain live | ✅ | https://www.onestopimmigrationstation.com |
| SSL certificate | ✅ | Auto-generated by Vercel, renews automatically |
| www redirect | ✅ | Root domain redirects to www |
| Email links updated | ✅ | `NEXT_PUBLIC_SITE_URL` set to custom domain |
| GoDaddy hosting | ⚠️ Pending | Can be cancelled when plan expires — domain registration must be kept |
| Vercel Analytics | ✅ | Free, 50K events/month, visible in Vercel dashboard |
