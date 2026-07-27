-- Add marketplace category columns (safe to re-run)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Land & Property';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_type TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_brand TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_year TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_mileage TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS condition TEXT;

CREATE INDEX IF NOT EXISTS listings_category_idx ON listings (category);

-- Backfill Thanathip land listings
UPDATE listings
SET category = 'Land & Property'
WHERE status = 'approved'
  AND (category IS NULL OR category = '')
  AND COALESCE(property_type, '') ILIKE 'Land%';

-- Mark the test boat listing (Longtail / Amsterdam)
UPDATE listings
SET category = 'Boat'
WHERE id = '35aa6aa2-4dcb-4564-b39d-3df162e4da63';

-- Also catch any other boat-like property types without category
UPDATE listings
SET category = 'Boat'
WHERE (category IS NULL OR category = '' OR category = 'Land & Property')
  AND (
    property_type ILIKE '%boat%'
    OR property_type ILIKE '%boot%'
    OR property_type ILIKE '%longtail%'
    OR property_type ILIKE '%yacht%'
    OR property_type ILIKE '%speedboat%'
  );

-- Inspect non-Thanathip approved listings
SELECT id, name, location, category, property_type, transaction_type, status
FROM listings
WHERE name != 'Thanathip'
  AND status = 'approved';
