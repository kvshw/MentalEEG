import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register');
    const isRootPage = request.nextUrl.pathname === '/';

    // If trying to access auth pages while authenticated, redirect to dashboard
    if (isAuthenticated && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If accessing root page while authenticated, redirect to dashboard
    if (isAuthenticated && isRootPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If trying to access protected pages while not authenticated, redirect to login
    if (!isAuthenticated && !isAuthPage && !isRootPage) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
}; 