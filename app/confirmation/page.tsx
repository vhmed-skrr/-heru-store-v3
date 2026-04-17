"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-16 px-4">
      <div className="w-24 h-24 bg-success-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-success-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-arabic font-black text-text-main mb-6 leading-tight">
        تم إرسال طلبك بنجاح 🎉
      </h1>
      
      <p className="text-lg text-text-sec mb-10 font-medium leading-relaxed">
        شكراً لتسوقك معنا! لقد استلمنا طلبك وجاري العمل على تجهيزه بأسرع وقت ليكون بين يديك قريباً.
      </p>

      {orderNumber && (
        <div className="bg-white border border-border p-6 rounded-2xl mb-10 w-full shadow-sm">
          <span className="block text-text-sec text-sm mb-2 font-medium">رقم الطلب الخاص بك هو</span>
          <span className="block text-3xl font-black text-brand-600 tracking-wider font-mono bg-brand-50 mx-auto w-max px-4 py-2 rounded-lg">
            {orderNumber}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button 
          onClick={() => window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '')}`, '_blank')}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-brand-600 text-brand-600 hover:bg-brand-50 font-bold rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          تحدث مع الفريق
        </button>
        <Link 
          href="/shop" 
          className="flex-1 flex items-center justify-center px-8 py-4 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-md hover:shadow-lg"
        >
          متابعة التسوق
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <>
      <main className="flex-1 bg-bg-secondary min-h-[80vh] flex items-center justify-center">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin"></div></div>}>
          <ConfirmationContent />
        </Suspense>
      </main>
    </>
  );
}
