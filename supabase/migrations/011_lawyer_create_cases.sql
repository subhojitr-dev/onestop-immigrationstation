-- Migration 011: Allow lawyers/admins to create cases directly from mobile
-- Run in Supabase SQL Editor

-- Allow lawyers/admins to INSERT new cases
drop policy if exists "Lawyers can create cases" on public.cases;
create policy "Lawyers can create cases" on public.cases
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('lawyer','admin'))
  );

-- Allow lawyers/admins to UPDATE case status
drop policy if exists "Lawyers can update cases" on public.cases;
create policy "Lawyers can update cases" on public.cases
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('lawyer','admin'))
  );
