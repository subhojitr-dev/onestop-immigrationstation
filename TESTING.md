# One Stop Immigration Station — Master Test Plan

**Last updated:** 2026-06-09 (updated for Web Sessions 3–5)  
**Purpose:** Complete test checklist for every feature — both implemented and planned.  
**Update this file** as new features are built and test results are recorded.

---

## How to Use This Document

- ✅ = Tested and passing  
- ❌ = Tested and failing (add note with error)  
- ⬜ = Not yet tested  
- 🔜 = Feature not yet built — test cases written in advance  
- Add your name/date next to any result you record

---

## Pre-Test Setup Checklist

Before running any tests, confirm:

- [ ] Dev server running: `cd C:\Users\subho\onestop-immigrationstation\apps\web && npm run dev`
- [ ] Browser open at: http://localhost:3000
- [ ] Supabase dashboard open: https://xrhmnyyrufahqaintmvt.supabase.co
- [ ] `.env.local` has `RESEND_API_KEY=re_JHfjmV6e...` (your full key)
- [ ] Migration 003 run in Supabase SQL Editor (consultation_slots table created)
- [ ] Migration 008 run (lawyer_id on appointments + RLS policy)
- [ ] Migration 010 run (push_tokens + notifications table — mobile session)
- [ ] Migration 012 run (blog post_type, youtube_url, source_url columns)
- [ ] CRON_SECRET set in Vercel env vars (protects /api/cron/uscis-rss)
- [ ] Test email inbox ready (subhojitr@gmail.com)
- [ ] Have two browser tabs ready: one logged in as **client**, one as **lawyer/admin**

---

## Section 1 — Public Website

### 1.1 Homepage ( / )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 1.1.1 | Visit http://localhost:3000 | Page loads with navy/gold design, hero section visible | ⬜ |
| 1.1.2 | Scroll down | All sections appear (no invisible/missing content) | ⬜ |
| 1.1.3 | Click "Free Consultation" button | Navigates to /contact or /login | ⬜ |
| 1.1.4 | Click nav links (Blog, Videos, etc.) | Each page loads correctly | ⬜ |
| 1.1.5 | Test on mobile width (375px) | Mobile nav hamburger works | ⬜ |

### 1.2 Blog ( /blog ) — Category Filtering + Pagination
| # | Test | Expected | Result |
|---|------|----------|--------|
| 1.2.1 | Visit /blog | Shows posts from Supabase (or fallback if DB empty) | ⬜ |
| 1.2.2 | Create article post via /admin/blog → visit /blog | New post appears in list | ⬜ |
| 1.2.3 | Click a post slug | Navigates to /blog/[slug] with full content | ⬜ |
| 1.2.4 | Click a category link in sidebar | URL becomes /blog?category=X, only that category shown | ⬜ |
| 1.2.5 | Click "All Categories" link | Returns to unfiltered /blog | ⬜ |
| 1.2.6 | Sidebar shows live counts | Each category has a number next to it from DB | ⬜ |
| 1.2.7 | Active category highlighted | Selected category link appears bold/highlighted | ⬜ |
| 1.2.8 | Category with no posts | Empty state message + "View all posts" link shown | ⬜ |
| 1.2.9 | More than 8 posts exist | Pagination buttons appear: Prev / Page X of Y / Next | ⬜ |
| 1.2.10 | Click Next page | URL becomes ?page=2, different posts shown | ⬜ |
| 1.2.11 | Category + pagination | /blog?category=H-1B&page=2 works correctly | ⬜ |
| 1.2.12 | Visit /blog/nonexistent-slug | 404 page shown | ⬜ |
| 1.2.13 | Posts > 90 days old | Appear in collapsible Archive section at bottom | ⬜ |
| 1.2.14 | USCIS News posts | Show with "🏛️ USCIS Updates" banner above list | ⬜ |

