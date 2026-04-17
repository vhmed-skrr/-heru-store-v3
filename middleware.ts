import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT_COUNT = 60; // 60 requests
const WINDOW_MS = 60 * 1000; // per minute

export async function middleware(request: NextRequest) {
  // Simple Rate Limiting (Per serverless isolate)
  // Note: For global robust rate limiting on Vercel, it is recommended to use Vercel Edge Firewall features or Upstash Redis.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'anonymous';
  const now = Date.now();
  
  const rateLimitInfo = rateLimitMap.get(ip);
  if (!rateLimitInfo) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
  } else {
    if (now - rateLimitInfo.lastReset > WINDOW_MS) {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    } else {
      rateLimitInfo.count++;
      if (rateLimitInfo.count > RATE_LIMIT_COUNT) {
        return new NextResponse('Too Many Requests (Rate Limit Exceeded)', { status: 429 });
      }
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will naturally refresh the auth token if needed
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow the Supabase auth callback to pass through unconditionally.
  // This route handles PKCE code exchange for email links (password reset, etc.)
  // and must never be blocked or redirected.
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return supabaseResponse
  }

  // Protect /admin routes (all pages except /login and /update-password).
  // /update-password is reachable only after a valid PKCE session is established
  // by /auth/callback, so it is safe to leave unguarded here.
  const unguardedAdminPaths = ['/admin/login', '/admin/update-password']
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !unguardedAdminPaths.includes(request.nextUrl.pathname)
  ) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
