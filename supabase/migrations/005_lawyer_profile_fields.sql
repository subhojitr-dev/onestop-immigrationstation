-- ============================================================
-- Migration 005: Extended Lawyer Profile Fields
-- Run in Supabase → SQL Editor → New query
-- ============================================================

alter table public.profiles
  add column if not exists gender        text,
  add column if not exists date_of_birth date,
  add column if not exists qualification text;

NOTIFY pgrst, 'reload schema';