### 1.3 Videos ( /videos )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 1.3.1 | Visit /videos with no videos in DB | "Coming Soon" placeholder and preview cards shown | ⬜ |
| 1.3.2 | Create YouTube Video post in CMS | Paste YouTube URL → embed preview appears in form | ⬜ |
| 1.3.3 | Publish video post → visit /videos | YouTube iframe embedded on page, plays in browser | ⬜ |
| 1.3.4 | Invalid YouTube URL in form | Red error shown below URL field | ⬜ |
| 1.3.5 | Videos > 90 days | Appear in collapsible Archive section | ⬜ |

### 1.4 Other Public Pages
| # | Test | Expected | Result |
|---|------|----------|--------|
| 1.4.1 | /success-stories | Page loads, testimonials visible | ⬜ |
| 1.4.2 | /press-media | Page loads, press items visible | ⬜ |
| 1.4.3 | /contact | Contact form renders, submit works | ⬜ |

---

## Section 2 — Authentication

### 2.1 Sign Up
| # | Test | Expected | Result |
|---|------|----------|--------|
| 2.1.1 | Visit /signup | Role selection screen shown | ⬜ |
| 2.1.2 | Select "Beneficiary" → fill details → submit | Account created, redirected to /dashboard | ⬜ |
| 2.1.3 | Select "Sponsor" → fill details → submit | Account created with sponsor role | ⬜ |
| 2.1.4 | Try duplicate email | Error message shown | ⬜ |
| 2.1.5 | Check Supabase → profiles table | New row with correct role created | ⬜ |

### 2.2 Login
| # | Test | Expected | Result |
|---|------|----------|--------|
| 2.2.1 | Login with valid email+password | Redirected to /dashboard | ⬜ |
| 2.2.2 | Login with wrong password | Error message shown | ⬜ |
| 2.2.3 | Click "Sign in with Google" | Google OAuth flow completes, lands on /dashboard | ⬜ |
| 2.2.4 | Visit /dashboard while logged out | Redirected to /login | ⬜ |
| 2.2.5 | Sign out via sidebar button | Redirected to /login, session cleared | ⬜ |

### 2.3 Password Reset
| # | Test | Expected | Result |
|---|------|----------|--------|
| 2.3.1 | Visit /forgot-password, enter email | "Check your email" confirmation shown | ⬜ |
| 2.3.2 | Click link in reset email | Lands on /reset-password | ⬜ |
| 2.3.3 | Enter new password → submit | Password updated, can log in with new password | ⬜ |

---

## Section 3 — Client Dashboard

### 3.1 Dashboard Home ( /dashboard )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 3.1.1 | Login as beneficiary → view dashboard | Stats cards show (cases, appointments, free consultations) | ⬜ |
| 3.1.2 | Login as sponsor → view dashboard | Beneficiaries + HR Contacts appear in sidebar | ⬜ |
| 3.1.3 | Login as lawyer → view dashboard | All nav items visible | ⬜ |

### 3.2 Cases ( /dashboard/cases )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 3.2.1 | Visit /dashboard/cases as beneficiary | Shows own cases only | ⬜ |
| 3.2.2 | Visit /dashboard/cases as lawyer | Shows all cases | ⬜ |
| 3.2.3 | Click a case | Opens /dashboard/cases/[id] with full detail | ⬜ |
| 3.2.4 | Case detail — timeline | Timeline events shown in order | ⬜ |
| 3.2.5 | Case detail — documents | Linked documents shown with download links | ⬜ |

### 3.3 Lawyer Actions on Cases ( /dashboard/cases/[id] — lawyer only )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 3.3.1 | Login as lawyer → open any case | "Add Timeline Event" and "Upload Document" panels visible | ⬜ |
| 3.3.2 | Add timeline event with event name + description | Event appears in timeline immediately after refresh | ⬜ |
| 3.3.3 | Add timeline event — empty event name | Error message shown, nothing saved | ⬜ |
| 3.3.4 | Upload a PDF document to the case | Document appears in Documents panel | ⬜ |
| 3.3.5 | Login as client (not lawyer) → open case | Lawyer action panels NOT visible | ⬜ |

