-- Migration 009: Allow lawyers/admins to directly update applications and appointments
-- Required for the React Native mobile app (which cannot use the service role key)
-- Run this in Supabase SQL Editor

-- Allow lawyers/admins to update application status and notes
drop policy if exists "Lawyers can update applications" on public.applications;
create policy "Lawyers can update applications" on public.applications
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('lawyer','admin'))
  );

-- Allow lawyers/admins to update appointment status, location, meeting_link
drop policy if exists "Lawyers can update appointments" on public.appointments;
create policy "Lawyers can update appointments" on public.appointments
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('lawyer','admin'))
  );

-- Allow lawyers/admins to insert case timeline events
drop policy if exists "Lawyers can insert timeline events" on public.case_timeline;
create policy "Lawyers can insert timeline events" on public.case_timeline
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('lawyer','admin'))
  );

-- Allow lawyers to insert/update/delete their own consultation slots
drop policy if exists "Lawyers manage own slots" on public.consultation_slots;
create policy "Lawyers manage own slots" on public.consultation_slots
  for all using (
    lawyer_id = auth.uid() or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
