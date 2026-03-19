import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const returnTo = requestUrl.searchParams.get('returnTo');
  
  // Determine the correct base URL
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  
  const isLocal = process.env.NODE_ENV === 'development' || 
                  requestUrl.hostname === 'localhost' || 
                  requestUrl.hostname === '127.0.0.1';
  
  let baseUrl: string;
  
  if (isLocal) {
    baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
  } else if (forwardedHost) {
    baseUrl = `${forwardedProto}://${forwardedHost}`;
  } else if (process.env.NEXT_PUBLIC_APP_URL) {
    baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  } else {
    baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
  }

  // Create response object for cookie setting
  let response = NextResponse.next();

  console.log('Auth callback - baseUrl:', baseUrl);
  console.log('Auth callback - code present:', !!code);

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    // Create server client with cookie handling
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    });

    try {
      // Exchange the code for a session
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Auth callback error:', error);
        response = NextResponse.redirect(`${baseUrl}/auth/signin?error=auth_callback`);
        return response;
      }

      if (session) {
        console.log('Auth callback - session created for user:', session.user.email);
        
        // Check user role to determine redirect destination
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

        // Determine redirect path
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
        
        response = NextResponse.redirect(redirectUrl);
        return response;
      }
    } catch (error) {
      console.error('Unexpected error in auth callback:', error);
      response = NextResponse.redirect(`${baseUrl}/auth/signin?error=unexpected`);
      return response;
    }
  }

  // If no code present, redirect to signin
  console.log('Auth callback - no code, redirecting to signin');
  response = NextResponse.redirect(`${baseUrl}/auth/signin`);
  return response;
}
