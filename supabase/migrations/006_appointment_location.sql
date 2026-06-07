-- ============================================================
-- Migration 006: Appointment location / meeting link
-- Run in Supabase → SQL Editor → New query
-- ============================================================

alter table public.appointments
  add column if not exists location     text,  -- e.g. "Office", "Phone", "Zoom"
  add column if not exists meeting_link text;  -- e.g. zoom/google meet URL

NOTIFY pgrst, 'reload schema';
