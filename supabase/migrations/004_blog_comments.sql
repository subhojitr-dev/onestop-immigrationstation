-- ============================================================
-- Migration 004: Blog Comments
-- Run in Supabase → SQL Editor → New query
-- ============================================================

-- Comments table: supports threading via parent_id (null = top-level)
create table if not exists public.blog_comments (
  id          uuid default uuid_generate_v4() primary key,
  post_id     uuid references public.blog_posts(id) on delete cascade not null,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  parent_id   uuid references public.blog_comments(id) on delete cascade, -- null = top-level
  body        text not null,
  is_deleted  boolean default false, -- soft delete: admin marks deleted, body replaced with "[removed]"
  created_at  timestamptz default now()
);

alter table public.blog_comments enable row level security;

-- Anyone can read non-deleted comments
create policy "Anyone reads comments"
  on public.blog_comments for select
  using (true);

-- Logged-in users can post comments
create policy "Users post comments"
  on public.blog_comments for insert
  with check (auth.uid() = user_id);

-- Users can soft-delete their own comments
create policy "Users delete own comments"
  on public.blog_comments for update
  using (auth.uid() = user_id);

-- Admins/lawyers can delete any comment
create policy "Admins delete any comment"
  on public.blog_comments for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('lawyer','admin')
    )
  );
