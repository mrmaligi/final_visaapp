import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const returnTo = requestUrl.searchParams.get('returnTo');

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
      // Exchange the code for a session
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL('/auth/signin?error=auth_callback', request.url));
      }

      if (session) {
        // Check user role to determine redirect destination
        const { data: userData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const role = userData?.role || 'user';

        // Redirect based on role or returnTo parameter
        if (returnTo) {
          return NextResponse.redirect(new URL(returnTo, request.url));
        }

        if (role === 'lawyer') {
          return NextResponse.redirect(new URL('/lawyer/dashboard', request.url));
        }

        return NextResponse.redirect(new URL('/user/dashboard', request.url));
      }
    } catch (error) {
      console.error('Unexpected error in auth callback:', error);
      return NextResponse.redirect(new URL('/auth/signin?error=unexpected', request.url));
    }
  }

  // If no code present, redirect to signin
  return NextResponse.redirect(new URL('/auth/signin', request.url));
}
