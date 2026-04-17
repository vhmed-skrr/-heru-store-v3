"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StatsCard } from '@/components/admin/StatsCard';
import { formatPrice } from '@/lib/utils';
import { PostgrestError } from '@supabase/supabase-js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    totalRevenue: 0,
    activeProducts: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
          { count: todayOrders },
          { data: revenueData },
          { count: activeProducts },
          { count: pendingOrders }
        ] = await Promise.all([
          supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString()),
          
          supabase
            .from('orders')
            .select('total')
            .neq('status', 'cancelled'),
            
          supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('active', true),
            
          supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')
        ]);

        const totalRev = revenueData?.reduce((acc: number, curr: { total: number }) => acc + (curr.total || 0), 0) || 0;

        setStats({
          todayOrders: todayOrders || 0,
          totalRevenue: totalRev,
          activeProducts: activeProducts || 0,
          pendingOrders: pendingOrders || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [supabase]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-arabic text-text-main mb-2">لوحة التحكم</h1>
          <p className="text-text-sec font-medium">مرحباً بك في لوحة تحكم متجر Heru Store لمتابعة الأداء</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-36 bg-white rounded-2xl border border-border animate-pulse shadow-sm"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="الإيرادات الكلية" 
            value={formatPrice(stats.totalRevenue)} 
            variant="highlight"
            description="إجمالي الطلبات المستلمة (الطلبات الملغية مستثناة)"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
          />
          <StatsCard 
            title="طلبات اليوم" 
            value={stats.todayOrders} 
            description="طلبات تم تقديمها وتسجيلها منذ منتصف الليل"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
          />
          <StatsCard 
            title="الطلبات المعلقة" 
            value={stats.pendingOrders} 
            description="الطلبات التي تحتاج لاتخاذ إجراء (تأكيد أو شحن)"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
          />
          <StatsCard 
            title="المنتجات النشطة" 
            value={stats.activeProducts} 
            description="المنتجات المتاحة والمعروضة للبيع حالياً"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>}
          />
        </div>
      )}
    </div>
  );
}