### 3.4 Appointments ( /dashboard/appointments )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 3.4.1 | Visit /dashboard/appointments | Upcoming and past appointments listed | ⬜ |
| 3.4.2 | Free consultation counter | Shows correct remaining count (max 2) | ⬜ |

### 3.5 Book Appointment ( /dashboard/appointments/book )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 3.5.1 | Visit booking page with no slots configured | "No slots available" message + contact link | ⬜ |
| 3.5.2 | Add slots via /admin/slots → revisit booking | Date cards appear for dates with slots | ⬜ |
| 3.5.3 | Select a date → time slots appear | Only available times shown as buttons | ⬜ |
| 3.5.4 | Select date + time → Confirm Appointment | Success screen shown, confirmation email sent | ⬜ |
| 3.5.5 | Check Supabase → appointments table | New row with correct date/time/user | ⬜ |
| 3.5.6 | Check Supabase → consultation_slots | Booked slot has is_booked = true | ⬜ |
| 3.5.7 | Try to book same slot again | Slot no longer appears as available | ⬜ |
| 3.5.8 | First 2 bookings | Free consultation banner shown, is_free = true in DB | ⬜ |

### 3.6 Documents ( /dashboard/documents )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 3.6.1 | Upload a PDF file | File appears in list with name + type | ⬜ |
| 3.6.2 | Upload a JPG file | File appears in list | ⬜ |
| 3.6.3 | Click Download | File downloads correctly | ⬜ |
| 3.6.4 | Click Delete | File removed from list and Supabase Storage | ⬜ |
| 3.6.5 | Check Supabase Storage → documents bucket | File stored under user's folder | ⬜ |

### 3.7 Profile ( /dashboard/profile )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 3.7.1 | Edit full name → save | Name updates in sidebar and topbar | ⬜ |
| 3.7.2 | Edit phone number → save | Phone saved to profiles table | ⬜ |

### 3.8 Support Tickets ( /dashboard/tickets )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 3.8.1 | View ticket list | Shows tickets for current user | ⬜ |
| 3.8.2 | Create new ticket via /dashboard/tickets/new | Ticket appears in list | ⬜ |
| 3.8.3 | Open ticket → add reply | Reply appears in thread | ⬜ |
| 3.8.4 | Login as lawyer → view tickets | ALL user tickets visible | ⬜ |
| 3.8.5 | Client replies to ticket | Lawyer receives email notification | ⬜ |

### 3.9 Beneficiaries ( /dashboard/beneficiaries — sponsor only )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 3.9.1 | Login as sponsor → visit /dashboard/beneficiaries | Beneficiary list shown | ⬜ |
| 3.9.2 | Add new beneficiary | Appears in list | ⬜ |
| 3.9.3 | Login as beneficiary → visit /dashboard/beneficiaries | Redirected or access denied | ⬜ |

### 3.10 HR Contacts ( /dashboard/contacts — sponsor only )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 3.10.1 | Login as sponsor → visit /dashboard/contacts | Contact list shown | ⬜ |
| 3.10.2 | Add new contact | Appears in list with Email/Call buttons | ⬜ |

---

## Section 4 — Smart Form Assistant

### 4.1 Visa Type Selection ( /dashboard/apply )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 4.1.1 | Visit /dashboard/apply | All 5 visa types shown (H-1B, L-1, Green Card, K-1, Family Petition) | ⬜ |
| 4.1.2 | All 5 cards are clickable | No "Coming Soon" labels | ⬜ |

