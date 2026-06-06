-- ============================================================
-- Migration 003: Populate consultation_slots table
-- Run this in Supabase → SQL Editor → New query
-- ============================================================

-- Ensure the table has the right columns (add if missing)
alter table public.consultation_slots
  add column if not exists lawyer_id  uuid references public.profiles(id),
  add column if not exists slot_date  date,
  add column if not exists slot_time  text,
  add column if not exists is_booked  boolean default false,
  add column if not exists booked_by  uuid references public.profiles(id);

-- RLS: everyone can read available slots; only lawyers/admins can insert/update
alter table public.consultation_slots enable row level security;

drop policy if exists "Anyone reads available slots" on public.consultation_slots;
create policy "Anyone reads available slots"
  on public.consultation_slots for select
  using (true);

drop policy if exists "Lawyers manage slots" on public.consultation_slots;
create policy "Lawyers manage slots"
  on public.consultation_slots for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('lawyer','admin')
  ));
