import React from 'react';
import Link from 'next/link';
import { getSettings } from '@/lib/data/settings';
import { AnnouncementBar } from './AnnouncementBar';
import { MobileMenu } from './MobileMenu';
import { CartButton } from './CartButton';

export async function Navbar() {
  const { data: settings } = await getSettings();
  const storeName = settings?.store_name || 'Heru';
  const logoType = settings?.logo_type || 'text';
  const logoImage = settings?.logo_image;

  return (
    <>
      <AnnouncementBar settings={settings} />
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-md h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Right: Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-4">
            <MobileMenu settings={settings} />
            <Link href="/" className="flex items-center">
              {logoType === 'image' && logoImage ? (
                <img src={logoImage} alt={storeName} className="h-8 w-auto object-contain" />
              ) : (
                <span className="font-arabic font-bold text-2xl text-text-main pb-1">{storeName}</span>
              )}
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-text-main hover:text-brand-600 font-medium transition-colors">
              الرئيسية
            </Link>
            <Link href="/shop" className="text-text-main hover:text-brand-600 font-medium transition-colors">
              المتجر
            </Link>
            <Link href="/suggest" className="text-text-main hover:text-brand-600 font-medium transition-colors">
              اقترح تصميم
            </Link>
          </nav>

          {/* Left: Search & Cart */}
          <div className="flex items-center gap-3">
            <button aria-label="Search" className="p-2 text-text-main hover:text-brand-600 transition-colors hidden sm:block">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <CartButton />
          </div>
        </div>
      </header>
    </>
  );
}
