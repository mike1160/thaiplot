import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { adminSecretsMatch } from './lib/admin'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

function createMiddlewareSupabase(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Auth callback — no i18n rewrite
  if (pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  // Auth guard for /admin routes (except /admin/login)
  // Legacy ?secret= still allowed so existing admin bookmarks keep working
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    const secret = request.nextUrl.searchParams.get('secret')
    if (adminSecretsMatch(secret, process.env.ADMIN_SECRET)) {
      return NextResponse.next()
    }

    const response = NextResponse.next()
    const supabase = createMiddlewareSupabase(request, response)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
  }

  // Auth guard for /portal routes (except login/register/reset)
  const portalPublic = ['/portal/login', '/portal/register', '/portal/reset-password']
  if (pathname.startsWith('/portal')) {
    if (portalPublic.includes(pathname)) {
      return NextResponse.next()
    }

    const response = NextResponse.next()
    const supabase = createMiddlewareSupabase(request, response)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/portal/login', request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('disabled')
      .eq('id', user.id)
      .maybeSingle()

    // If column missing or query fails, do not block portal access
    if (profile && profile.disabled === true) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/portal/login?error=disabled', request.url))
    }

    return response
  }

  // i18n for all other routes
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/',
    '/(nl|de|th|en|sv|da|fr|ru|zh|ja)/:path*',
    '/admin/:path*',
    '/portal/:path*',
    '/auth/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
