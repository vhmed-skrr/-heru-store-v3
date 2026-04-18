import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_COUNT = 60   // max requests
const WINDOW_MS = 60 * 1000  // per minute

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. Rate limiting ────────────────────────────────────────────────────────
  // Note: this in-memory map is per-serverless-isolate.
  // For production-grade global rate limiting use Vercel Edge Firewall / Upstash.
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous'
  const now = Date.now()
  const rl = rateLimitMap.get(ip)
  if (!rl) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
  } else if (now - rl.lastReset > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
  } else {
    rl.count++
    if (rl.count > RATE_LIMIT_COUNT) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }

  // ── 2. Fast-path: /auth/callback must NEVER be blocked ─────────────────────
  // This route performs the PKCE code exchange for password-reset / magic-link
  // emails. Calling getUser() before this check would waste a round-trip AND
  // could break the code exchange if the cookie store is mutated before it runs.
  if (pathname.startsWith('/auth/callback')) {
    return NextResponse.next({ request })
  }

  // ── 3. Build Supabase client and refresh session ────────────────────────────
  // IMPORTANT: The response object must be passed through and returned for
  // Supabase to be able to forward the refreshed session cookie to the browser.
  // Creating a new NextResponse.next() anywhere other than inside setAll() will
  // drop the Set-Cookie header and silently break the session, making every
  // authenticated user appear logged-out on the very next request.
  let supabaseResponse = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Can't protect routes without a working Supabase client — fail loudly.
    console.error(
      '[Middleware] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.'
    )
    return supabaseResponse
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        // Step 1: Write to the mutated request so downstream code sees them.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        // Step 2: Create a fresh response that carries the updated cookies.
        //         This MUST replace supabaseResponse so the caller returns it.
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // WHY getUser() and NOT getSession():
  // getSession() reads the JWT from the cookie without verifying it with the
  // Supabase server. A tampered or expired token would pass. getUser() makes a
  // server-side request and is the only safe way to protect routes.
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser()

  if (getUserError) {
    // Log the real error so it appears in Vercel / server logs.
    console.error('[Middleware] supabase.auth.getUser() error:', getUserError.message)
  }

  // ── 4. Protect /admin/* routes ──────────────────────────────────────────────
  // WHY the path exclusions matter:
  //   /admin/login        — the login form itself; must be reachable unauthenticated
  //   /admin/update-password — reachable only right after PKCE code exchange
  //
  // If /admin/login were not excluded, a logged-out user would be redirected to
  // /admin/login which redirects to /admin/login → infinite redirect loop.
  const publicAdminPaths = ['/admin/login', '/admin/update-password']

  if (pathname.startsWith('/admin') && !publicAdminPaths.includes(pathname)) {
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      // Clear any stale query params that came from the original request
      loginUrl.search = ''
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── 5. Return the response that carries the (possibly refreshed) session ────
  // Returning `supabaseResponse` (not a new NextResponse.next()) is critical.
  // Dropping it silently discards the refreshed token cookie, which causes the
  // user to appear logged-out on every request even after a successful login.
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static assets.
     * Regex breakdown:
     *   (?!_next/static)        – exclude static bundle chunks
     *   (?!_next/image)         – exclude image optimisation
     *   (?!favicon.ico)         – exclude favicon
     *   (?!.*\\.(...))          – exclude image file extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
