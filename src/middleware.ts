import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Get session from cookie
  const session = await supabase.auth.getSession();
  
  // Protected routes
  const protectedRoutes = ['/user', '/admin', '/lawyer'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !session.data.session) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*', '/lawyer/:path*'],
};
