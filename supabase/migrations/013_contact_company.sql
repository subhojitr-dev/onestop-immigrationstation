-- Migration 013: Contact Company
--
-- Adds company_id and invited_by to profiles so that contacts, sponsors,
-- and beneficiaries belonging to the same sponsoring company can see each other.
--
-- Data model:
--   - When a Contact account is first used to invite someone, a UUID is assigned
--     as their company_id (stored as their own user_id by the API).
--   - All Sponsors and Beneficiaries invited by that Contact get the same company_id.
--   - Sponsors also see everyone with the same company_id.
--
-- Run this in the Supabase SQL Editor.

alter table public.profiles
  add column if not exists company_id uuid,
  add column if not exists invited_by uuid references public.profiles(id) on delete set null;

-- Index for fast company member lookups
create index if not exists profiles_company_id_idx on public.profiles(company_id);
