import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  // Create server client with proper cookie handling
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        req.cookies.set({ name, value, ...options });
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        req.cookies.set({ name, value: '', ...options });
        res.cookies.set({ name, value: '', ...options });
      },
    },
  });

  // Get session from cookie
  const { data: { session } } = await supabase.auth.getSession();
  
  // Protected routes
  const protectedRoutes = ['/user', '/admin', '/lawyer'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Auth routes (should not be accessible if logged in)
  const authRoutes = ['/auth/signin', '/auth/signup'];
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/signin', req.url);
    redirectUrl.searchParams.set('returnTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && session) {
    // Check user role for redirect
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    const role = profile?.role || 'user';
    let dashboardUrl = '/user/dashboard';
    if (role === 'lawyer') dashboardUrl = '/lawyer/dashboard';
    if (role === 'admin') dashboardUrl = '/admin/dashboard';
    
    return NextResponse.redirect(new URL(dashboardUrl, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/user/:path*', 
    '/admin/:path*', 
    '/lawyer/:path*',
    '/auth/signin',
    '/auth/signup',
  ],
};
