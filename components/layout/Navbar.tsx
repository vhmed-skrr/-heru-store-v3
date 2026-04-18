import React from 'react';
import Link from 'next/link';
import { getSettings } from '@/lib/data/settings';
import { AnnouncementBar } from './AnnouncementBar';
import { MobileMenu } from './MobileMenu';
import { CartButton } from './CartButton';
import { SearchBar } from './SearchBar';

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
            {/* SearchBar is a Client Component — routes to /shop?search=query */}
            <SearchBar />
            <CartButton />
          </div>
        </div>
      </header>
    </>
  );
}
