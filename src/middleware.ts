import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    '/',
    '/(nl|de|th|en|sv|da|fr|ru|zh|ja)/:path*',
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
}
