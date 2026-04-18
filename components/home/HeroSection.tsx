// Hero Section v3 — PartyHuren-inspired redesign, no functional changes
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';

interface HeroSectionProps {
  settings: Record<string, string> | null;
  categories?: Category[] | null;
}

/**
 * HeroSection v3 — PartyHuren Layout
 *
 * Desktop (≥1024px) — RTL:
 *   ┌───────────────────┬──────────────────────────────┐
 *   │  بطاقة 1 (أعلى)  │  العنوان + الأزرار           │
 *   │  خلفية ملونة     │                               │
 *   │  صورة + عنوان    │  صورة المنتج الرئيسية استُحضرت│
 *   ├───────────────────│  من settings hero_main_image │
 *   │  بطاقة 2 (أسفل)  │  عناصر هندسية decorative     │
 *   │  خلفية ملونة     │                               │
 *   └───────────────────┴──────────────────────────────┘
 *
 * Mobile (<1024px):
 *   المنطقة الرئيسية كاملة العرض → البطاقتان في grid 2-col
 *
 * All data from settings:
 *   hero_title / hero_subtitle / hero_cta_primary / hero_cta_secondary
 *   hero_main_image / hero_card1_* / hero_card2_*
 */
export function HeroSection({ settings, categories }: HeroSectionProps) {
  // ── Main hero content ──────────────────────────────────────
  const title        = settings?.hero_title        || 'أفضل المنتجات بأقل الأسعار';
  const subtitle     = settings?.hero_subtitle     || 'اكتشف تشكيلة واسعة من المنتجات المميزة التي تليق بك.';
  const ctaPrimary   = settings?.hero_cta_primary  || 'تسوق الآن';
  const ctaSecondary = settings?.hero_cta_secondary || 'اقترح تصميم';
  const mainImage    = settings?.hero_main_image   || '';

  // ── Card 1 ────────────────────────────────────────────────
  const card1Title    = settings?.hero_card1_title    || 'تصاميم مميزة';
  const card1Subtitle = settings?.hero_card1_subtitle || 'جودة عالية';
  const card1Image    = settings?.hero_card1_image    || '';
  const card1Bg       = settings?.hero_card1_bg       || '#7c3aed';
  const card1Link     = settings?.hero_card1_link     || '/shop';

  // ── Card 2 ────────────────────────────────────────────────
  const card2Title    = settings?.hero_card2_title    || 'عروض حصرية';
  const card2Subtitle = settings?.hero_card2_subtitle || 'خصومات يومية';
  const card2Image    = settings?.hero_card2_image    || '';
  const card2Bg       = settings?.hero_card2_bg       || '#6d28d9';
  const card2Link     = settings?.hero_card2_link     || '/shop';

  // Up to 4 category pills
  const quickCats = (categories ?? []).slice(0, 4);

  return (
    <section className="w-full bg-white font-arabic" dir="rtl">
      {/* ══════════════════════════════════════════════════════
          DESKTOP LAYOUT (≥1024px): 2 columns
          Right: side cards | Left: main hero area
      ══════════════════════════════════════════════════════ */}
      <div className="hidden lg:grid grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] min-h-[600px] xl:min-h-[680px]">

        {/* ── LEFT COLUMN: Side Cards ─────────────────────── */}
        <div className="flex flex-col gap-0 border-l border-gray-100">

          {/* Card 1 */}
          <Link
            href={card1Link}
            className="relative flex-1 flex flex-col justify-between p-7 overflow-hidden group transition-opacity hover:opacity-95 border-b border-white/15"
            style={{ backgroundColor: card1Bg }}
          >
            {/* Decorative circle */}
            <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-black/10 pointer-events-none" />

            {/* Card image */}
            {card1Image ? (
              <div className="relative w-full aspect-square max-w-[130px] mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                <Image src={card1Image} alt={card1Title} fill className="object-cover" sizes="130px" />
              </div>
            ) : (
              <div className="w-full max-w-[130px] mx-auto mb-4 aspect-square rounded-xl bg-white/20 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                  <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
            )}

            {/* Card text */}
            <div className="relative z-10">
              <h3 className="text-white font-black text-xl leading-tight mb-1 font-arabic">{card1Title}</h3>
              <p className="text-white/75 text-sm font-medium mb-4">{card1Subtitle}</p>
              <span className="inline-flex items-center gap-1.5 bg-white text-gray-900 text-xs font-black px-4 py-2 rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                تسوق الآن
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </span>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href={card2Link}
            className="relative flex-1 flex flex-col justify-between p-7 overflow-hidden group transition-opacity hover:opacity-95"
            style={{ backgroundColor: card2Bg }}
          >
            {/* Decorative triangle SVG */}
            <svg className="absolute top-3 left-3 opacity-10 w-16 h-16" viewBox="0 0 100 100" fill="white">
              <polygon points="50,10 90,80 10,80" />
            </svg>
            <div className="absolute -bottom-8 right-4 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />

            {/* Card image */}
            {card2Image ? (
              <div className="relative w-full aspect-square max-w-[130px] mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                <Image src={card2Image} alt={card2Title} fill className="object-cover" sizes="130px" />
              </div>
            ) : (
              <div className="w-full max-w-[130px] mx-auto mb-4 aspect-square rounded-xl bg-white/20 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </div>
            )}

            {/* Card text */}
            <div className="relative z-10">
              <h3 className="text-white font-black text-xl leading-tight mb-1 font-arabic">{card2Title}</h3>
              <p className="text-white/75 text-sm font-medium mb-4">{card2Subtitle}</p>
              <span className="inline-flex items-center gap-1.5 bg-white text-gray-900 text-xs font-black px-4 py-2 rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                اكتشف الآن
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </span>
            </div>
          </Link>
        </div>

        {/* ── RIGHT COLUMN: Main Hero Area ────────────────── */}
        <div className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-bl from-violet-50 via-white to-indigo-50 px-10 xl:px-16 py-12">

          {/* Decorative background elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Large circle top-right */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border-2 border-violet-100 opacity-60" />
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-violet-50 opacity-80" />
            {/* Small circles */}
            <div className="absolute top-1/3 left-16 w-6 h-6 rounded-full bg-violet-200 opacity-50" />
            <div className="absolute top-1/4 left-32 w-3 h-3 rounded-full bg-indigo-300 opacity-40" />
            {/* Triangle bottom-left */}
            <svg className="absolute bottom-12 left-8 opacity-10 w-20 h-20" viewBox="0 0 100 100" fill="none" stroke="#7c3aed" strokeWidth="3">
              <polygon points="50,5 95,90 5,90" />
            </svg>
            {/* Dotted grid pattern */}
            <svg className="absolute bottom-0 right-0 opacity-[0.04] w-64 h-64" viewBox="0 0 100 100">
              {Array.from({ length: 5 }).map((_, row) =>
                Array.from({ length: 5 }).map((_, col) => (
                  <circle key={`${row}-${col}`} cx={col * 25 + 12} cy={row * 25 + 12} r="2" fill="#7c3aed" />
                ))
              )}
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col xl:flex-row items-center gap-8 xl:gap-12">

            {/* Text block */}
            <div className="flex flex-col gap-6 xl:max-w-sm 2xl:max-w-md">
              {/* Brand label */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-violet-500 rounded" />
                <span className="text-xs font-black tracking-[0.2em] uppercase text-violet-600">Heru Store</span>
              </div>

              {/* Main heading */}
              <h1 className="font-arabic font-black text-gray-900 leading-[1.1]" style={{ fontSize: 'clamp(2rem, 3.2vw, 3.2rem)' }}>
                {title}
              </h1>

              {/* Subtitle */}
              <p className="text-gray-500 text-base xl:text-lg leading-relaxed font-medium max-w-sm">
                {subtitle}
              </p>

              {/* CTA Buttons — preserved exactly */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 text-white font-black text-sm rounded-xl hover:bg-violet-700 active:scale-95 transition-all shadow-lg shadow-violet-600/30 whitespace-nowrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  {ctaPrimary}
                </Link>
                <Link
                  href="/suggest"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-gray-700 font-black text-sm rounded-xl border-2 border-gray-200 hover:border-violet-400 hover:text-violet-700 active:scale-95 transition-all whitespace-nowrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  {ctaSecondary}
                </Link>
              </div>

              {/* Quick Category Pills */}
              {quickCats.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {quickCats.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all shadow-sm"
                    >
                      {cat.icon && <span>{cat.icon}</span>}
                      {cat.name_ar}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Main Product Image */}
            <div className="relative flex-1 flex items-center justify-center">
              {mainImage ? (
                <div className="relative w-full max-w-[320px] xl:max-w-[380px] aspect-square">
                  {/* Glowing background circle */}
                  <div className="absolute inset-4 rounded-full bg-violet-100/80 blur-xl" />
                  <Image
                    src={mainImage}
                    alt={title}
                    fill
                    className="object-contain drop-shadow-2xl relative z-10"
                    sizes="(max-width: 1280px) 320px, 380px"
                    priority
                  />
                </div>
              ) : (
                /* Fallback: decorative gradient orb */
                <div className="relative w-[280px] xl:w-[340px] aspect-square">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 opacity-90 shadow-2xl shadow-violet-500/40" />
                  <div className="absolute inset-6 rounded-full bg-gradient-to-tl from-violet-300 to-indigo-400 opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-arabic font-black text-white text-5xl xl:text-6xl tracking-tight drop-shadow-lg">
                      Heru
                    </span>
                  </div>
                  {/* Floating decorative rings */}
                  <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full border-4 border-violet-300/50" />
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full border-4 border-indigo-300/40" />
                </div>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative z-10 flex items-center gap-8 mt-10 pt-6 border-t border-gray-100">
            {[
              { value: '100+', label: 'منتج متاح' },
              { value: '1K+',  label: 'عميل سعيد' },
              { value: '4.9★', label: 'متوسط التقييم' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-black text-gray-900 text-2xl leading-none" dir="ltr">{stat.value}</span>
                <span className="text-gray-400 text-[11px] font-medium mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE LAYOUT (<1024px)
      ══════════════════════════════════════════════════════ */}
      <div className="lg:hidden flex flex-col">

        {/* Main hero area */}
        <div className="relative min-h-[460px] sm:min-h-[520px] bg-gradient-to-br from-violet-50 to-indigo-50 overflow-hidden flex flex-col justify-center px-6 pt-10 pb-8">
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-violet-100 opacity-60 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-indigo-100 opacity-50 pointer-events-none" />
          <svg className="absolute bottom-8 right-6 opacity-10 w-16 h-16" viewBox="0 0 100 100" fill="none" stroke="#7c3aed" strokeWidth="3"><polygon points="50,5 95,90 5,90" /></svg>

          {/* Main image */}
          {mainImage ? (
            <div className="relative w-40 h-40 sm:w-52 sm:h-52 mx-auto mb-6">
              <div className="absolute inset-2 rounded-full bg-violet-200/50 blur-lg" />
              <Image src={mainImage} alt={title} fill className="object-contain drop-shadow-xl relative z-10" sizes="208px" priority />
            </div>
          ) : (
            <div className="relative w-36 h-36 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl flex items-center justify-center">
              <span className="font-arabic font-black text-white text-4xl">Heru</span>
            </div>
          )}

          {/* Text */}
          <div className="relative z-10 text-center">
            <h1 className="font-arabic font-black text-gray-900 text-3xl sm:text-4xl leading-tight mb-3">
              {title}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6 max-w-sm mx-auto font-medium">
              {subtitle}
            </p>
            {/* CTA Buttons — preserved */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-violet-600 text-white font-black text-sm rounded-xl hover:bg-violet-700 active:scale-95 transition-all shadow-lg shadow-violet-600/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                {ctaPrimary}
              </Link>
              <Link
                href="/suggest"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-700 font-black text-sm rounded-xl border-2 border-gray-200 hover:border-violet-400 hover:text-violet-700 active:scale-95 transition-all"
              >
                {ctaSecondary}
              </Link>
            </div>
          </div>
        </div>

        {/* Side cards — 2-column grid on mobile */}
        <div className="grid grid-cols-2 gap-0 border-t border-gray-100">
          {/* Card 1 */}
          <Link
            href={card1Link}
            className="relative flex flex-col justify-between p-5 overflow-hidden group border-l border-white/15 min-h-[180px]"
            style={{ backgroundColor: card1Bg }}
          >
            <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
            {card1Image ? (
              <div className="relative w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden shadow-md">
                <Image src={card1Image} alt={card1Title} fill className="object-cover" sizes="64px" />
              </div>
            ) : (
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
            )}
            <div className="relative z-10 text-center">
              <h3 className="text-white font-black text-sm leading-tight mb-1 font-arabic">{card1Title}</h3>
              <p className="text-white/70 text-xs font-medium mb-3">{card1Subtitle}</p>
              <span className="inline-flex items-center gap-1 bg-white text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-full">
                تسوق
              </span>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href={card2Link}
            className="relative flex flex-col justify-between p-5 overflow-hidden group min-h-[180px]"
            style={{ backgroundColor: card2Bg }}
          >
            <svg className="absolute top-2 left-2 opacity-10 w-12 h-12" viewBox="0 0 100 100" fill="white"><polygon points="50,10 90,80 10,80" /></svg>
            {card2Image ? (
              <div className="relative w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden shadow-md">
                <Image src={card2Image} alt={card2Title} fill className="object-cover" sizes="64px" />
              </div>
            ) : (
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              </div>
            )}
            <div className="relative z-10 text-center">
              <h3 className="text-white font-black text-sm leading-tight mb-1 font-arabic">{card2Title}</h3>
              <p className="text-white/70 text-xs font-medium mb-3">{card2Subtitle}</p>
              <span className="inline-flex items-center gap-1 bg-white text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-full">
                اكتشف
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
