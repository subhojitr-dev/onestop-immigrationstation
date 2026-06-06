-- ============================================================
-- Migration 003: Create consultation_slots table
-- Run this in Supabase → SQL Editor → New query
-- ============================================================

-- Create the table from scratch (handles case where it doesn't exist yet)
create table if not exists public.consultation_slots (
  id          uuid default uuid_generate_v4() primary key,
  lawyer_id   uuid references public.profiles(id),
  slot_date   date not null,
  slot_time   text not null,
  is_booked   boolean default false,
  booked_by   uuid references public.profiles(id),
  created_at  timestamptz default now()
);

-- RLS: everyone can read slots; only lawyers/admins can insert/update/delete
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
