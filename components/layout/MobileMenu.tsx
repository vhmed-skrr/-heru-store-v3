"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SettingsProps {
  whatsapp_phone?: string;
  instagram_url?: string;
  facebook_url?: string;
  store_name?: string;
  [key: string]: any;
}

export function MobileMenu({ settings = {} }: { settings: SettingsProps | null }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      <button 
        onClick={toggleMenu}
        aria-label="Toggle Menu"
        className="p-2 -mr-2 text-text-main hover:text-brand-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Overlay - No direction overrides involved here */}
      <div 
        className={`fixed inset-0 bg-text-main/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleMenu}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 bottom-0 right-0 w-[280px] bg-white z-[70] shadow-xl flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          <span className="font-arabic font-bold text-xl text-text-main pb-1">
            {settings?.store_name || 'القائمة'}
          </span>
          <button 
            onClick={toggleMenu}
            className="p-2 text-text-sec hover:bg-brand-50 hover:text-brand-600 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-4">
          <Link href="/" className="text-text-main font-medium py-2 border-b border-border hover:text-brand-600 transition-colors" onClick={toggleMenu}>
            الرئيسية
          </Link>
          <Link href="/shop" className="text-text-main font-medium py-2 border-b border-border hover:text-brand-600 transition-colors" onClick={toggleMenu}>
            المتجر
          </Link>
          <Link href="/suggest" className="text-text-main font-medium py-2 border-b border-border hover:text-brand-600 transition-colors" onClick={toggleMenu}>
            اقترح تصميم
          </Link>
        </nav>

        <div className="p-4 border-t border-border mt-auto flex flex-col gap-3">
          {settings?.whatsapp_phone && (
            <a 
              href={`https://wa.me/${settings.whatsapp_phone}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-text-main hover:text-success-500 transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              واتساب: {settings.whatsapp_phone}
            </a>
          )}
          <div className="flex items-center gap-4 mt-2 text-text-sec">
            {settings?.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            )}
            {settings?.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
