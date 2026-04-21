import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin')) {
    if (path === '/admin/login') {
      const hasToken = !!request.cookies.get('admin_token');
      if (hasToken) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    const hasToken = !!request.cookies.get('admin_token');
    if (!hasToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
