# Fix: Redirecting to localhost instead of production

## Problem
After Google Sign-in, users are redirected to `http://localhost:3000` instead of your production URL.

## Root Cause
Supabase Auth has a whitelist of allowed redirect URLs. If the production URL isn't in that list, Supabase defaults to localhost.

## Solution

### Step 1: Add Production URLs to Supabase

1. Go to: https://supabase.com/dashboard/project/ysfwurlzkihgezfegfog/auth/url-configuration

2. Add these URLs to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://final-visaapp.vercel.app/auth/callback
   https://visahelper.com/auth/callback (if you have custom domain)
   ```

3. Set **Site URL** to your production domain:
   ```
   https://final-visaapp.vercel.app
   ```

4. Click **Save**

### Step 2: Verify (Wait 1-2 minutes)

Supabase config can take a minute to propagate. After saving, wait 1-2 minutes then test again.

---

## Alternative: Hardcode Production URL

If you want to force production URL regardless of where the code runs, update `AuthProvider.tsx`:

```typescript
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Change this line from window.location.origin to your production URL
      redirectTo: 'https://final-visaapp.vercel.app/auth/callback',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  return { error };
};
```

⚠️ **Note:** Hardcoding means local development won't work for OAuth - only use this temporarily for testing.

---

## Quick Checklist

- [ ] Added `https://final-visaapp.vercel.app/auth/callback` to Supabase Redirect URLs
- [ ] Set Site URL to `https://final-visaapp.vercel.app`
- [ ] Waited 1-2 minutes for config to propagate
- [ ] Tested Google Sign-in again

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing `/auth/callback` path | Must include full path: `/auth/callback` |
| Using `http` instead of `https` for production | Production must use `https` |
| Trailing slash differences | `https://example.com` vs `https://example.com/` - must match exactly |
| Not saving changes | Click Save button in Supabase dashboard |

---

## Verification

After fixing, the redirect should go to:
```
https://final-visaapp.vercel.app/auth/callback?code=xxx
```

Instead of:
```
http://localhost:3000/#access_token=xxx
```
