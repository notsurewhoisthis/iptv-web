import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const canonicalHost = (() => {
    try {
      const raw =
        process.env.NEXT_PUBLIC_URL ||
        process.env.SITE_URL ||
        '';
      return raw ? new URL(raw).host : '';
    } catch {
      return '';
    }
  })();
  const isLocalHost =
    host.includes('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('[::1]');
  const normalizedPathname =
    request.nextUrl.pathname === '/&' ? '/' : request.nextUrl.pathname;

  // Redirect Heroku domain to main domain with 301 (permanent)
  if (host && canonicalHost && host !== canonicalHost && !isLocalHost) {
    const url = request.nextUrl.clone();
    url.hostname = canonicalHost;
    url.protocol = 'https:';
    url.port = '';
    url.pathname = normalizedPathname;
    return NextResponse.redirect(url.toString(), 301);
  }

  if (normalizedPathname !== request.nextUrl.pathname) {
    const url = request.nextUrl.clone();
    url.pathname = normalizedPathname;
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
