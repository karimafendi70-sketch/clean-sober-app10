# Supabase Setup Guide

## ✅ Wat krijg je met Supabase?

- 🔐 Echte user authentication (ipv mock localStorage)
- 📧 **Automatische verificatie emails** bij signup
- 🔑 Password reset emails
- 💾 PostgreSQL database voor sober_entries
- 🔒 Row Level Security (RLS) policies
- ☁️ Cloud hosted (gratis tier: 50MB database, unlimited API requests)

## 🚀 Quick Start

### 1. Supabase Project Aanmaken

1. Ga naar [supabase.com](https://supabase.com)
2. Klik **"Start your project"** (of **"New Project"**)
3. Maak een gratis account aan (GitHub/Google/Email)
4. Klik **"New Project"**
5. Vul in:
   - **Name:** `clean-sober-app` (of eigen naam)
   - **Database Password:** Kies een sterk wachtwoord (bewaar deze!)
   - **Region:** Kies dichtsbij je locatie
6. Klik **"Create new project"** (duurt ~2 minuten)

### 2. API Credentials Ophalen

1. Wacht tot project ready is
2. Ga naar **Settings** (links in sidebar)
3. Klik **API**
4. Kopieer deze 2 keys:
   - **Project URL** (bijv. `https://abcdefgh.supabase.co`)
   - **anon public** key (lange string die begint met `eyJ...`)

### 3. Environment Variables Instellen

**Lokaal:**
Bewerk `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://jouwproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Productie (Vercel):**
```bash
# Via CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Of via Vercel Dashboard:
# Settings → Environment Variables → Add
```

### 4. Database Schema Uitvoeren

1. Ga naar **SQL Editor** in je Supabase dashboard
2. Klik **"New query"**
3. Kopieer de inhoud van `supabase/schema.sql`
4. Plak in de SQL editor
5. Klik **"Run"** (of Cmd/Ctrl + Enter)

✅ Je database is nu klaar!

### 5. Test de Connectie

1. Herstart je dev server: `npm run dev`
2. Ga naar [/login](http://localhost:3000/login)
3. Maak een account aan
4. Check je email inbox voor verificatie! 📧

## 📧 Email Verificatie Configureren

### Standaard Setup (Supabase hosted)

Supabase verstuurt **automatisch** verificatie emails via hun SMTP.

**Je hoeft niets te configureren!** Het werkt out-of-the-box.

### Email Templates Aanpassen

1. Ga naar **Authentication** → **Email Templates**
2. Kies template:
   - **Confirm signup**
   - **Reset password**
   - **Magic link**
3. Pas de HTML/CSS aan naar je wensen
4. Gebruik variabelen:
   - `{{ .ConfirmationURL }}` - Verificatie link
   - `{{ .Token }}` - Token code
   - `{{ .Email }}` - User email
   - `{{ .SiteURL }}` - Je app URL

**Voorbeeld aangepaste template:**
```html
<h2>Welkom bij Sober Tracker! 🌟</h2>
<p>Klik op de knop om je account te activeren:</p>
<a href="{{ .ConfirmationURL }}" style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
  ✓ Activeer Account
</a>
<p>Of kopieer deze link: {{ .ConfirmationURL }}</p>
```

### Custom SMTP (Optioneel - voor eigen domain)

Wil je emails versturen vanaf `noreply@jouwdomein.com`?

1. Ga naar **Authentication** → **Settings** → **SMTP Settings**
2. Vul in:
   - **SMTP Host:** (bijv. `smtp.sendgrid.net`)
   - **Port:** `587` (of `465` voor SSL)
   - **Username:** Je SMTP username
   - **Password:** Je SMTP wachtwoord
   - **From Email:** `noreply@jouwdomein.com`
   - **From Name:** `Sober Tracker`
3. Klik **"Save"**

**Gratis SMTP providers:**
- SendGrid (100 emails/dag)
- Mailgun (5000 emails/maand eerste 3 maanden)
- Amazon SES ($0.10 per 1000 emails)

## 🔒 Authenticatie Instellingen

### Email Confirmatie

**Authentication** → **Settings** → **User Signups**:

- ✅ **Enable email confirmations:** Users moeten email verifiëren
- ⚠️ **Disable email confirmations:** Direct inloggen (niet aanbevolen voor productie)

### Password Requirements

**Authentication** → **Policies** → **Password Requirements**:
- Minimum length
- Require uppercase
- Require lowercase  
- Require numbers
- Require special characters

**Aangeraden voor productie:**
- Minimum: 8 characters
- Al least 1 uppercase
- At least 1 number

### Redirect URLs

**Authentication** → **URL Configuration**:

Voeg toe:
- `http://localhost:3000/**` (development)
- `https://jouw-app.vercel.app/**` (productie)

Dit zorgt dat redirect na email verificatie werkt.

## 📊 Database Schema

De app gebruikt deze tabellen:

### `public.sober_entries`
```sql
id          UUID (PK)
user_id     UUID (FK → auth.users)
start_date  TIMESTAMPTZ
days        INTEGER
created_at  TIMESTAMPTZ
```

### `public.user_preferences` (optioneel voor notifications)
```sql
id              UUID (PK)
user_id         UUID (FK → auth.users)
email_reminders BOOLEAN
reminder_time   TIME
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

## 🔐 Row Level Security (RLS)

Alle tabellen hebben RLS policies:
- Users kunnen **alleen hun eigen data** zien/wijzigen
- `auth.uid()` functie bepaalt huidige user
- Automatisch beveiligd tegen unauthorized access

## 🐛 Troubleshooting

### "Invalid API key"
→ Check of je de **anon public** key hebt (niet service_role)
→ Key moet beginnen met `eyJ...`
→ Check of URL en key correct zijn in `.env.local`

### Geen verificatie email ontvangen
→ Check spam folder
→ Ga naar **Authentication** → **Users** en zie of status "Waiting for verification" is
→ Test email delivery: Verstuur test mail via Supabase dashboard

### "Failed to fetch" errors
→ Check of Supabase project actief is (niet gepauzeerd)
→ Verifieer dat URLs correct zijn (geen trailing slashes)
→ Check browser console voor exacte error

### Database errors
→ Controlleer of schema correct is uitgevoerd
→ Check **Table Editor** om te zien of tabellen bestaan
→ Verifieer RLS policies in **Authentication** → **Policies**

### Email confirmatie werkt niet
→ Check **Authentication** → **Settings** → URL Configuration
→ Voeg je productie URL toe aan allowed redirect URLs
→ Test met localhost URL eerst

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [Email Templates](https://supabase.com/docs/guides/auth/server-side/email-based-auth-with-pkce-flow-for-ssr)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)

## 🎯 Na Setup

Zodra Supabase werkt:
1. ✅ Login/signup werkt met echte accounts
2. ✅ Users ontvangen verificatie emails
3. ✅ Password reset flow werkt automatisch
4. ✅ Data wordt opgeslagen in cloud database
5. ✅ Dashboard laadt entries van Supabase

**Mock auth blijft werken als fallback** als Supabase niet beschikbaar is!
