-- Featured Soi 112 full parcel (4 Rai 2 Ngan)
UPDATE listings
SET
  price = '฿2,300,000/Rai — Total ฿10,350,000',
  description = 'Prime land for sale with panoramic mountain views in Thap Tai, Hua Hin (Soi 112). Full plot: 4 Rai 2 Ngan (7,200 m²). Chanote title deed ready for transfer. More info: https://www.hua-hin-land.com'
WHERE id = 'fbd0d273-fada-4f4f-8341-09d5237ec12d';

-- Soi 112 partial sale (same plot, from 1 Rai)
UPDATE listings
SET
  price = '฿2,300,000/Rai — Total ฿10,350,000'
WHERE id = '074685e5-8bdf-43b7-b5ef-8ca4634b1b5b';