### 4.2 H-1B Questionnaire ( /dashboard/apply/h1b )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 4.2.1 | Click H-1B → questionnaire opens | Section 1 (Employer Info) shown | ⬜ |
| 4.2.2 | Fill Section 1 → Save & Continue | Advances to Section 2, progress bar updates | ⬜ |
| 4.2.3 | Check Supabase → applications table | Draft row created with partial answers in data JSONB | ⬜ |
| 4.2.4 | Close browser → reopen /dashboard/apply/h1b | Resumes from where you left off | ⬜ |
| 4.2.5 | Conditional fields (e.g. I-94) | Only appear when "Yes, in the US" is selected | ⬜ |
| 4.2.6 | Navigate back between sections | Previous answers preserved | ⬜ |
| 4.2.7 | Complete all 6 sections → Submit | Success screen shown | ⬜ |
| 4.2.8 | Check Supabase → applications | Status changed to "submitted" | ⬜ |
| 4.2.9 | Check email inbox | Client receives confirmation email | ⬜ |
| 4.2.10 | Check admin email (admin@onestopimmigrationstation.com) | Lawyer receives new application notification | ⬜ |

### 4.3 Other Visa Questionnaires
| # | Test | Expected | Result |
|---|------|----------|--------|
| 4.3.1 | Start L-1 questionnaire | 5 sections load, role type question works | ⬜ |
| 4.3.2 | Start Green Card questionnaire | EB category selector present | ⬜ |
| 4.3.3 | Start K-1 questionnaire | US petitioner + fiancé(e) sections separate | ⬜ |
| 4.3.4 | Start Family Petition | Relationship type selector filters spouse-specific questions | ⬜ |

---

## Section 5 — Email Notifications

### 5.1 Application Emails
| # | Test | Expected | Result |
|---|------|----------|--------|
| 5.1.1 | Submit questionnaire | Client gets "Application Received" email from noreply@onestopimmigrationstation.com | ⬜ |
| 5.1.2 | Lawyer changes status to "Under Review" | Client gets status update email | ⬜ |
| 5.1.3 | Lawyer changes status with note | Note appears in client email | ⬜ |
| 5.1.4 | Email has working "Go to Dashboard" button | Link opens portal | ⬜ |

### 5.2 Appointment Emails
| # | Test | Expected | Result |
|---|------|----------|--------|
| 5.2.1 | Book appointment | Client gets confirmation email with date/time | ⬜ |
| 5.2.2 | Admin gets notification | admin@onestopimmigrationstation.com gets booking alert | ⬜ |
| 5.2.3 | First booking email | Shows "Free Consultation #1 of 2" | ⬜ |

### 5.3 Ticket Emails
| # | Test | Expected | Result |
|---|------|----------|--------|
| 5.3.1 | Client replies to ticket | Other party gets reply notification email | ⬜ |
| 5.3.2 | Email has "View Ticket" link | Link opens correct ticket | ⬜ |

---

## Section 6 — Admin Panel

### 6.1 Admin Overview ( /admin )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 6.1.1 | Login as lawyer/admin → visit /admin | Stats dashboard loads with 6 stat cards | ⬜ |
| 6.1.2 | Login as beneficiary → visit /admin | Redirected to /dashboard (access denied) | ⬜ |
| 6.1.3 | New Applications card | Shows count of submitted applications | ⬜ |
| 6.1.4 | Click a stat card | Navigates to correct admin section | ⬜ |

### 6.2 Applications ( /admin/applications )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 6.2.1 | View applications list | All submitted applications shown | ⬜ |
| 6.2.2 | Click an application | Opens /admin/applications/[id] with all answers | ⬜ |
| 6.2.3 | Change status to "Under Review" → Save | Status updates in DB, client gets email | ⬜ |
| 6.2.4 | Add lawyer notes → Save | Notes saved to lawyer_notes column | ⬜ |
| 6.2.5 | Click "Download Summary PDF" | PDF downloads with all questionnaire answers formatted | ⬜ |
| 6.2.6 | PDF content | Has client name, visa type, date, all section headings, all answers | ⬜ |

