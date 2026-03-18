# Fix Supabase Google Sign-in - Setup Guide

## Current Status
- **Supabase Project:** ysfwurlzkihgezfegfog
- **App URL:** (Need to confirm - localhost or production?)
- **Callback Route:** `/auth/callback` ✅ (already implemented)

---

## Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Note the **Project ID** (you'll need this)

### 1.2 Enable Google Auth Platform
1. Go to https://console.cloud.google.com/auth/overview
2. Click "Get Started" if not already configured
3. Configure **Audience**:
   - Select "External" (for production) or "Internal" (for testing)
   - Add test users if using External

### 1.3 Configure Data Access (Scopes)
Go to https://console.cloud.google.com/auth/scopes
Add these required scopes:
- ✅ `openid` (add manually)
- ✅ `/auth/userinfo.email` (default)
- ✅ `/auth/userinfo.profile` (default)

### 1.4 Configure Branding
Go to https://console.cloud.google.com/auth/branding
- App name: "VisaHelper"
- User support email: (your email)
- Developer contact: (your email)
- App logo: (optional, helps with trust)

---

## Step 2: Create OAuth Client ID

### 2.1 Create Web Application Credentials
1. Go to https://console.cloud.google.com/auth/clients
2. Click "Create Client" → "OAuth client ID"
3. Application type: **Web application**
4. Name: "VisaHelper Web"

### 2.2 Add Authorized JavaScript Origins
Add these URLs:
```
# For local development:
http://localhost:3000

# For production (Vercel):
https://final-visaapp.vercel.app
https://visahelper.com (if custom domain)
```

### 2.3 Add Authorized Redirect URIs
```
# Supabase callback URL (CRITICAL):
https://ysfwurlzkihgezfegfog.supabase.co/auth/v1/callback

# For local Supabase CLI (if testing locally):
http://127.0.0.1:54321/auth/v1/callback
```

⚠️ **IMPORTANT:** The redirect URI MUST match exactly what's in your Supabase config

### 2.4 Save Credentials
After creation, you'll get:
- **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
- **Client Secret** (keep this secret!)

---

## Step 3: Configure Supabase

### 3.1 Add Google Provider
1. Go to https://supabase.com/dashboard/project/ysfwurlzkihgezfegfog/auth/providers
2. Find "Google" and click "Enable"
3. Enter:
   - **Client ID:** (from step 2.4)
   - **Client Secret:** (from step 2.4)
4. Save

### 3.2 Configure Redirect URLs
Go to https://supabase.com/dashboard/project/ysfwurlzkihgezfegfog/auth/url-configuration

Add these redirect URLs:
```
http://localhost:3000/auth/callback
https://final-visaapp.vercel.app/auth/callback
https://visahelper.com/auth/callback
```

Also add to **Site URL**:
```
http://localhost:3000
https://final-visaapp.vercel.app
```

---

## Step 4: Test the Integration

### 4.1 Local Testing
```bash
cd /home/manik/.openclaw/workspace/final_visaapp
npm run dev
```
1. Go to http://localhost:3000/auth/signin
2. Click "Sign in with Google"
3. Should redirect to Google consent screen
4. After consent, should redirect back to `/auth/callback` then to dashboard

### 4.2 Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `redirect_uri_mismatch` | Redirect URI in Google doesn't match Supabase | Check both are exactly the same |
| `access_denied` | User denied consent | Normal, user needs to approve |
| `invalid_client` | Wrong Client ID/Secret | Re-copy from Google Cloud |
| `403: org_internal` | Using "Internal" audience with outside users | Switch to "External" or add user as test user |

---

## Step 5: Production Deployment

### 5.1 Before Going Live
1. Submit app for Google verification (if using sensitive scopes)
2. Add privacy policy and terms of service URLs
3. Verify domain ownership in Google Search Console

### 5.2 Environment Variables
Make sure these are set in Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://ysfwurlzkihgezfegfog.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Quick Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Scopes added (openid, email, profile)
- [ ] Web application OAuth client created
- [ ] Authorized JavaScript origins added
- [ ] Authorized redirect URIs added (Supabase callback URL)
- [ ] Client ID added to Supabase Dashboard
- [ ] Client Secret added to Supabase Dashboard
- [ ] Redirect URLs configured in Supabase
- [ ] Tested locally

---

## Need Help?

If you get stuck:
1. Check browser console for error messages
2. Check Supabase Auth logs: https://supabase.com/dashboard/project/ysfwurlzkihgezfegfog/logs/auth
3. Verify callback URL matches exactly (including https/http)
