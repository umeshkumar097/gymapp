import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const roleCookie = request.cookies.get('user_role');

    // Protect all /godeye routes except the login page
    if (pathname.startsWith('/godeye') && pathname !== '/godeye/login') {
        // Must have an Admin cookie
        if (!roleCookie || roleCookie.value !== 'Admin') {
            const loginUrl = new URL('/godeye/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Protect all /partner routes except the main /partner landing/login page
    if (pathname.startsWith('/partner/') && pathname !== '/partner') {
        // [DEBUG] Temporarily disabled to debug white screen
        // if (!roleCookie || roleCookie.value !== 'GymOwner') {
        //     const loginUrl = new URL('/partner', request.url);
        //     return NextResponse.redirect(loginUrl);
        // }
    }

    // Protect customer dashboard
    if (pathname.startsWith('/dashboard')) {
        // If not logged in at all, redirect to home
        if (!roleCookie) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
