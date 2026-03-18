import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define route types
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/pricing',
  '/help',
  '/terms',
  '/privacy',
  '/auth/signin',
  '/auth/signup',
  '/auth/callback',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
];

const PROTECTED_USER_ROUTES = ['/user'];
const PROTECTED_LAWYER_ROUTES = ['/lawyer'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create a response object
  const response = NextResponse.next();

  // Create Supabase client for middleware
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Refresh session if it exists
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the current path matches any protected route patterns
  const isProtectedUserRoute = PROTECTED_USER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isProtectedLawyerRoute = PROTECTED_LAWYER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  ) || 
  // Allow static files and API routes
  pathname.startsWith('/_next') ||
  pathname.startsWith('/api') ||
  pathname.startsWith('/static') ||
  pathname.includes('.');

  // Redirect unauthenticated users to signin page for protected routes
  if ((isProtectedUserRoute || isProtectedLawyerRoute) && !session) {
    const signInUrl = new URL('/auth/signin', request.url);
    // Add the original URL as a return parameter
    signInUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (session && pathname.startsWith('/auth/') && !pathname.startsWith('/auth/callback')) {
    // Get user role from user metadata or check lawyer table
    const { data: userData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const role = userData?.role || 'user';

    if (role === 'lawyer') {
      return NextResponse.redirect(new URL('/lawyer/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }

  // Role-based access control
  if (session && isProtectedLawyerRoute) {
    // Check if user has lawyer role
    const { data: userData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userData?.role !== 'lawyer') {
      // Redirect non-lawyers to user dashboard
      return NextResponse.redirect(new URL('/user/dashboard', request.url));
    }
  }

  return response;
}

// Configure middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
