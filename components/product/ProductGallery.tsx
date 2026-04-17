"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const displayImages = images.length > 0 ? images : [''];

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div 
        className="relative w-full aspect-square bg-bg-secondary rounded-xl overflow-hidden border border-border"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {displayImages[selectedImage] ? (
          <Image
            src={displayImages[selectedImage]}
            alt={`${alt} - صورة ${selectedImage + 1}`}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-600 bg-brand-50">
            لا توجد صورة
          </div>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-2 w-full overflow-x-auto pb-2 custom-scrollbar">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors focus:outline-none ${
                selectedImage === idx ? 'border-brand-600 ring-2 ring-brand-600/30' : 'border-border hover:border-text-sec'
              }`}
            >
              <Image src={img} alt={`${alt} thumbnail ${idx + 1}`} fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
