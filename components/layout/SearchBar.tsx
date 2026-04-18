"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * SearchBar — Client Component
 *
 * WHY a separate component:
 * Navbar is a Server Component (async, uses getSettings).
 * The search interaction (state, router.push) requires client-side logic.
 * Extracting it keeps the Server Component pure.
 *
 * On submit: navigates to /shop?search=<query>
 * ShopClientSection reads this param and filters products client-side.
 */
export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleClose = () => {
    setOpen(false);
    setQuery('');
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    handleClose();
    router.push(`/shop?search=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      <button
        aria-label="بحث"
        onClick={handleOpen}
        className="p-2 text-text-main hover:text-brand-600 transition-colors hidden sm:flex items-center justify-center rounded-lg hover:bg-brand-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>

      {/* Full-screen search overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-start pt-24 px-4 bg-black/50 backdrop-blur-sm" onClick={handleClose}>
          <form
            onSubmit={handleSearch}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-border"
          >
            <div className="flex items-center gap-3 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-sec shrink-0">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ابحث عن منتج..."
                className="flex-1 text-base text-text-main placeholder:text-text-sec outline-none bg-transparent"
                dir="rtl"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-text-sec hover:text-text-main transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              )}
              <button
                type="submit"
                className="shrink-0 px-4 py-2 bg-brand-600 text-white font-bold rounded-lg text-sm hover:bg-brand-700 transition-colors"
              >
                بحث
              </button>
            </div>
            <div className="px-4 pb-3 text-xs text-text-sec border-t border-border pt-3">
              اضغط Enter للبحث • اضغط Escape للإغلاق
            </div>
          </form>
        </div>
      )}
    </>
  );
}
