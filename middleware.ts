import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Redirect Heroku domain to main domain with 301 (permanent)
  if (host.includes('herokuapp.com')) {
    const url = new URL(request.url);
    url.host = 'iptvcom.org';
    url.protocol = 'https';
    url.port = '';

    return NextResponse.redirect(url.toString(), 301);
  }

  return NextResponse.next();
}

// Only run middleware on page routes, not static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
