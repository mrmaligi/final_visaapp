import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const returnTo = requestUrl.searchParams.get('returnTo');
  
  // Determine the correct base URL
  // Use forwarded host header for Vercel deployments behind load balancer
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  
  // For local development, use request.url
  // For production (Vercel), use forwarded headers or env variable
  const isLocal = process.env.NODE_ENV === 'development' || 
                  requestUrl.hostname === 'localhost' || 
                  requestUrl.hostname === '127.0.0.1';
  
  let baseUrl: string;
  
  if (isLocal) {
    baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
  } else if (forwardedHost) {
    // Vercel production with custom domain or deployment URL
    baseUrl = `${forwardedProto}://${forwardedHost}`;
  } else if (process.env.NEXT_PUBLIC_APP_URL) {
    // Use environment variable if set
    baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  } else {
    // Fallback to request URL
    baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
  }

  console.log('Auth callback - baseUrl:', baseUrl);
  console.log('Auth callback - code present:', !!code);

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
      // Exchange the code for a session
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(`${baseUrl}/auth/signin?error=auth_callback`);
      }

      if (session) {
        console.log('Auth callback - session created for user:', session.user.email);
        
        // Check user role to determine redirect destination
        // New users via OAuth might not have a profile yet, so handle errors gracefully
        let role = 'user';
        try {
          const { data: userData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (!profileError && userData) {
            role = userData.role;
          }
          console.log('Auth callback - user role:', role);
        } catch (e) {
          console.log('Auth callback - no profile found, defaulting to user role');
        }

        // Redirect based on role or returnTo parameter
        let redirectPath: string;
        
        if (returnTo) {
          redirectPath = returnTo;
        } else if (role === 'lawyer') {
          redirectPath = '/lawyer/dashboard';
        } else if (role === 'admin') {
          redirectPath = '/admin/dashboard';
        } else {
          redirectPath = '/user/dashboard';
        }
        
        const redirectUrl = `${baseUrl}${redirectPath}`;
        console.log('Auth callback - redirecting to:', redirectUrl);
        
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error('Unexpected error in auth callback:', error);
      return NextResponse.redirect(`${baseUrl}/auth/signin?error=unexpected`);
    }
  }

  // If no code present, redirect to signin
  console.log('Auth callback - no code, redirecting to signin');
  return NextResponse.redirect(`${baseUrl}/auth/signin`);
}
