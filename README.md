# ThaiPlot

Thailand's independent land & property marketplace.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- next-intl (en / nl / de / th)
- Supabase (shared with hua-hin-land.com)
- Resend

## Setup

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev                  # http://localhost:3001
```

## Supabase

Same database as hua-hin-land.com. Add region column:

```sql
ALTER TABLE listings ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'Hua Hin';
```
