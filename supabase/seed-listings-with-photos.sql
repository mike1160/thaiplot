-- Run in Supabase SQL Editor (project gtnaexoyxjzxhfdjkngv)

ALTER TABLE listings ADD COLUMN IF NOT EXISTS photo_1 TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS photo_2 TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS photo_3 TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS photo_4 TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS photo_5 TEXT;

-- Avoid duplicates if seed was previously inserted without photos
DELETE FROM listings
WHERE email = 'info@hua-hin-land.com'
  AND status = 'approved';

INSERT INTO listings (name, email, phone, preferred_language, property_type,
transaction_type, location, size, price, title_deed, description,
status, region, approved_at, photo_1, photo_2, photo_3, photo_4, photo_5)
VALUES

-- LISTING 1: Soi 112 (featured - our own plot)
('Thanathip', 'info@hua-hin-land.com', '065-901-2984', 'en', 'Land', 'For Sale',
'Soi 112, Thap Tai, Hua Hin', '4 Rai 2 Ngan (7,200 m²)', '฿2,300,000/Rai — Total ฿10,350,000',
'Chanote (Red Garuda) — Ready to transfer',
'Prime flat land with panoramic mountain views. Direct concrete road access. Water and electricity connected. 15 min to Hua Hin beach and BluPort Mall. Near Botanica, La Felice and MahaSamutr. Perfect for luxury villa or investment. Full details: www.hua-hin-land.com',
'approved', 'Hua Hin', now(),
'/soi112-1.jpg', '/soi112-2.jpg', '/soi112-3.jpg', '/soi112-4.jpg', '/soi112-5.jpg'),

-- LISTING 2: Khao Tao 4 rai
('Thanathip', 'info@hua-hin-land.com', '065-901-2984', 'en', 'Land', 'For Sale',
'Hua Hin Soi 105 — Khao Tao — Wang Phong — Pak Nam Pran', '4 Rai (6,400 m²)', '฿2,500,000/Rai — Total ฿10,000,000',
'Chanote (Red Garuda) — Ready to transfer',
'Hillside land with breathtaking panoramic mountain views and refreshing sea breeze all year round. Golden location connecting Khao Tao, Wang Phong and Pak Nam Pran. Close to Khao Tao Beach and Pak Nam Pran Beach. Only 15-20 min to Hua Hin city and BluPort Mall. Wide comfortable road access. Ideal for luxury pool villa or boutique resort.',
'approved', 'Hua Hin', now(),
'/khao-tao-1.jpg', '/khao-tao-2.jpg', '/khao-tao-3.jpg', NULL, NULL),

-- LISTING 3: Soi 105 2 rai
('Thanathip', 'info@hua-hin-land.com', '065-901-2984', 'en', 'Land', 'For Sale',
'Hua Hin Soi 105 — Khao Tao — Pak Nam Pran', '2 Rai (3,200 m²)', '฿2,500,000/Rai — Total ฿5,000,000',
'Chanote (Red Garuda) — Ready to transfer',
'Beautiful hillside land with stunning mountain views and cool breeze. Situated on Hua Hin Soi 105, connecting Khao Tao, Wang Phong and Pak Nam Pran. Close to Khao Tao Beach and Pranburi Forest Park. Only 15-20 min to Hua Hin city center. Easy wide road access. Perfect for pool villa, small resort or investment.',
'approved', 'Hua Hin', now(),
'/soi105-1.jpg', '/soi105-2.jpg', '/soi105-3.jpg', NULL, NULL),

-- LISTING 4: Pranburi Khao Kalok
('Thanathip', 'info@hua-hin-land.com', '065-901-2984', 'en', 'Land', 'For Sale',
'Pak Nam Khao Kalok, Pranburi, Prachuap Khiri Khan', '200 Sq.Wah (800 m²)', '฿2,500,000 (full plot)',
'Chanote (Red Garuda) — Ready to transfer',
'Beautiful land only 800 meters from the beach in the sought-after Khao Kalok area. 8-meter wide frontage road. Water and electricity ready to connect. Near Khao Kalok attractions and famous Pranburi seafood restaurants. Peaceful atmosphere with sea breeze. Perfect for vacation home or investment.',
'approved', 'Pranburi', now(),
'/pranburi-1.jpg', '/pranburi-2.jpg', NULL, NULL, NULL),

-- LISTING 5: Black Mountain
('Thanathip', 'info@hua-hin-land.com', '065-901-2984', 'en', 'Land', 'For Sale',
'Black Mountain Zone, Hua Hin', '2 Rai (3,200 m²)', '฿3,600,000 (full plot)',
'Chanote — Ready to transfer',
'Prime land in the prestigious Black Mountain area. Steps away from Black Mountain Golf Course, Water Park and International School. Mountain views, high privacy. Water and electricity connected. Only 10-15 min to Hua Hin Beach, leading hospitals and BluPort/Market Village malls. Ideal for luxury pool villa or investment property.',
'approved', 'Hua Hin', now(),
'/black-mountain-1.jpg', '/black-mountain-2.jpg', NULL, NULL, NULL),

-- LISTING 6: Sam Roi Yot
('Thanathip', 'info@hua-hin-land.com', '065-901-2984', 'en', 'Land', 'For Sale',
'Khao Lang Kan, Sam Roi Yot, Prachuap Khiri Khan', '3 Rai (4,800 m²)', '฿1,500,000/Rai — Total ฿4,500,000',
'Nor Sor Kru Ta Daeng',
'Spectacular 360-degree mountain views surrounded by nature. Only 2+ km from Sam Roi Yot Beach and National Park. Rare find combining mountain tranquility with easy beach access. Fresh air and peaceful atmosphere all year round. Ideal for private vacation villa, boutique resort, cafe or long-term investment.',
'approved', 'Prachuap Khiri Khan', now(),
'/sam-roi-yot-1.jpg', '/sam-roi-yot-2.jpg', '/sam-roi-yot-3.jpg', '/sam-roi-yot-4.jpg', NULL),

-- LISTING 7: Soi 105b
('Thanathip', 'info@hua-hin-land.com', '065-901-2984', 'en', 'Land', 'For Sale',
'Hua Hin Soi 105 — Khao Tao — Pak Nam Pran', '2 Rai (3,200 m²)', '฿1,800,000/Rai — Total ฿3,600,000',
'Chanote (Red Garuda) — Ready to transfer',
'Beautiful land with stunning mountain views and peaceful atmosphere. Located on Hua Hin Soi 105 with easy access to Khao Tao and Pak Nam Pran. Water and electricity in place. Ready to build your dream home. Perfect for private villa or vacation home.',
'approved', 'Hua Hin', now(),
'/soi105b-1.jpg', '/soi105b-2.jpg', '/soi105b-3.jpg', NULL, NULL);
