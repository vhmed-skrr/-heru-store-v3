'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the console for debugging
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-red-500 mb-6 bg-red-50 p-6 rounded-full inline-flex">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-text mb-4">حدث خطأ غير متوقع</h1>
      <p className="text-text-sec mb-8 max-w-md">
        نأسف للإزعاج. واجهنا مشكلة أثناء معالجة طلبك، يرجى المحاولة مرة أخرى أو العودة للرئيسية.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={() => reset()}
          className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-full font-medium transition-colors w-full sm:w-auto"
        >
          حاول مرة أخرى
        </button>
        <Link
          href="/"
          className="bg-surface hover:bg-surface-hover text-text border border-border px-8 py-3 rounded-full font-medium transition-colors w-full sm:w-auto"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
