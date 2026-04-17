"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && !isLoginPage) {
        router.push('/admin/login');
      } else if (session && isLoginPage) {
        router.push('/admin');
      }
      
      setLoading(false);
    };

    checkUser();
  }, [pathname, router, supabase, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-bg-secondary font-arabic" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 h-screen">
        {children}
      </main>
    </div>
  );
}
