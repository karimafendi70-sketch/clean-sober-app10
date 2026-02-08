# Clean Sober App

Minimal Next.js app with a simple Sober Tracker component.

Run locally:

```bash
npm install
npm run dev
```

Supabase setup:

- Create a Supabase project at https://app.supabase.com
- Copy the `URL` and `anon` key into `.env.local` using the variables in `.env.local.example`.
- The login page is available at `/login` and uses Supabase Auth (email/password).

Deploying:

- Deploy to Vercel and add the same environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel dashboard.
- Then push to GitHub and import the repo in Vercel (or connect via CLI).
