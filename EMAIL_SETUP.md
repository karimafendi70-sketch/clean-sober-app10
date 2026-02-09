# Email Notifications Setup Guide

## ✅ Features
- 📧 Dagelijkse email reminders met je huidige streak
- ⏰ Configureerbare tijd voor reminders
- 🎨 Mooi opgemaakte HTML emails met milestones
- 🧪 Test email functie om te verifiëren

## 🚀 Quick Start

### 1. Resend API Key ophalen (gratis)

1. Ga naar [resend.com/signup](https://resend.com/signup)
2. Maak een gratis account (3000 emails/maand)
3. Ga naar [API Keys](https://resend.com/api-keys)
4. Klik **"Create API Key"**
5. Kopieer de key (begint met `re_...`)

### 2. Environment Variables toevoegen

**Lokaal:**
Voeg toe aan `.env.local`:
```env
RESEND_API_KEY=re_jouw_api_key_hier
CRON_SECRET=willekeurige_random_string_123
```

**Productie (Vercel):**
```bash
vercel env add RESEND_API_KEY production
vercel env add CRON_SECRET production
```

### 3. Test de emails

1. Ga naar [/settings](http://localhost:3000/settings)
2. Vul je email adres in
3. Zet "Email reminders" aan
4. Klik **"Verstuur test email"**
5. Check je inbox! 📬

## 📋 Features in Settings Pagina

- ✉️ Email adres configureren
- 🔔 Email reminders aan/uit zetten
- ⏰ Reminder tijd instellen
- 🧪 Test email versturen
- 💾 Voorkeuren opslaan in localStorage

## 🤖 Automatische Dagelijkse Emails

De app gebruikt **Vercel Cron** om dagelijks emails te versturen:

- **Schedule:** Elke dag om 9:00 AM UTC
- **Endpoint:** `/api/cron/send-daily-reminders`
- **Configuratie:** `vercel.json`

### Hoe het werkt:

1. Vercel roept dagelijks de cron endpoint aan
2. De endpoint checkt welke users reminders willen
3. Voor elke user wordt een gepersonaliseerde email verstuurd
4. Email bevat:
   - Huidige streak dagen
   - Milestone emoji (🌱⭐🥉🥈🏆)
   - Motiverende boodschap
   - Link naar dashboard

## 📧 Email Template Features

- ✨ Responsive HTML design
- 🎨 Groene gradient theme (past bij de app)
- 🏆 Dynamische milestone emojis:
  - 🌱 7 dagen
  - ⭐ 30 dagen
  - 🥉 90 dagen
  - 🥈 180 dagen
  - 🏆 365+ dagen
- 🔗 Direct link naar dashboard
- ⚙️ Link naar settings om uit te schrijven

## 🔒 Security

- `CRON_SECRET` wordt gebruikt om de cron endpoint te beveiligen
- Alleen requests met correcte Authorization header worden verwerkt
- API keys worden server-side gebruikt (niet in client)

## 🐛 Troubleshooting

**"Email service not configured"**
→ Check of `RESEND_API_KEY` correct is ingesteld

**"Failed to send email"**
→ Verifieer dat je Resend account actief is en credits heeft

**Geen emails ontvangen**
→ Check spam folder
→ Gebruik test email functie om configuratie te testen

**Cron werkt niet**
→ Check Vercel logs: `vercel logs`
→ Verifieer dat `CRON_SECRET` is ingesteld in productie

## 📚 API Endpoints

### POST /api/send-reminder
Verstuurt een reminder email naar een specifiek adres.

**Body:**
```json
{
  "email": "user@example.com",
  "days": 42,
  "milestones": []
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "abc123"
}
```

### GET /api/cron/send-daily-reminders
Cron endpoint voor dagelijkse batch emails (alleen via Vercel Cron).

**Headers:**
```
Authorization: Bearer {CRON_SECRET}
```

## 🎯 Toekomstige Features

- [ ] Custom email templates per milestone
- [ ] Weekly/monthly summary emails
- [ ] Email bij streak breaks (optioneel)
- [ ] Multiple reminder times per dag
- [ ] Email voorkeuren opslaan in database (ipv localStorage)
- [ ] Unsubscribe link met database tracking