### 6.3 Blog CMS ( /admin/blog )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 6.3.1 | Visit /admin/blog | Blog post list shown (empty state if no posts) | ⬜ |
| 6.3.2 | Click "+ New Post" | Form opens at /admin/blog/new | ⬜ |
| 6.3.3 | Fill title → slug auto-generates | Slug field updates automatically from title | ⬜ |
| 6.3.4 | Save as Draft | Post saved with is_published = false | ⬜ |
| 6.3.5 | Save with "Publish immediately" checked | Post saved with is_published = true | ⬜ |
| 6.3.6 | Visit /blog | Published post appears | ⬜ |
| 6.3.7 | Visit /blog/[post-slug] | Full post page renders | ⬜ |
| 6.3.8 | Click "Unpublish" in CMS | Post disappears from /blog | ⬜ |
| 6.3.9 | Click Edit (pencil) | Post form pre-filled with existing content | ⬜ |
| 6.3.10 | Click Delete (×) → confirm | Post permanently deleted | ⬜ |

### 6.4 Availability / Slots ( /admin/slots )
| # | Test | Expected | Result |
|---|------|----------|--------|
| 6.4.1 | Visit /admin/slots | Two panels: Add Single Slot + Bulk Add | ⬜ |
| 6.4.2 | Add single slot (date + time) | Appears in the upcoming slots panel | ⬜ |
| 6.4.3 | Use Bulk Add (2 weeks, Mon-Fri, 2 times/day) | Multiple slots appear, correct count | ⬜ |
| 6.4.4 | Delete an unbooked slot (× button) | Slot removed from list | ⬜ |
| 6.4.5 | Book a slot as client → revisit admin | Slot shows as "Booked" with client name | ⬜ |
| 6.4.6 | Booked slots have no × button | Cannot delete booked slots | ⬜ |

### 6.5 Other Admin Sections
| # | Test | Expected | Result |
|---|------|----------|--------|
| 6.5.1 | /admin/cases | All cases listed with status | ⬜ |
| 6.5.2 | /admin/users | All registered users with role badges | ⬜ |
| 6.5.3 | /admin/tickets | All support tickets with reply counts | ⬜ |
| 6.5.4 | /admin/appointments | All appointments, status updater works | ⬜ |

---

## Section 7 — PDF Summary Download

| # | Test | Expected | Result |
|---|------|----------|--------|
| 7.1 | Click Download PDF on submitted H-1B application | PDF generates and downloads | ⬜ |
| 7.2 | PDF header | Shows "One Stop Immigration Station" in navy/gold | ⬜ |
| 7.3 | PDF content — sections | All 6 section headings visible | ⬜ |
| 7.4 | PDF content — answers | Each answered field shown as "Label: Value" | ⬜ |
| 7.5 | PDF content — empty fields | Unanswered fields are skipped (not shown as blank) | ⬜ |
| 7.6 | PDF filename | Named "[visatype]-intake-[clientname].pdf" | ⬜ |
| 7.7 | PDF page numbers | Footer shows "Page X of Y" on each page | ⬜ |
| 7.8 | Long application | Multi-page PDF with proper page breaks | ⬜ |

---

---

## Section 8 — Blog CMS Post Types (Web Session 4)

### 8.1 Article Posts
| # | Test | Expected | Result |
|---|------|----------|--------|
| 8.1.1 | Open /admin/blog/new | Three post type buttons shown: Article, YouTube Video, USCIS News | ⬜ |
| 8.1.2 | Select Article → fill + publish | Appears on /blog, NOT on /videos | ⬜ |
| 8.1.3 | Article has all fields | Title, slug, category, excerpt, content, image, tags all save | ⬜ |

### 8.2 YouTube Video Posts
| # | Test | Expected | Result |
|---|------|----------|--------|
| 8.2.1 | Select YouTube Video type | YouTube URL field appears, Content field hidden | ⬜ |
| 8.2.2 | Paste valid YouTube URL | Live embed preview appears in the form | ⬜ |
| 8.2.3 | Paste youtu.be short URL | Also parsed correctly | ⬜ |
| 8.2.4 | Paste invalid URL | Red error shown, save blocked | ⬜ |
| 8.2.5 | Publish video → visit /videos | Video embedded with iframe, title + description shown | ⬜ |
| 8.2.6 | Video post does NOT appear on /blog | /blog filters it out | ⬜ |

