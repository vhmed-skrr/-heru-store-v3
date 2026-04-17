import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Supabase Auth Callback Route
 *
 * This route handles the PKCE code exchange for all Supabase email-based
 * flows (password reset, email confirmation, magic links).
 *
 * Supabase email links redirect here with a `code` query param.
 * We exchange it for a session, then forward the user to the `next` path.
 *
 * IMPORTANT: The Supabase Dashboard → Authentication → URL Configuration must
 * have this URL added as an allowed redirect:
 *   - Production: https://your-domain.com/auth/callback
 *   - Local dev:  http://localhost:3000/auth/callback
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // `next` is the path to redirect to after successful auth (e.g. /admin/update-password)
  const next = searchParams.get('next') ?? '/admin'

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignore: called from a Server Component; middleware handles session refresh.
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to the intended destination (same origin, never an external URL)
      const redirectUrl = new URL(next, origin)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Code missing or exchange failed → redirect to login with error indicator
  const loginUrl = new URL('/admin/login', origin)
  loginUrl.searchParams.set('error', 'auth_callback_error')
  return NextResponse.redirect(loginUrl)
}
