"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

/**
 * Update Password Page
 *
 * The admin lands here after clicking the password-reset email link.
 * Supabase has already exchanged the PKCE code via /auth/callback and
 * established a session, so supabase.auth.updateUser() will work.
 */
export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Guard: if there is no active session, the link is invalid/expired.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin/login?error=link_expired');
      }
    });
  }, [supabase, router]);

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
      // Give the user a moment to read the success message, then redirect.
      setTimeout(() => router.push('/admin'), 2500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-border p-8">

        {/* Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-arabic text-text-main mb-2">تعيين كلمة مرور جديدة</h1>
          <p className="text-sm text-text-sec">أدخل كلمة المرور الجديدة لحسابك.</p>
        </div>

        {success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium text-center border border-green-200">
            ✅ تم تحديث كلمة المرور بنجاح! سيتم توجيهك الآن...
          </div>
        ) : (
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

            <Button type="submit" loading={loading} className="w-full h-12 mt-2 font-bold text-base shadow-md">
              تحديث كلمة المرور
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
