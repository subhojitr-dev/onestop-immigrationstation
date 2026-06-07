-- Migration 007: Store lawyer name on appointment at booking time
alter table public.appointments
  add column if not exists lawyer_name text;

NOTIFY pgrst, 'reload schema';
