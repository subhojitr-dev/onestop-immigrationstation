-- ============================================================
-- One Stop Immigration Station — Initial Database Schema
-- Converts: mylegali_my_legail.sql (MySQL) → PostgreSQL
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ── Users (extends Supabase auth.users) ──────────────────────
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  email         text unique not null,
  full_name     text,
  phone         text,
  role          text not null default 'beneficiary'
                check (role in ('beneficiary','sponsor','contact','admin','lawyer')),
  avatar_url    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Cases ────────────────────────────────────────────────────
create table public.cases (
  id                  uuid default uuid_generate_v4() primary key,
  case_number         text unique not null,
  user_id             uuid references public.profiles(id),
  sponsor_id          uuid references public.profiles(id),
  contact_id          uuid references public.profiles(id),
  visa_type           text not null,
  status              text not null default 'open'
                      check (status in ('open','in_progress','pending_documents',
                             'submitted','approved','denied','closed')),
  description         text,
  assigned_attorney   text,
  opened_date         timestamptz default now(),
  updated_at          timestamptz default now(),
  closed_date         timestamptz
);

-- ── Case Timeline ────────────────────────────────────────────
create table public.case_timeline (
  id           uuid default uuid_generate_v4() primary key,
  case_id      uuid references public.cases(id) on delete cascade,
  event        text not null,
  description  text,
  created_by   uuid references public.profiles(id),
  created_at   timestamptz default now()
);

-- ── Appointments ─────────────────────────────────────────────
create table public.appointments (
  id                  uuid default uuid_generate_v4() primary key,
  user_id             uuid references public.profiles(id),
  case_id             uuid references public.cases(id),
  date                date not null,
  time_slot           text not null,
  status              text not null default 'pending'
                      check (status in ('pending','confirmed','cancelled',
                             'completed','no_show')),
  is_free             boolean default false,
  free_session_number integer check (free_session_number in (1,2)),
  notes               text,
  attorney_notes      text,
  created_at          timestamptz default now()
);

-- ── Dependents ───────────────────────────────────────────────
create table public.dependents (
  id                uuid default uuid_generate_v4() primary key,
  user_id           uuid references public.profiles(id),
  full_name         text not null,
  relationship      text not null,
  date_of_birth     date,
  country_of_birth  text,
  passport_number   text,
  created_at        timestamptz default now()
);

-- ── Beneficiaries ────────────────────────────────────────────
create table public.beneficiaries (
  id          uuid default uuid_generate_v4() primary key,
  sponsor_id  uuid references public.profiles(id),
  user_id     uuid references public.profiles(id),
  full_name   text not null,
  email       text not null,
  phone       text,
  visa_type   text,
  status      text default 'invited'
              check (status in ('invited','active','inactive')),
  created_at  timestamptz default now()
);

-- ── Contacts ─────────────────────────────────────────────────
create table public.contacts (
  id               uuid default uuid_generate_v4() primary key,
  sponsor_id       uuid references public.profiles(id),
  full_name        text not null,
  email            text not null,
  phone            text,
  role_description text,
  created_at       timestamptz default now()
);

-- ── Tickets ──────────────────────────────────────────────────
create table public.tickets (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.profiles(id),
  case_id      uuid references public.cases(id),
  subject      text not null,
  description  text not null,
  status       text not null default 'open'
               check (status in ('open','in_progress','resolved','closed')),
  priority     text not null default 'medium'
               check (priority in ('low','medium','high','urgent')),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  closed_at    timestamptz
);

-- ── Ticket Replies ───────────────────────────────────────────
create table public.ticket_replies (
  id             uuid default uuid_generate_v4() primary key,
  ticket_id      uuid references public.tickets(id) on delete cascade,
  user_id        uuid references public.profiles(id),
  message        text not null,
  is_staff_reply boolean default false,
  created_at     timestamptz default now()
);

-- ── Documents ────────────────────────────────────────────────
create table public.documents (
  id           uuid default uuid_generate_v4() primary key,
  case_id      uuid references public.cases(id),
  user_id      uuid references public.profiles(id),
  file_name    text not null,
  file_url     text not null,
  file_size    integer,
  doc_type     text not null default 'other',
  description  text,
  uploaded_at  timestamptz default now()
);

-- ── Blog Posts ───────────────────────────────────────────────
create table public.blog_posts (
  id             uuid default uuid_generate_v4() primary key,
  title          text not null,
  slug           text unique not null,
  excerpt        text,
  content        text not null,
  author_id      uuid references public.profiles(id),
  author_name    text,
  category       text default 'Policy & News',
  tags           text[],
  featured_image text,
  is_published   boolean default false,
  published_at   timestamptz,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ── Contact Forms ────────────────────────────────────────────
create table public.contact_forms (
  id           uuid default uuid_generate_v4() primary key,
  first_name   text not null,
  last_name    text not null,
  email        text not null,
  phone        text,
  subject      text not null,
  service_type text,
  message      text not null,
  is_read      boolean default false,
  created_at   timestamptz default now()
);

-- ── Notifications ────────────────────────────────────────────
create table public.notifications (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id),
  type        text not null,
  title       text not null,
  message     text not null,
  is_read     boolean default false,
  link        text,
  created_at  timestamptz default now()
);

-- ── Loyalty Program ──────────────────────────────────────────
create table public.loyalty_program (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) unique,
  points      integer default 0,
  tier        text default 'bronze'
              check (tier in ('bronze','silver','gold','platinum')),
  updated_at  timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY — users can only see their own data
-- ============================================================
alter table public.profiles       enable row level security;
alter table public.cases          enable row level security;
alter table public.appointments   enable row level security;
alter table public.tickets        enable row level security;
alter table public.documents      enable row level security;
alter table public.dependents     enable row level security;
alter table public.beneficiaries  enable row level security;
alter table public.notifications  enable row level security;

-- Profiles: users see own profile
create policy "Users see own profile"
  on public.profiles for all
  using (auth.uid() = id);

-- Cases: users see own cases
create policy "Users see own cases"
  on public.cases for select
  using (auth.uid() = user_id or auth.uid() = sponsor_id or auth.uid() = contact_id);

-- Appointments: users see own appointments
create policy "Users see own appointments"
  on public.appointments for all
  using (auth.uid() = user_id);

-- Tickets: users see own tickets
create policy "Users see own tickets"
  on public.tickets for all
  using (auth.uid() = user_id);

-- Documents: users see own documents
create policy "Users see own documents"
  on public.documents for all
  using (auth.uid() = user_id);

-- Dependents: users see own dependents
create policy "Users see own dependents"
  on public.dependents for all
  using (auth.uid() = user_id);

-- Blog posts: everyone can read published posts
create policy "Anyone reads published posts"
  on public.blog_posts for select
  using (is_published = true);

-- Contact forms: insert only (public), admins read
create policy "Anyone submits contact form"
  on public.contact_forms for insert
  with check (true);

-- Notifications: users see own notifications
create policy "Users see own notifications"
  on public.notifications for all
  using (auth.uid() = user_id);

-- ── Auto-create profile on signup ────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'beneficiary')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Auto-generate case numbers ────────────────────────────────
create or replace function public.generate_case_number()
returns trigger as $$
begin
  new.case_number := 'OSI-' || to_char(now(), 'YYYY') || '-' ||
                     lpad(nextval('case_number_seq')::text, 5, '0');
  return new;
end;
$$ language plpgsql;

create sequence if not exists case_number_seq start 1000;

create trigger set_case_number
  before insert on public.cases
  for each row execute procedure public.generate_case_number();
