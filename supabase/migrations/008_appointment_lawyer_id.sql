-- 008_appointment_lawyer_id.sql
-- Add lawyer_id FK to appointments so we can filter per-lawyer.
-- Existing rows keep lawyer_name for backward compat; new bookings will populate both.

alter table public.appointments
  add column if not exists lawyer_id uuid references public.profiles(id) on delete set null;

-- Index for fast per-lawyer queries
create index if not exists appointments_lawyer_id_idx on public.appointments(lawyer_id);

-- RLS: lawyers see only their own; admins see all
drop policy if exists "Lawyers see all appointments" on public.appointments;

create policy "Lawyers see own appointments" on public.appointments for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'lawyer'
        and (
          public.appointments.lawyer_id = auth.uid()
          or (public.appointments.lawyer_id is null and public.appointments.lawyer_name = profiles.full_name)
        )
    )
    or
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
