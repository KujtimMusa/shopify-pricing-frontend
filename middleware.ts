import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware({
  ...routing,
  localeDetection: true // Browser-Sprache automatisch erkennen
});

export const config = {
  // Match all pathnames except for API routes, static files, etc.
  matcher: ['/', '/(de|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};

