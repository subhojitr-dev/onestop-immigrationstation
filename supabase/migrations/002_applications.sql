-- ============================================================
-- One Stop Immigration Station
-- Migration 002: Smart Form Assistant — Applications
-- ============================================================

-- Applications table — stores intake questionnaire responses
create table public.applications (
  id                  uuid default uuid_generate_v4() primary key,
  user_id             uuid references public.profiles(id) on delete cascade,
  visa_type           text not null
                      check (visa_type in ('h1b','l1','green_card','k1','family_petition')),
  status              text not null default 'draft'
                      check (status in ('draft','submitted','under_review','info_requested','approved','rejected')),
  current_section     integer default 1,
  completed_sections  integer[] default '{}',
  data                jsonb default '{}',
  lawyer_notes        text,
  assigned_lawyer     uuid references public.profiles(id),
  submitted_at        timestamptz,
  reviewed_at         timestamptz,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table public.applications enable row level security;

-- Users can see and edit their own applications
create policy "Users manage own applications"
  on public.applications for all
  using (auth.uid() = user_id);

-- Lawyers and admins can see all applications
create policy "Lawyers see all applications"
  on public.applications for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('lawyer', 'admin')
    )
  );

create policy "Lawyers update applications"
  on public.applications for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('lawyer', 'admin')
    )
  );

-- Auto-update updated_at
create or replace function public.update_application_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger application_updated
  before update on public.applications
  for each row execute procedure public.update_application_timestamp();
