// Hero Section v4 — redesign based on reference image
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection({ settings }: { settings: Record<string, string> | null }) {
  const title = settings?.hero_title || 'أفضل المنتجات بأقل الأسعار';
  const subtitle = settings?.hero_subtitle || 'اكتشف تشكيلة واسعة من المنتجات المميزة التي تليق بك.';

  const ctaPrimary = settings?.hero_cta_primary || 'تسوق الآن';
  const ctaSecondary = settings?.hero_cta_secondary || 'اقترح تصميم';

  const mainImage = settings?.hero_main_image || '';

  // Card 1 Data
  const card1Title = settings?.hero_card1_title || '';
  const card1Subtitle = settings?.hero_card1_subtitle || '';
  const card1Image = settings?.hero_card1_image || '';
  const card1Bg = settings?.hero_card1_bg || '#7c3aed';
  const card1Link = settings?.hero_card1_link || '/shop';

  // Card 2 Data
  const card2Title = settings?.hero_card2_title || '';
  const card2Subtitle = settings?.hero_card2_subtitle || '';
  const card2Image = settings?.hero_card2_image || '';
  const card2Bg = settings?.hero_card2_bg || '#6d28d9';
  const card2Link = settings?.hero_card2_link || '/shop';

  return (
    <section className="relative w-full bg-bg-main overflow-hidden py-12 md:py-16 lg:py-24">
      {/* Subtle decorative background shapes */}
      <div className="absolute top-0 end-0 -mt-20 -me-20 w-64 h-64 bg-brand-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 start-0 -mb-20 -ms-20 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10 w-full max-w-7xl">
        
        {/* -- Content Column (Text & CTAs) -- */}
        <div className="flex flex-col gap-5 md:gap-7 text-center lg:text-start items-center lg:items-start max-w-2xl mx-auto lg:mx-0 w-full pt-4 md:pt-0 shrink-0">
          <div className="inline-flex items-center gap-2 mb-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 font-bold text-sm shadow-sm md:hidden lg:inline-flex w-max mx-auto lg:mx-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600"></span>
            </span>
            أحدث التشكيلات العصرية
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-arabic text-text-main leading-[1.15] tracking-tight">
            {title}
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-text-sec opacity-90 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4 w-full justify-center lg:justify-start">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-brand-600/20 text-center flex items-center justify-center gap-2"
            >
              {ctaPrimary}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rtl:rotate-180">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link
              href="/suggest"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-border text-text-main font-bold rounded-xl hover:border-brand-600 hover:text-brand-600 hover:-translate-y-1 transition-all duration-300 text-center shadow-sm"
            >
              {ctaSecondary}
            </Link>
          </div>
        </div>

        {/* -- Visuals Column (Images & Floating Cards) -- */}
        <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center max-w-[600px] mx-auto lg:mx-0 mt-8 lg:mt-0 order-first lg:order-last">
          
          {/* Main Visual Background Glow */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-brand-100 to-transparent opacity-60 blur-2xl -z-10 mix-blend-multiply"></div>
          
          {/* Main Hero Image */}
          {mainImage ? (
            <div className="relative w-full h-full max-w-[80%] max-h-[80%] z-0 rounded-3xl overflow-hidden shadow-2xl bg-white border border-border">
              {/* Force image to fill preserving aspect ratio, adding a soft bg */}
              <Image 
                src={mainImage} 
                alt={title} 
                fill 
                className="object-cover md:object-contain drop-shadow-sm hover:scale-105 transition-transform duration-700 bg-brand-50/30" 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="relative w-full h-full max-w-[80%] max-h-[80%] z-0 rounded-[2.5rem] bg-gradient-to-br from-brand-500 to-brand-800 shadow-2xl flex flex-col items-center justify-center text-white/80 p-8 text-center border-4 border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><polygon points="12 4 19 19 5 19 12 4"></polygon></svg>
              <span className="text-xl md:text-3xl font-black drop-shadow-md">{title}</span>
            </div>
          )}

          {/* Floating Card 1 (Top End / Visual Top Left in RTL) */}
          {card1Title && (
            <Link 
              href={card1Link} 
              className="absolute top-2 sm:top-10 end-2 sm:-end-6 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-3 w-40 sm:w-56 transition-all hover:-translate-y-2 hover:shadow-brand-600/30 z-10 overflow-hidden group border border-white/10"
              style={{ backgroundColor: card1Bg }}
            >
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {card1Image && (
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-white/20 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm p-1">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image src={card1Image} alt={card1Title} fill className="object-cover" />
                  </div>
                </div>
              )}
              <div className="flex flex-col text-white text-start w-full relative z-10 overflow-hidden">
                <span className="font-bold text-xs sm:text-sm leading-tight truncate">{card1Title}</span>
                {card1Subtitle && <span className="text-[10px] sm:text-xs opacity-90 truncate mt-0.5">{card1Subtitle}</span>}
              </div>
            </Link>
          )}

          {/* Floating Card 2 (Bottom Start / Visual Bottom Right in RTL) */}
          {card2Title && (
            <Link 
              href={card2Link} 
              className="absolute bottom-2 sm:bottom-12 start-2 sm:-start-6 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-3 w-40 sm:w-56 transition-all hover:-translate-y-2 hover:shadow-brand-600/30 z-10 overflow-hidden group border border-white/10"
              style={{ backgroundColor: card2Bg }}
            >
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {card2Image && (
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-white/20 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm p-1">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image src={card2Image} alt={card2Title} fill className="object-cover" />
                  </div>
                </div>
              )}
              <div className="flex flex-col text-white text-start w-full relative z-10 overflow-hidden">
                <span className="font-bold text-xs sm:text-sm leading-tight truncate">{card2Title}</span>
                {card2Subtitle && <span className="text-[10px] sm:text-xs opacity-90 truncate mt-0.5">{card2Subtitle}</span>}
              </div>
            </Link>
          )}

        </div>
      </div>
    </section>
  );
}