### 8.3 USCIS News Posts
| # | Test | Expected | Result |
|---|------|----------|--------|
| 8.3.1 | Select USCIS News type | Publish toggle disabled, locked as draft | ⬜ |
| 8.3.2 | Save USCIS News post | Saved as draft (is_published=false) | ⬜ |
| 8.3.3 | Admin manually publishes draft | Appears on /blog | ⬜ |
| 8.3.4 | Published USCIS News on /blog | Shows "🏛️ USCIS Updates" banner | ⬜ |

### 8.4 USCIS RSS Auto-Import
| # | Test | Expected | Result |
|---|------|----------|--------|
| 8.4.1 | Call GET /api/cron/uscis-rss manually | Returns JSON: {ok:true, inserted:N, deleted:N} | ⬜ |
| 8.4.2 | After cron call → /admin/blog | New USCIS drafts appear with 🏛 USCIS type badge | ⬜ |
| 8.4.3 | Admin email inbox | Notification email received: "N new USCIS drafts" | ⬜ |
| 8.4.4 | Run cron again immediately | inserted:0 — same articles not re-imported | ⬜ |

---

## Section 9 — USCIS Pre-Fill PDF (Web Session 3)

| # | Test | Expected | Result |
|---|------|----------|--------|
| 9.1 | Open H-1B application in admin | "I-129 H-1B Pre-Fill" button visible below Summary PDF | ⬜ |
| 9.2 | Click pre-fill button | PDF downloads as i129-prefill-[clientname].pdf | ⬜ |
| 9.3 | Open PDF — cover block | Shows form number, client name, generation date | ⬜ |
| 9.4 | PDF — navy header on each page | "One Stop Immigration Station" + page X of Y | ⬜ |
| 9.5 | PDF — Part 1 (Employer) | employer_legal_name, employer_street, etc. pre-filled | ⬜ |
| 9.6 | PDF — Part 3 (Beneficiary) | ben_last_name, ben_dob, passport details pre-filled | ⬜ |
| 9.7 | PDF — amber fields | Fields like EIN, Prevailing Wage shown as "ATTORNEY COMPLETES" | ⬜ |
| 9.8 | Family Petition application | "I-130 Family Petition Pre-Fill" button appears | ⬜ |
| 9.9 | K-1 application | "I-129F K-1 Fiancé(e) Pre-Fill" button appears | ⬜ |
| 9.10 | Green Card application | "I-140 Green Card Pre-Fill" button appears | ⬜ |
| 9.11 | L-1 application | NO pre-fill button (not yet mapped) | ⬜ |

---

## Section 10 — In-Portal Notification Bell (Web Session 5)

### 10.1 Bell UI
| # | Test | Expected | Result |
|---|------|----------|--------|
| 10.1.1 | Login as client → dashboard | Bell icon visible in topbar | ⬜ |
| 10.1.2 | Login as lawyer → admin panel | Bell icon visible in admin topbar | ⬜ |
| 10.1.3 | No notifications | Bell shown with no badge | ⬜ |
| 10.1.4 | Click bell | Dropdown opens with "No notifications yet" or list | ⬜ |
| 10.1.5 | Click outside dropdown | Dropdown closes | ⬜ |

### 10.2 Notification Triggers
| # | Test | Expected | Result |
|---|------|----------|--------|
| 10.2.1 | Lawyer changes case status → check client portal | Bell shows red badge with unread count | ⬜ |
| 10.2.2 | Lawyer adds timeline event → check client portal | New notification in bell dropdown | ⬜ |
| 10.2.3 | Lawyer confirms appointment → check client portal | Appointment notification in bell | ⬜ |
| 10.2.4 | New notification received without refresh | Bell updates in real time (Supabase Realtime) | ⬜ |

