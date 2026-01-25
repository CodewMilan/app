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

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon)
2. Click on **API** in the left sidebar
3. You'll see:
   - **Project URL**: Copy this value
   - **anon public** key: Copy this value (under "Project API keys")

## Step 3: Configure the App

1. Open `config/supabase.js` in your project
2. Replace the placeholders:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL';  // Replace with your Project URL
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';  // Replace with your anon key
   ```

## Step 4: Configure Email Templates (Optional)

Supabase sends OTP emails automatically. You can customize the email template:

1. Go to **Authentication** → **Email Templates** in Supabase dashboard
2. Customize the "Magic Link" template (used for OTP)
3. The default template works fine for testing

## Step 5: Test Authentication

1. Run your app: `npm start`
2. Try signing up with a new email
3. Check your email for the verification link
4. Try logging in with OTP:
   - Enter your email
   - Check your email for the OTP code
   - Enter the 6-digit code

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

## Security Notes

- Never commit your Supabase keys to version control
- The `anon` key is safe to use in client-side code (it's public)
- Row Level Security (RLS) policies should be set up in Supabase for production

