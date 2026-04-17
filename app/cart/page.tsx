"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { CartItem } from '@/components/cart/CartItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore(state => state.items);
  const getTotal = useCartStore(state => state.getTotal);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <main className="flex-1 bg-background py-8 min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          <nav className="flex text-sm text-text-sec mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-brand-600 transition-colors">الرئيسية</Link>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </li>
              <li className="text-text-main font-medium" aria-current="page">سلة المشتريات</li>
            </ol>
          </nav>

          <div className="mb-8 border-b border-border pb-6">
            <h1 className="text-3xl font-arabic font-bold text-text-main">سلة المشتريات</h1>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-border p-12 flex flex-col items-center justify-center min-h-[40vh]">
              <EmptyState 
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>}
                title="سلتك فارغة"
                description="لم تقم بإضافة أي منتجات للسلة بعد. تصفح منتجاتنا المميزة واكتشف العروض الحصرية."
                action={
                  <Button href="/shop" size="lg" className="mt-4 px-8">
                    متابعة التسوق
                  </Button>
                }
                className="bg-transparent border-none"
              />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Cart Items */}
              <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-border overflow-hidden self-start">
                <div className="p-4 sm:p-6 flex flex-col gap-1">
                  {items.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-1/3">
                <div className="bg-white rounded-xl shadow-sm border border-border p-6 sm:p-8 sticky top-24">
                  <h2 className="text-xl font-bold text-text-main mb-6 pb-4 border-b border-border">ملخص الطلب</h2>
                  
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center justify-between text-text-sec text-lg">
                      <span>المنتجات ({items.reduce((acc, item) => acc + item.quantity, 0)})</span>
                      <span className="tabular-nums font-medium text-text-main">{formatPrice(getTotal())}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-bold text-2xl text-text-main pt-6 border-t border-border border-dashed mb-8">
                    <span>الإجمالي:</span>
                    <span className="text-brand-600 tabular-nums">{formatPrice(getTotal())}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      size="full" 
                      onClick={() => router.push('/checkout')}
                      className="shadow-md h-12 text-base md:text-lg"
                    >
                      متابعة لإتمام الطلب
                    </Button>
                    <Link 
                      href="/shop" 
                      className="w-full px-4 py-3.5 text-brand-600 hover:bg-brand-50 border border-brand-200 font-bold rounded-md transition-colors text-center"
                    >
                      متابعة التسوق
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