### 10.3 Mark as Read
| # | Test | Expected | Result |
|---|------|----------|--------|
| 10.3.1 | Unread notification shown | Bold text + navy dot on right | ⬜ |
| 10.3.2 | Click notification | Marks as read (dot disappears), navigates to case/appointment | ⬜ |
| 10.3.3 | Click "Mark all read" | All notifications marked read, badge disappears | ⬜ |
| 10.3.4 | Re-open dropdown after marking all read | All notifications shown without bold/dot | ⬜ |

---

## Section 11 — Case Management (Web Sessions 2)

### 11.1 Create Case Directly
| # | Test | Expected | Result |
|---|------|----------|--------|
| 11.1.1 | Visit /admin/cases | "+ New Case" gold button visible | ⬜ |
| 11.1.2 | Click "+ New Case" | Inline form expands with client dropdown, visa type, etc. | ⬜ |
| 11.1.3 | Select client + visa type → Create Case | Creates case with auto case number OSIS-YYYY-NNN | ⬜ |
| 11.1.4 | After creation | Navigates to new case detail page | ⬜ |
| 11.1.5 | New case in DB | status='open', initial timeline event "Case Opened" present | ⬜ |
| 11.1.6 | Client's /dashboard/cases | New case visible | ⬜ |

### 11.2 Case Status Update
| # | Test | Expected | Result |
|---|------|----------|--------|
| 11.2.1 | Open /admin/cases/[id] | Status dropdown on right with all 7 options | ⬜ |
| 11.2.2 | Change status → Save | Status updates in DB + timeline event added | ⬜ |
| 11.2.3 | Client email | Receives case status update email | ⬜ |
| 11.2.4 | Client portal notification | Bell badge appears with case update notification | ⬜ |
| 11.2.5 | With attorney note | Note appears in both email and timeline | ⬜ |

---

## Section 12 — 🔜 Features Not Yet Built

### 12.1 Pre-Filled USCIS PDF Forms — L-1 (not yet mapped)
| # | Test | Expected | Result |
|---|------|----------|--------|
| 12.1.1 | L-1 application detail page | No pre-fill button shown | 🔜 |
| 12.1.2 | After L-1 mapping added | "I-129 L-1 Pre-Fill" button appears | 🔜 |

### 12.2 Ticket Reply Notification (not yet wired)
| # | Test | Expected | Result |
|---|------|----------|--------|
| 12.2.1 | Lawyer replies to ticket | Client bell does NOT show notification (known gap) | 🔜 |
| 12.2.2 | After fix | Ticket reply creates in-portal notification | 🔜 |

### 12.3 Custom Domain
| # | Test | Expected | Result |
|---|------|----------|--------|
| 12.3.1 | Visit https://onestopimmigrationstation.com | Site loads (not Vercel preview URL) | 🔜 |
| 12.3.2 | www redirect | https://www.onestopimmigrationstation.com → redirects to apex | 🔜 |
| 12.3.3 | SSL certificate | Padlock shown, no browser warnings | 🔜 |

### 12.4 React Native Mobile App
| # | Test | Expected | Result |
|---|------|----------|--------|
| 12.4.1 | App launches on iOS | Splash screen + login screen shown | ✅ Built (see TESTING_MOBILE.md) |
| 12.4.2 | Push notification | Case update triggers push on mobile | ✅ Built |

---

## Known Issues Log

| Date | Issue | Status | Fix |
|------|-------|--------|-----|
| 2026-06-06 | consultation_slots table didn't exist — ran ALTER on nonexistent table | Fixed | Replaced with CREATE TABLE IF NOT EXISTS in migration 003 |
| — | — | — | — |

---

## Environment Reference

| Variable | Value | Where Set |
|----------|-------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xrhmnyyrufahqaintmvt.supabase.co | .env.local + Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sb_publishable_H2HNW... | .env.local + Vercel |
| `RESEND_API_KEY` | re_JHfjmV6e... (your full key) | .env.local + Vercel ⚠️ |
| `NEXT_PUBLIC_SITE_URL` | http://localhost:3000 (dev) | .env.local |

⚠️ `RESEND_API_KEY` must also be added to **Vercel → Settings → Environment Variables** for production emails to work.
