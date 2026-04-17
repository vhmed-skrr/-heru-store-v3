"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

type ViewMode = 'login' | 'forgot';

export default function AdminLogin() {
  const [view, setView] = useState<ViewMode>('login');

  // ── Login state ─────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ── Forgot-password state ────────────────────────────────
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // ── Shared state ─────────────────────────────────────────
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Show a friendly message when redirected here with an error code
  useEffect(() => {
    const errorCode = searchParams.get('error');
    if (errorCode === 'auth_callback_error') {
      setError('انتهت صلاحية الرابط أو أنه غير صالح. يرجى طلب رابط جديد.');
    } else if (errorCode === 'link_expired') {
      setError('انتهت صلاحية رابط إعادة التعيين. يرجى طلب رابط جديد.');
    }
  }, [searchParams]);

  // ── Login ────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  // ── Forgot password ──────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    /**
     * redirectTo must point to the /auth/callback route on THIS domain.
     * Using window.location.origin ensures it works in both:
     *   - Local dev  → http://localhost:3000/auth/callback
     *   - Production → https://your-domain.com/auth/callback
     *
     * The `next` query param tells /auth/callback where to send the user
     * after the PKCE code exchange succeeds.
     */
    const redirectTo = `${window.location.origin}/auth/callback?next=/admin/update-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      resetEmail,
      { redirectTo }
    );

    if (resetError) {
      setError('فشل إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.');
    } else {
      setResetSent(true);
    }

    setLoading(false);
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-border p-8">

        {/* Header icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-arabic text-text-main mb-2">لوحة الإدارة</h1>
          <p className="text-sm text-text-sec">
            {view === 'login' ? 'قم بتسجيل الدخول للمتابعة' : 'أدخل بريدك لإعادة تعيين كلمة المرور'}
          </p>
        </div>

        {/* Shared error banner */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-200 mb-5">
            {error}
          </div>
        )}

        {/* ── LOGIN VIEW ────────────────────────────────── */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />

            <Input
              label="كلمة المرور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
            />

            <Button type="submit" loading={loading} className="w-full h-12 mt-2 font-bold text-base shadow-md">
              دخول
            </Button>

            <button
              type="button"
              onClick={() => { setError(''); setView('forgot'); }}
              className="text-sm text-brand-600 hover:underline text-center mt-1 transition-opacity hover:opacity-80"
            >
              نسيت كلمة المرور؟
            </button>
          </form>
        )}

        {/* ── FORGOT PASSWORD VIEW ──────────────────────── */}
        {view === 'forgot' && (
          <>
            {resetSent ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium text-center border border-green-200">
                ✅ تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني. يرجى فحص صندوق الوارد.
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  dir="ltr"
                />

                <Button type="submit" loading={loading} className="w-full h-12 mt-2 font-bold text-base shadow-md">
                  إرسال رابط إعادة التعيين
                </Button>
              </form>
            )}

            <button
              type="button"
              onClick={() => { setError(''); setResetSent(false); setView('login'); }}
              className="block text-sm text-text-sec hover:text-text-main text-center mt-5 transition-colors"
            >
              ← العودة إلى تسجيل الدخول
            </button>
          </>
        )}

      </div>
    </div>
  );
}
