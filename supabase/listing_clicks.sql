-- Listing click analytics (run in Supabase SQL Editor)

CREATE TABLE IF NOT EXISTS listing_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clicked_at TIMESTAMPTZ DEFAULT now(),
  listing_id UUID REFERENCES listings(id),
  listing_location TEXT,
  user_agent TEXT,
  referrer TEXT,
  locale TEXT
);

CREATE INDEX IF NOT EXISTS listing_clicks_listing_id_clicked_at_idx
  ON listing_clicks (listing_id, clicked_at DESC);

ALTER TABLE listing_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert clicks" ON listing_clicks;
CREATE POLICY "Anyone can insert clicks" ON listing_clicks
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can read" ON listing_clicks;
CREATE POLICY "Service role can read" ON listing_clicks
  FOR SELECT TO service_role USING (true);
