import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase server client for use in Server Components, Route Handlers,
 * and Server Actions.
 *
 * WHY THIS CAN CAUSE "invalid credentials" SILENTLY:
 * Same as the browser client: if the env vars are undefined, the client
 * targets a malformed URL. Supabase returns a network/4xx error that surfaces
 * to the caller as an auth failure instead of a configuration error.
 *
 * Additionally, if setAll() throws and the error is swallowed silently, the
 * session cookie is never written after login, so every subsequent request
 * appears unauthenticated — making it look like the login failed.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    const missing = [
      !url && 'NEXT_PUBLIC_SUPABASE_URL',
      !key && 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ].filter(Boolean).join(', ')

    throw new Error(
      `[Supabase/server] Missing environment variable(s): ${missing}. ` +
      'Make sure they are defined in .env.local and prefixed with NEXT_PUBLIC_.'
    )
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch (err) {
          /**
           * setAll() is called from a Server Component during a read-only
           * render pass. This is expected and safe to ignore because our
           * middleware handles token refresh and writes the updated cookie.
           * We log at debug level so the error is visible if something
           * unexpected happens outside of a Server Component context.
           */
          console.debug('[Supabase/server] setAll() called in read-only context (expected):', err)
        }
      },
    },
  })
}
