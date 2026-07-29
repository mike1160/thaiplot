-- Admin improvements (run in Supabase SQL Editor)

ALTER TABLE search_requests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'nieuw';

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS disabled BOOLEAN DEFAULT false;
