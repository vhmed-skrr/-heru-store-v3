"use client";

/**
 * /reset-password
 *
 * This page is the landing point after a user clicks a Supabase password-reset
 * email link. It robustly handles three session-establishment scenarios:
 *
 *   1. PKCE via /auth/callback (recommended):
 *      Email link → /auth/callback?code=xxx&next=/reset-password
 *      The callback route exchanges the code server-side, sets the session
 *      in a cookie, and redirects here. getSession() returns it immediately.
 *
 *   2. PKCE direct (Supabase Dashboard redirect URL points here):
 *      Email link → /reset-password?code=xxx
 *      We call exchangeCodeForSession(code) client-side.
 *
 *   3. Implicit flow (legacy email templates with URL hash tokens):
 *      Email link → /reset-password#access_token=xxx&type=recovery
 *      The Supabase browser client fires onAuthStateChange('PASSWORD_RECOVERY').
 *      We listen for it and mark the session as ready.
 *
 * Only after the session is confirmed do we show the password update form.
 */

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// ─── Inner form — uses useSearchParams() so must be inside <Suspense> ──────────

function ResetPasswordForm() {
  // Session-detection states
  const [checking, setChecking] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);

  // Form states
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Use a ref so the supabase client is stable and never re-created between renders
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  // ── Session detection on mount ─────────────────────────────────────────────
  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | null = null;
    let safetyTimeout: ReturnType<typeof setTimeout> | null = null;

    const detectSession = async () => {
      // ── Scenario 2: ?code= directly in URL (Supabase Dashboard redirects here) ──
      const code = searchParams.get('code');
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError('رابط إعادة التعيين غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.');
        } else {
          setSessionReady(true);
        }
        setChecking(false);
        return;
      }

      // ── Scenario 1: Session cookie set by /auth/callback (most common path) ──
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
        setChecking(false);
        return;
      }

      // ── Scenario 3: Implicit flow — URL hash tokens ───────────────────────
      // Supabase JS reads the hash automatically and fires PASSWORD_RECOVERY.
      const { data } = supabase.auth.onAuthStateChange((event, sess) => {
        if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && sess) {
          setSessionReady(true);
          setChecking(false);
          authSubscription?.unsubscribe();
          if (safetyTimeout) clearTimeout(safetyTimeout);
        }
      });
      authSubscription = data.subscription;

      // Safety net: if no auth event fires within 5s, show a helpful error
      safetyTimeout = setTimeout(() => {
        authSubscription?.unsubscribe();
        setError(
          'لم يتم التعرف على جلسة الاسترداد. ' +
          'قد يكون الرابط منتهي الصلاحية أو تم استخدامه مسبقاً. يرجى طلب رابط جديد.'
        );
        setChecking(false);
      }, 5000);
    };

    detectSession();

    return () => {
      authSubscription?.unsubscribe();
      if (safetyTimeout) clearTimeout(safetyTimeout);
    };
  // searchParams is stable after initial render; supabase is a ref — safe empty deps.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Password update ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
      return;
    }
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError('فشل تحديث كلمة المرور. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    } else {
      setSuccess(true);
      // Sign out so the admin logs back in freshly with the new password
      await supabase.auth.signOut();
      setTimeout(() => router.push('/admin/login'), 2500);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  // While detecting session
  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        <p className="text-sm text-text-sec">جارٍ التحقق من صلاحية الرابط...</p>
      </div>
    );
  }

  // Session detection failed
  if (!sessionReady) {
    return (
      <div className="flex flex-col gap-5">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium text-center border border-red-200 leading-relaxed">
          {error}
        </div>
        <Link
          href="/admin/login"
          className="block text-center text-sm font-semibold text-brand-600 hover:underline"
        >
          طلب رابط إعادة تعيين جديد
        </Link>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium text-center border border-green-200 leading-relaxed">
        ✅ تم تحديث كلمة المرور بنجاح!
        <br />
        <span className="text-green-600">جارٍ التوجيه إلى صفحة الدخول...</span>
      </div>
    );
  }

  // Password update form
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-200">
          {error}
        </div>
      )}

      <Input
        label="كلمة المرور الجديدة"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        dir="ltr"
      />

      <Input
        label="تأكيد كلمة المرور"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        dir="ltr"
      />

      <p className="text-xs text-text-sec text-center">
        كلمة المرور يجب أن تكون 8 أحرف على الأقل.
      </p>

      <Button
        type="submit"
        loading={loading}
        className="w-full h-12 mt-1 font-bold text-base shadow-md"
      >
        تحديث كلمة المرور
      </Button>

      <Link
        href="/admin/login"
        className="block text-sm text-text-sec hover:text-text-main text-center transition-colors"
      >
        ← العودة إلى تسجيل الدخول
      </Link>
    </form>
  );
}

// ─── Page shell ────────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-border p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32" height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-arabic text-text-main mb-2">
            تعيين كلمة مرور جديدة
          </h1>
          <p className="text-sm text-text-sec">
            أدخل كلمة المرور الجديدة لحسابك الإداري.
          </p>
        </div>

        {/*
          Suspense is required by Next.js 15 because useSearchParams()
          inside ResetPasswordForm causes the component to suspend on SSR.
        */}
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>

      </div>
    </div>
  );
}
