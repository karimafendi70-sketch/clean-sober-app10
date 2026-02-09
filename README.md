# Clean Sober App 🌿

Een minimale Next.js app met een sober tracker, authentication, dashboard met statistieken, en dark mode.

## Features

✅ Dagen teller met start/reset functionaliteit  
✅ **Mock Authentication** (werkt direct zonder Supabase!)  
✅ Dashboard met streaks, milestones en history  
✅ Dark mode toggle  
✅ LocalStorage persistence als fallback  

## Snel starten

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost3000) in je browser.

## Authentication

De app heeft een **ingebouwde mock auth** die localStorage gebruikt. Dit betekent:

- ✅ Je kunt **direct accounts aanmaken** zonder Supabase configuratie
- ✅ Accounts worden lokaal opgeslagen in je browser
- ✅ Werkt perfect voor development en testing

### Supabase (optioneel)

Wil je een echte database + auth? Configureer dan Supabase:

1. Maak een Supabase project aan op https://app.supabase.com
2. Ga naar **Settings** → **API**
3. Kopieer de **URL** en **anon public** key (begint met `eyJ...`)
4. Plak in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jouwproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Voer het database schema uit: `supabase/schema.sql`

De app detecteert automatisch of Supabase beschikbaar is en schakelt over!

## Deploying naar Vercel

```bash
npm run build  # Test production build
git push       # Auto-deploy via Vercel
```

Vergeet niet om Supabase env vars toe te voegen in Vercel dashboard als je die gebruikt.

## Pages

- `/` - Homepage met dagen teller
- `/login` - Inloggen / Account aanmaken
- `/dashboard` - Statistieken en milestones (vereist login)
