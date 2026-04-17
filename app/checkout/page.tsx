"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore(state => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.replace('/cart');
    }
  }, [mounted, items, router]);

  if (!mounted || items.length === 0) return null;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-bg-secondary py-8 min-h-[80vh]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-10 text-center md:text-right">
            <h1 className="text-3xl md:text-4xl font-arabic font-bold text-text-main">إتمام الطلب</h1>
            <p className="text-text-sec mt-3 font-medium">خطوة واحدة تفصلك عن استلام منتجاتك المميزة، يرجى إكمال بياناتك</p>
          </div>
          
          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
