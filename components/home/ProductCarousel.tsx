"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Product } from '@/types';
import { ProductCarouselCard } from './ProductCarouselCard';

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // In RTL context, scrollLeft goes towards negative
      // This logic accounts for default LTR and RTL scroll behavior.
      setCanScrollLeft(Math.abs(scrollLeft) > 0);
      setCanScrollRight(Math.round(Math.abs(scrollLeft) + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      // In RTL: scrolling "right" means moving towards 0 (or positive depending on browser implementation)
      // Usually, just applying `scrollBy` with a negative/positive offset works fine.
      // Easiest is to scroll by the width of a card roughly (e.g. 250px).
      const scrollAmount = document.documentElement.dir === 'rtl' 
        ? (direction === 'right' ? -250 : 250)
        : (direction === 'left' ? -250 : 250);
        
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // Delay check scroll to wait for smooth scroll to finish partially
      setTimeout(checkScroll, 300);
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="relative group">
      {/* Scroll Controls (Desktop only) */}
      <button 
        onClick={() => scroll('right')}
        className={`absolute hidden md:flex items-center justify-center top-1/2 -translate-y-1/2 start-0 md:-start-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-border text-brand-600 transition-all hover:bg-brand-50 hover:scale-110 ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
        aria-label="التالي"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rtl:rotate-180">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button 
        onClick={() => scroll('left')}
        className={`absolute hidden md:flex items-center justify-center top-1/2 -translate-y-1/2 end-0 md:-end-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-border text-brand-600 transition-all hover:bg-brand-50 hover:scale-110 ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
        aria-label="السابق"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rtl:rotate-180">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Carousel Container */}
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto gap-4 sm:gap-6 pb-8 pt-2 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
      >
        {products.map((product) => (
          <ProductCarouselCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
