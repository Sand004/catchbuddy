import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Always use a locale prefix in the URL (e.g. /de/about)
  localePrefix: 'always',
  
  // Automatically redirect to locale based on Accept-Language header
  localeDetection: true
})

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    '/',
    '/(de|en|es)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}
