# CatchSmart Authentication Setup Guide

## 🚀 Quick Start

### 1. Environment Variables

**IMPORTANT:** Create a `.env.local` file (not `.env`) in the `apps/web` directory:

```bash
# Navigate to web app directory
cd apps/web

# Copy the example file
cp .env.local.example .env.local

# Edit with your actual values
# - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anon key
# - OPENAI_API_KEY: Your OpenAI API key (get a new one if exposed)
```

### 2. Configure Supabase Authentication

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to Authentication → Providers
3. Enable the following providers:

#### Email/Password
- ✅ Enable Email provider
- ✅ Enable email confirmations (optional)

#### Google OAuth
1. Enable Google provider
2. Get credentials from [Google Cloud Console](https://console.cloud.google.com/):
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     ```
     https://YOUR_PROJECT.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     http://localhost:3000/[locale]/auth/callback
     ```
3. Copy Client ID and Secret to Supabase

#### Apple OAuth
1. Enable Apple provider
2. Requires Apple Developer account
3. Create App ID and Service ID
4. Configure Sign in with Apple

### 3. Add Redirect URLs in Supabase

Go to Authentication → URL Configuration and add:

**Site URL:**
```
http://localhost:3000
```

**Redirect URLs:**
```
http://localhost:3000/auth/callback
http://localhost:3000/de/auth/callback
http://localhost:3000/en/auth/callback
http://localhost:3000/es/auth/callback
https://YOUR_DOMAIN.com/auth/callback
https://YOUR_DOMAIN.com/de/auth/callback
https://YOUR_DOMAIN.com/en/auth/callback
https://YOUR_DOMAIN.com/es/auth/callback
```

### 4. Run the Application

```bash
# From the web app directory
pnpm dev

# Or from project root
pnpm --filter web dev
```

## 🔍 Troubleshooting

### "Your project's URL and Key are required" Error
- Make sure you have `.env.local` (not `.env`)
- Restart the development server after creating the file
- Check that the file is in `apps/web/` directory

### OAuth buttons are disabled
- Accept the terms and conditions checkbox first
- Check browser console for any errors

### Loading spinner stuck
- Check browser console for errors
- Verify Supabase configuration
- Make sure redirect URLs are correctly configured

### "Invalid credentials" on login
- User might not exist - try registering first
- Check if email confirmations are required in Supabase

## 🔐 Security Notes

- **NEVER** commit `.env.local` to git
- **NEVER** share your API keys publicly
- Regenerate any exposed API keys immediately
- Use Row Level Security (RLS) in Supabase

## 📝 Testing Checklist

- [ ] Environment variables loaded (no console errors)
- [ ] Can register new account with email/password
- [ ] Terms and conditions links work
- [ ] Google OAuth redirects properly
- [ ] Apple OAuth redirects properly (if configured)
- [ ] Successful login redirects to `/[locale]/equipment`
- [ ] Auth state persists on page refresh
- [ ] Sign out works correctly

## 🎯 Next Steps

1. Configure email templates in Supabase
2. Set up password reset flow
3. Add email confirmation handling
4. Implement proper error messages
5. Add loading states for better UX
