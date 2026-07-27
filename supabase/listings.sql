-- Shared listings table (same DB as hua-hin-land.com)
-- Run in Supabase SQL Editor if table does not exist yet

CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending',

  name TEXT,
  email TEXT,
  phone TEXT,
  preferred_language TEXT,

  property_type TEXT,
  transaction_type TEXT,
  location TEXT,
  size TEXT,
  price TEXT,
  title_deed TEXT,
  description TEXT,
  region TEXT DEFAULT 'Hua Hin',

  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ
);

ALTER TABLE listings ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'Hua Hin';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS photo_1 TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS photo_2 TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS photo_3 TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS photo_4 TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS photo_5 TEXT;

CREATE INDEX IF NOT EXISTS listings_status_approved_at_idx
  ON listings (status, approved_at DESC);

CREATE INDEX IF NOT EXISTS listings_region_idx
  ON listings (region);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
