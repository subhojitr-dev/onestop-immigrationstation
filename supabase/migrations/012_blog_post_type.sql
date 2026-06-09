-- 012_blog_post_type.sql
-- Add post_type, youtube_url, and source_url columns to blog_posts.
--
-- post_type:
--   'article'       → appears on /blog  (default — all existing posts become 'article')
--   'youtube_video' → appears on /videos with embedded player
--   'uscis_news'    → appears on /blog  (auto-imported from USCIS RSS as drafts)
--
-- youtube_url:  YouTube watch URL pasted by admin (converted to embed URL in UI)
-- source_url:   Original USCIS RSS item link — used to deduplicate auto-imports

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS post_type text NOT NULL DEFAULT 'article'
    CHECK (post_type IN ('article', 'youtube_video', 'uscis_news')),
  ADD COLUMN IF NOT EXISTS youtube_url text,
  ADD COLUMN IF NOT EXISTS source_url text;

-- Indexes for fast filtering on both pages
CREATE INDEX IF NOT EXISTS blog_posts_post_type_idx    ON public.blog_posts(post_type);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS blog_posts_source_url_idx   ON public.blog_posts(source_url);
