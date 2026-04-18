"use client";

/**
 * Admin Login Page
 *
 * WHY THE OLD CODE CAUSED "invalid credentials" FOR CORRECT PASSWORDS:
 *
 * 1. Generic error swallowing:
 *    The old code showed "البريد الإلكتروني أو كلمة المرور غير صحيحة" for
 *    EVERY error from Supabase — including "Email not confirmed",
 *    "Invalid API key", "Failed to fetch" (network), etc. This masked the
 *    real cause completely.
 *
 * 2. Supabase client re-created on every render:
 *    `const supabase = createClient()` at the top level of a React component
 *    runs on each render. While createBrowserClient() is internally a
 *    singleton, wrapping it in a ref is the correct pattern to guarantee
 *    a single stable instance and avoid subtle race conditions if the
 *    component re-renders mid-request.
 *
 * 3. Missing Suspense boundary around useSearchParams():
 *    Next.js 15 requires components that call useSearchParams() to be wrapped
 *    in a <Suspense> boundary, otherwise the page opts out of static rendering
 *    and can throw during the server-render pass, breaking hydration.
 */

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type ViewMode = 'login' | 'forgot'

// ─── Inner component uses useSearchParams → must live inside <Suspense> ────────

function LoginForm() {
  const [view, setView] = useState<ViewMode>('login')

  // Login
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  // Forgot password
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent]   = useState(false)

  // Shared
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const router       = useRouter()
  const searchParams = useSearchParams()

  // Stable Supabase client — one instance for the lifetime of this component.
  const supabaseRef = useRef(createClient())
  const supabase    = supabaseRef.current

  // Show a friendly banner if the auth/callback redirected here with an error.
  useEffect(() => {
    const code = searchParams.get('error')
    if (code === 'auth_callback_error') {
      setError('انتهت صلاحية الرابط أو أنه غير صالح. يرجى طلب رابط جديد.')
    } else if (code === 'link_expired') {
      setError('انتهت صلاحية رابط إعادة التعيين. يرجى طلب رابط جديد.')
    }
  }, [searchParams])

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError) {
      /**
       * Show the ACTUAL Supabase error message.
       *
       * Common real errors that the generic message was hiding:
       *   "Invalid login credentials"     → truly wrong email/password
       *   "Email not confirmed"           → user never clicked the confirmation email
       *   "Invalid API key"               → NEXT_PUBLIC_SUPABASE_ANON_KEY is wrong
       *   "Failed to fetch"               → NEXT_PUBLIC_SUPABASE_URL is wrong / network down
       *   "AuthRetryableFetchError"       → transient network failure
       */
      console.error('[Login] signInWithPassword failed:', {
        message: signInError.message,
        status:  signInError.status,
        code:    (signInError as { code?: string }).code,
        full:    signInError,
      })

      // Map specific Supabase codes to user-friendly Arabic messages,
      // but always fall back to the real English message so nothing is hidden.
      const friendlyMessages: Record<string, string> = {
        'Invalid login credentials':
          'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
        'Email not confirmed':
          'يرجى تأكيد بريدك الإلكتروني أولاً عبر الرابط المُرسَل إليك.',
      }

      setError(
        friendlyMessages[signInError.message] ??
        `خطأ في تسجيل الدخول: ${signInError.message}`
      )
      setLoading(false)
      return
    }

    console.log('[Login] signInWithPassword succeeded. User:', data.user?.email)

    // router.push does a client-side navigation.
    // The middleware will see the fresh session cookie and allow /admin.
    router.push('/admin')
    // Keep loading=true so the button stays disabled during navigation.
  }

  // ── Forgot password ────────────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    /**
     * Always use window.location.origin — never a hardcoded hostname.
     * This makes the same code work for:
     *   Local dev  → http://localhost:3000/auth/callback?next=/reset-password
     *   Production → https://your-domain.com/auth/callback?next=/reset-password
     */
    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      resetEmail.trim(),
      { redirectTo }
    )

    if (resetError) {
      console.error('[Login] resetPasswordForEmail failed:', resetError)
      setError(`فشل إرسال البريد الإلكتروني: ${resetError.message}`)
    } else {
      console.log('[Login] Password reset email sent to:', resetEmail)
      setResetSent(true)
    }

    setLoading(false)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Shared error banner */}
      {error && (
        <div
          role="alert"
          className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-200 mb-5 leading-relaxed"
        >
          {error}
        </div>
      )}

      {/* ── LOGIN VIEW ────────────────────────────────────── */}
      {view === 'login' && (
        <form onSubmit={handleLogin} className="flex flex-col gap-5" noValidate>
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
            autoComplete="email"
          />
          <Input
            label="كلمة المرور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            dir="ltr"
            autoComplete="current-password"
          />
          <Button type="submit" loading={loading} className="w-full h-12 mt-2 font-bold text-base shadow-md">
            دخول
          </Button>
          <button
            type="button"
            onClick={() => { setError(''); setView('forgot') }}
            className="text-sm text-brand-600 hover:underline text-center mt-1 transition-opacity hover:opacity-80"
          >
            نسيت كلمة المرور؟
          </button>
        </form>
      )}

      {/* ── FORGOT PASSWORD VIEW ──────────────────────────── */}
      {view === 'forgot' && (
        <>
          {resetSent ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium text-center border border-green-200">
              ✅ تم إرسال رابط إعادة التعيين. يرجى فحص صندوق الوارد.
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-5" noValidate>
              <Input
                label="البريد الإلكتروني"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                dir="ltr"
                autoComplete="email"
              />
              <Button type="submit" loading={loading} className="w-full h-12 mt-2 font-bold text-base shadow-md">
                إرسال رابط إعادة التعيين
              </Button>
            </form>
          )}

          <button
            type="button"
            onClick={() => { setError(''); setResetSent(false); setView('login') }}
            className="block text-sm text-text-sec hover:text-text-main text-center mt-5 transition-colors"
          >
            ← العودة إلى تسجيل الدخول
          </button>
        </>
      )}
    </>
  )
}

// ─── Page shell ────────────────────────────────────────────────────────────────

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-border p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-arabic text-text-main mb-2">لوحة الإدارة</h1>
          <p className="text-sm text-text-sec">قم بتسجيل الدخول للمتابعة</p>
        </div>

        {/*
          useSearchParams() inside LoginForm causes it to suspend on SSR.
          The <Suspense> boundary tells Next.js to render the fallback on the
          server and hydrate the real form client-side — this is required in
          Next.js 15 App Router.
        */}
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>

      </div>
    </div>
  )
}
