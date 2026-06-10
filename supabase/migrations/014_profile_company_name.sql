-- Migration 014: Add company_name to profiles
--
-- Stores the human-readable company name directly on the profile so
-- team pages can display it without a separate join.
-- company_id (from 013) is the UUID link; company_name is the label.

alter table public.profiles
  add column if not exists company_name text;
