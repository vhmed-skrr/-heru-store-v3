// Hero Section v2 — Redesign only, no functional changes
import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';

interface HeroSectionProps {
  settings: Record<string, string> | null;
  categories?: Category[] | null;
}

/**
 * HeroSection v2
 *
 * Desktop layout (≥1024px):
 *   [Image panel 60%]  |  [Content panel 40%]
 *   Two layered image placeholders + giant overlay text
 *   Scroll indicator at bottom-left
 *
 * Mobile layout (<1024px):
 *   Full-width image with dark gradient overlay + centered content
 *
 * All data still comes from the same props:
 *   settings.hero_title / hero_subtitle / hero_cta_primary / hero_cta_secondary
 *   categories → first 4 shown as quick-access pill buttons
 *
 * Visual changes only — no functional or data changes.
 */
export function HeroSection({ settings, categories }: HeroSectionProps) {
  const title        = settings?.hero_title        || 'أفضل المنتجات بأقل الأسعار';
  const subtitle     = settings?.hero_subtitle     || 'اكتشف تشكيلة واسعة من المنتجات المميزة التي تليق بك.';
  const ctaPrimary   = settings?.hero_cta_primary  || 'تسوق الآن';
  const ctaSecondary = settings?.hero_cta_secondary || 'اقترح تصميم';

  // Up to 4 quick-access category pills
  const quickCats = (categories ?? []).slice(0, 4);

  // Background colors for the two image panels
  const panel1Bg = 'from-violet-900 via-purple-800 to-indigo-900';
  const panel2Bg = 'from-indigo-900 via-purple-900 to-violet-800';

  return (
    <section
      className="relative w-full min-h-[100svh] lg:h-screen flex flex-col lg:flex-row overflow-hidden font-arabic"
      dir="rtl"
    >
      {/* ─────────────────────────────────────────────────
          LEFT PANEL (60%) — Image panels + overlay text
          On mobile: becomes full-width background
      ───────────────────────────────────────────────── */}
      <div className="relative flex w-full lg:w-[60%] h-[60vw] min-h-[280px] lg:h-full overflow-hidden">

        {/* Panel 1 — main (wider) */}
        <div
          className={`relative flex-[1.4] h-full bg-gradient-to-br ${panel1Bg} overflow-hidden`}
        >
          {/* Decorative noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(139,92,246,0.4)_0%,transparent_70%)]" />

          {/* Abstract geometric shape */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full bg-white/5 border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] aspect-square rounded-full bg-white/5 border border-white/10" />

          {/* Category pill label on Panel 1 */}
          <div className="absolute top-5 right-5">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              Collection 2025
            </span>
          </div>

          {/* Product imagery placeholder — centered icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-24 h-24 text-white/10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1.5 8.25a.75.75 0 0 1 .75-.75h19.5a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1-.75-.75ZM1.5 4.5A.75.75 0 0 1 2.25 3.75h19.5a.75.75 0 0 1 0 1.5H2.25A.75.75 0 0 1 1.5 4.5ZM1.5 12a.75.75 0 0 1 .75-.75h19.5a.75.75 0 0 1 0 1.5H2.25A.75.75 0 0 1 1.5 12ZM1.5 15.75a.75.75 0 0 1 .75-.75h19.5a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1-.75-.75ZM1.5 19.5a.75.75 0 0 1 .75-.75h19.5a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1-.75-.75Z"/>
            </svg>
          </div>
        </div>

        {/* Thin divider line */}
        <div className="w-px bg-white/10 shrink-0 self-stretch" />

        {/* Panel 2 — secondary (narrower) */}
        <div
          className={`relative flex-1 h-full bg-gradient-to-tl ${panel2Bg} overflow-hidden`}
        >
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(167,139,250,0.3)_0%,transparent_70%)]" />

          {/* Social proof chip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5">
            <span className="flex -space-x-1.5 rtl:space-x-reverse">
              {['bg-violet-400', 'bg-purple-400', 'bg-indigo-400'].map((c, i) => (
                <span key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-white/20 block`} />
              ))}
            </span>
            <span className="text-white text-[11px] font-bold whitespace-nowrap">+1000 عميل</span>
          </div>

          {/* Geometric accent */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 border border-white/10" />
        </div>

        {/* ── OVERLAY GIANT TEXT ── */}
        {/* Massive editorial text bleeding across both panels */}
        <div
          className="absolute bottom-0 right-0 left-0 pointer-events-none select-none overflow-hidden pb-3 px-4"
          aria-hidden="true"
        >
          <span
            className="block font-black text-white leading-none whitespace-nowrap"
            style={{
              fontSize: 'clamp(60px, 12vw, 150px)',
              opacity: 0.12,
              mixBlendMode: 'overlay',
              letterSpacing: '-0.02em',
            }}
          >
            {title.split(' ')[0] || 'Heru'}
          </span>
        </div>

        {/* ── SCROLL INDICATOR ── */}
        <div className="hidden lg:flex absolute bottom-6 right-6 flex-col items-center gap-2 text-white/50">
          <span className="text-[11px] font-medium tracking-widest uppercase rotate-90 origin-center">اكتشف أكثر</span>
          <div className="w-px h-12 bg-white/20 animate-pulse" />
          <svg
            className="w-4 h-4 animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>

        {/* Bottom dark fade on mobile — helps legibility of text overlay */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
      </div>

      {/* ─────────────────────────────────────────────────
          RIGHT PANEL (40%) — Content
          On mobile: overlaps image as absolute overlay
      ───────────────────────────────────────────────── */}

      {/* Mobile overlay content (absolute, sits on top of image panel on small screens) */}
      <div className="lg:hidden absolute inset-x-0 bottom-0 px-6 pb-10 pt-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center text-center z-10">
        <h1 className="text-white font-arabic font-black text-3xl sm:text-4xl leading-tight mb-3 drop-shadow-lg">
          {title}
        </h1>
        <p className="text-white/80 text-sm sm:text-base mb-6 max-w-xs font-medium leading-relaxed">
          {subtitle}
        </p>
        <div className="flex items-center gap-3 flex-col sm:flex-row w-full max-w-xs">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-7 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 active:scale-95 transition-all shadow-lg shadow-violet-900/40 text-sm"
          >
            {ctaPrimary}
          </Link>
          <Link
            href="/suggest"
            className="w-full sm:w-auto px-7 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 active:scale-95 transition-all text-sm"
          >
            {ctaSecondary}
          </Link>
        </div>
      </div>

      {/* Desktop right content panel */}
      <div
        className="
          hidden lg:flex
          flex-col justify-center
          w-[40%] h-full
          bg-white
          px-10 xl:px-16
          border-r border-gray-100
          relative overflow-hidden
        "
      >
        {/* Subtle background accent blob */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-violet-50 blur-3xl opacity-80 pointer-events-none" />
        <div className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-indigo-50 blur-3xl opacity-60 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-8">

          {/* Brand badge */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.15em] uppercase text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse block" />
              New Collection
            </span>
          </div>

          {/* Main heading — animates in from right in RTL */}
          <div>
            <h1
              className="font-arabic font-black text-gray-900 leading-[1.1] mb-5"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)' }}
            >
              {title}
            </h1>
            <p className="text-gray-500 text-base xl:text-lg leading-relaxed max-w-sm font-medium">
              {subtitle}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Link
              href="/shop"
              className="
                inline-flex items-center gap-2 justify-center
                px-7 py-3.5
                bg-violet-600 text-white
                font-bold text-sm
                rounded-xl
                hover:bg-violet-700 active:scale-95
                transition-all duration-200
                shadow-lg shadow-violet-600/25
                whitespace-nowrap
              "
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {ctaPrimary}
            </Link>
            <Link
              href="/suggest"
              className="
                inline-flex items-center gap-2 justify-center
                px-7 py-3.5
                bg-transparent text-gray-700
                font-bold text-sm
                rounded-xl
                border-2 border-gray-200
                hover:border-violet-400 hover:text-violet-600
                active:scale-95
                transition-all duration-200
                whitespace-nowrap
              "
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              {ctaSecondary}
            </Link>
          </div>

          {/* Quick Category Pills */}
          {quickCats.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">تصفح حسب</p>
              <div className="flex flex-wrap gap-2">
                {quickCats.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    className="
                      inline-flex items-center gap-1.5
                      px-4 py-1.5
                      rounded-full
                      border border-gray-200
                      text-xs font-bold text-gray-600
                      bg-white
                      hover:bg-violet-600 hover:text-white hover:border-violet-600
                      transition-all duration-200
                      shadow-sm
                    "
                  >
                    {cat.icon && <span>{cat.icon}</span>}
                    {cat.name_ar}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Stats strip */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
            {[
              { label: 'منتج متاح', value: '100+' },
              { label: 'عميل سعيد', value: '1K+' },
              { label: 'تقييم ممتاز', value: '4.9★' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-black text-gray-900 text-xl leading-none" dir="ltr">{stat.value}</span>
                <span className="text-gray-400 text-[11px] font-medium mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
