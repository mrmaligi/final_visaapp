#!/bin/bash

echo "=========================================="
echo "Supabase Google OAuth Diagnostic Tool"
echo "=========================================="
echo ""

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from your Next.js project root"
    exit 1
fi

echo "✅ Project directory verified"
echo ""

# Check environment variables
echo "Checking Environment Variables..."
echo "-----------------------------------"

if [ -f ".env.local" ]; then
    echo "✅ .env.local file found"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "✅ NEXT_PUBLIC_SUPABASE_URL is set"
        SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d'=' -f2)
        echo "   Value: $SUPABASE_URL"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_URL is missing"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"
    fi
else
    echo "❌ .env.local file not found"
fi

echo ""
echo "Checking Required Files..."
echo "-----------------------------------"

# Check callback route
if [ -f "src/app/auth/callback/route.ts" ]; then
    echo "✅ Callback route exists: src/app/auth/callback/route.ts"
else
    echo "❌ Callback route missing"
fi

# Check AuthProvider
if [ -f "src/components/auth/AuthProvider.tsx" ]; then
    echo "✅ AuthProvider exists"
else
    echo "❌ AuthProvider missing"
fi

# Check signin page
if [ -f "src/app/auth/signin/page.tsx" ]; then
    echo "✅ Sign in page exists"
else
    echo "❌ Sign in page missing"
fi

echo ""
echo "Supabase Configuration Checklist:"
echo "-----------------------------------"
echo "1. Go to: https://supabase.com/dashboard/project/_/auth/providers"
echo "   - Find 'Google' provider"
echo "   - Verify it's enabled"
echo "   - Check Client ID is entered"
echo ""
echo "2. Go to: https://supabase.com/dashboard/project/_/auth/url-configuration"
echo "   - Add your site URL"
echo "   - Add redirect URLs:"
echo "     * http://localhost:3000/auth/callback"
echo "     * https://your-production-url/auth/callback"
echo ""

echo "Google Cloud Console Checklist:"
echo "-----------------------------------"
echo "1. Go to: https://console.cloud.google.com/auth/clients"
echo "   - Create OAuth 2.0 Client ID (Web application)"
echo "   - Add Authorized JavaScript Origins:"
echo "     * http://localhost:3000 (for dev)"
echo "     * https://your-production-url (for prod)"
echo ""
echo "2. Add Authorized Redirect URIs:"
echo "   YOUR_SUPABASE_CALLBACK_URL:"
if [ ! -z "$SUPABASE_URL" ]; then
    echo "   ${SUPABASE_URL}/auth/v1/callback"
else
    echo "   (set NEXT_PUBLIC_SUPABASE_URL to see the URL)"
fi
echo ""

echo "Next Steps:"
echo "-----------------------------------"
echo "1. Run the dev server: npm run dev"
echo "2. Visit: http://localhost:3000/auth/signin"
echo "3. Click 'Sign in with Google'"
echo "4. Check browser console for errors"
echo ""
echo "If you see 'redirect_uri_mismatch' error:"
echo "  → The redirect URI in Google Cloud doesn't match Supabase"
echo "  → Make sure both use: ${SUPABASE_URL}/auth/v1/callback"
echo ""
echo "=========================================="
