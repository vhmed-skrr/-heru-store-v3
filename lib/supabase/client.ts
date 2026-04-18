import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase browser client for use in Client Components ("use client").
 *
 * WHY THIS CAN CAUSE "invalid credentials" SILENTLY:
 * If NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are undefined at
 * runtime (missing from .env.local, or not prefixed with NEXT_PUBLIC_), the
 * createBrowserClient call receives "undefined" as a string. Supabase then sends
 * auth requests to the wrong URL and returns a 4xx that the caller interprets as
 * "wrong credentials" even though the real error is a misconfiguration.
 *
 * This guard throws immediately at startup so the real cause is obvious.
 */
export function createClient() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    const missing = [
      !url  && 'NEXT_PUBLIC_SUPABASE_URL',
      !key  && 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ].filter(Boolean).join(', ')

    throw new Error(
      `[Supabase] Missing environment variable(s): ${missing}. ` +
      'Make sure they are defined in .env.local and prefixed with NEXT_PUBLIC_.'
    )
  }

  return createBrowserClient(url, key)
}
