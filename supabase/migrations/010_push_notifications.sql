-- Migration 010: Push notification tokens + notifications table
-- Run in Supabase SQL Editor

-- Push tokens table — stores Expo push tokens per user/device
create table if not exists public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  token text not null,
  platform text check (platform in ('ios', 'android')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, token)
);

alter table public.push_tokens enable row level security;

-- Users can only manage their own tokens
create policy "Users manage own push tokens" on public.push_tokens
  for all using (auth.uid() = user_id);

-- Notifications table (update existing or create fresh)
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  body text not null,
  type text check (type in ('case_update', 'appointment', 'ticket_reply', 'case_opened', 'general')),
  data jsonb default '{}',
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

-- Users can read/update their own notifications
drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications" on public.notifications
  for select using (auth.uid() = user_id);

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

-- Service role (web API) can insert notifications for any user
-- This is handled by the service role key bypassing RLS

-- Index for performance
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_is_read_idx on public.notifications(user_id, is_read);
create index if not exists push_tokens_user_id_idx on public.push_tokens(user_id);
