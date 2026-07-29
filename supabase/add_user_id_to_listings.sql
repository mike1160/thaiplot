-- Link listings to Supabase Auth users (run in Supabase SQL Editor)

ALTER TABLE listings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS listings_user_id_idx ON listings(user_id);
