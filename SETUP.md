# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: `prolaunchhub` (or any name you prefer)
   - Database Password: (choose a strong password)
   - Region: (choose closest to you)
5. Click "Create new project"
6. Wait for the project to be set up (takes 1-2 minutes)

## Step 2: Get Your API Credentials (for .env)

1. In your Supabase project dashboard, go to **Settings** (gear icon)
2. Click on **API** in the left sidebar
3. Copy these two values:
   - **Project URL** → use for `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** key (under "Project API keys") → use for `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Configure the App with Environment Variables

1. In the project root, copy the example env file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set your Supabase values (from Step 2):
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
   ```
3. Restart the app after changing `.env` (e.g. `npx expo start`).

**Do not commit `.env`** — it is in `.gitignore`. Commit `.env.example` only (without real keys).

| Env variable | Where to get it in Supabase |
|--------------|-----------------------------|
| `EXPO_PUBLIC_SUPABASE_URL` | **Settings** → **API** → **Project URL** |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | **Settings** → **API** → **Project API keys** → **anon** (public) |

## Step 4: Enable Email + Password Auth (Supabase Dashboard)

The app supports **email OTP** (magic link style) and **email + password** login.

1. In Supabase: **Authentication** → **Providers**
2. **Email** is on by default. Under Email you can:
   - Leave "Confirm email" on if you want new sign-ups to verify email (recommended).
   - For **password sign-in**: users who register with email+password can then log in with the same password; no extra config needed.
3. (Optional) **Authentication** → **Email Templates** to customize OTP/confirmation emails.

## Step 5: Configure Email Templates (Optional)

Supabase sends OTP emails automatically. You can customize the email template:

1. Go to **Authentication** → **Email Templates** in Supabase dashboard
2. Customize the "Magic Link" template (used for OTP)
3. The default template works fine for testing

## Step 6: Test Authentication

1. Run your app: `npm start`
2. **Register**: Tap "Don't have an account? Register now" → create account with email + password (+ name, college).
3. **Login with password**: On Login, tap "I have a password", enter email + password, then Login.
4. **Login with OTP**: Enter email only → "Send OTP" → enter the 6-digit code from your email.

## Troubleshooting

### OTP not received?
- Check your spam folder
- Verify your Supabase project is active
- Check Supabase logs: **Logs** → **Auth Logs**

### "Invalid API key" error?
- Make sure you copied the **anon public** key, not the service_role key
- Verify there are no extra spaces in your config file

### Email not sending?
- Supabase free tier has email limits
- Check your project's email quota in the dashboard
- For production, consider using a custom SMTP server

## Where Registration Data Is Stored

When a user registers (Sign Up), data is stored in Supabase as follows:

- **Auth user**: Email and account are stored in **Authentication** (Supabase → Authentication → Users). You’ll see the user there after the first sign-up.
- **Profile fields**: Full name and college are sent as **user metadata** and stored with the auth user (visible in the user’s **User Metadata** in the Supabase dashboard). There is no separate `profiles` table; the app uses auth user metadata only.

After enabling Email in Supabase (and optionally “Confirm email” and Email OTP), registration and login will work end-to-end.

## Security Notes

- Never commit your Supabase keys to version control
- The `anon` key is safe to use in client-side code (it's public)
- Row Level Security (RLS) policies should be set up in Supabase for production



