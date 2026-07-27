-- Marketplace category expansion
ALTER TABLE listings ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Land & Property';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_type TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_brand TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_year TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_mileage TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS condition TEXT;

CREATE INDEX IF NOT EXISTS listings_category_idx ON listings (category);
