-- Search requests from exit-intent popup (run in Supabase SQL Editor)

CREATE TABLE IF NOT EXISTS search_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT NOT NULL,
  region TEXT,
  budget TEXT,
  locale TEXT DEFAULT 'en',
  status TEXT DEFAULT 'nieuw',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS search_requests_created_at_idx
  ON search_requests (created_at DESC);

ALTER TABLE search_requests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'nieuw';

ALTER TABLE search_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access search_requests" ON search_requests;
CREATE POLICY "Service role full access search_requests" ON search_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);
