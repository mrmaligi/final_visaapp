# Temporarily Disable Email Verification

## Quick Fix (Supabase Dashboard)

1. Go to: https://supabase.com/dashboard/project/ysfwurlzkihgezfegfog/auth/providers
2. Find **Email** provider
3. Toggle **"Confirm email"** to **OFF**
4. Click **Save**

Users can now sign up without verifying their email.

---

## To Re-Enable Later

1. Go back to same URL
2. Toggle **"Confirm email"** to **ON**
3. Save

---

## Note on Security

⚠️ **Only disable this temporarily for testing!**

Without email verification:
- Anyone can sign up with any email address
- No proof that users own their email
- Higher risk of spam/fake accounts

**Re-enable before going to production.**
