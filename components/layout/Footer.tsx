import React from 'react';
import Link from 'next/link';
import { getSettings } from '@/lib/data/settings';

/**
 * Footer — Server Component
 *
 * WHY the old code was broken:
 * The settings table stores data as key-value ROWS. getSettings() converts them
 * to a flat object where keys are the setting names. The old Footer read:
 *
 *   settings?.instagram_url    → key is actually 'social_instagram'
 *   settings?.facebook_url     → key is actually 'social_facebook'
 *   settings?.tiktok_url       → key is actually 'social_tiktok'
 *   settings?.telegram_url     → key is actually 'social_telegram'
 *   settings?.whatsapp_phone   → key is actually 'whatsapp'
 *   settings?.store_description → key is actually 'footer_tagline'
 *
 * None of these keys exist in the settings object → all social links and
 * footer text were always undefined → nothing was ever displayed.
 */

export async function Footer() {
  const { data: settings } = await getSettings();

  const storeName       = settings?.store_name       || 'Heru Store';
  const footerTagline   = settings?.footer_tagline   || 'أفضل متجر لشراء المنتجات المميزة بأعلى جودة.';
  const supportHours    = settings?.footer_support_hours;
  const whatsapp        = settings?.whatsapp;

  // Social links — keys must match exactly what adminSettings.ts saves
  const instagram = settings?.social_instagram;
  const facebook  = settings?.social_facebook;
  const tiktok    = settings?.social_tiktok;
  const telegram  = settings?.social_telegram;

  return (
    <footer className="bg-white border-t border-border mt-auto pt-10 pb-6 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* ── Info + Social ─────────────────────────────────── */}
          <div>
            <h4 className="font-arabic font-bold text-xl text-brand-600 mb-4 pb-2">{storeName}</h4>
            <p className="text-text-sec text-sm leading-relaxed mb-4 max-w-sm">
              {footerTagline}
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer"
                  className="text-text-sec hover:text-brand-600 bg-brand-50 p-2 rounded-full transition-colors" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer"
                  className="text-text-sec hover:text-brand-600 bg-brand-50 p-2 rounded-full transition-colors" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              )}
              {tiktok && (
                <a href={tiktok} target="_blank" rel="noopener noreferrer"
                  className="text-text-sec hover:text-brand-600 bg-brand-50 p-2 rounded-full transition-colors" aria-label="TikTok">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 0-3-3"></path></svg>
                </a>
              )}
              {telegram && (
                <a href={telegram} target="_blank" rel="noopener noreferrer"
                  className="text-text-sec hover:text-brand-600 bg-brand-50 p-2 rounded-full transition-colors" aria-label="Telegram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </a>
              )}
            </div>
          </div>

          {/* ── Quick Links ──────────────────────────────────── */}
          <div>
            <h4 className="font-semibold text-text-main mb-4 text-base">روابط سريعة</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-text-sec hover:text-brand-600 text-sm transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border" />الرئيسية</Link></li>
              <li><Link href="/shop" className="text-text-sec hover:text-brand-600 text-sm transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border" />تصفح المتجر</Link></li>
              <li><Link href="/about" className="text-text-sec hover:text-brand-600 text-sm transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border" />من نحن</Link></li>
              <li><Link href="/privacy" className="text-text-sec hover:text-brand-600 text-sm transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-border" />سياسة الخصوصية</Link></li>
            </ul>
          </div>

          {/* ── Contact ─────────────────────────────────────── */}
          <div>
            <h4 className="font-semibold text-text-main mb-4 text-base">تواصل معنا</h4>
            <ul className="flex flex-col gap-4">
              {whatsapp && (
                <li className="flex items-center gap-3 text-text-sec text-sm">
                  <div className="bg-brand-50 text-brand-600 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <span style={{ direction: 'ltr' }} className="font-medium">{whatsapp}</span>
                </li>
              )}
              {supportHours && (
                <li className="flex items-center gap-3 text-text-sec text-sm">
                  <div className="bg-brand-50 text-brand-600 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <span className="font-medium">{supportHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-sec text-xs">
            جميع الحقوق محفوظة © {new Date().getFullYear()} {storeName}
          </p>
          <div className="text-text-sec text-xs flex items-center gap-1 bg-brand-50 px-3 py-1.5 rounded-full">
            تطوير <a href="#" className="flex items-center text-brand-600 hover:text-brand-700 font-bold transition-colors">عبر Heru <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
