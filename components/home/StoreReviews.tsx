import React from 'react';
import { StoreReview } from '@/types';

export function StoreReviews({ reviews }: { reviews: StoreReview[] | null }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-arabic font-bold text-text-main mb-10 text-center">
          ماذا قالوا عنا
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-center gap-1 mb-4 text-[#fbbf24]">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" height="18" 
                    viewBox="0 0 24 24" 
                    fill={i < review.rating ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={i >= review.rating ? "text-text-sec/30" : ""}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              
              <p className="text-text-main font-medium mb-4 line-clamp-4 leading-relaxed flex-1">
                "{review.comment}"
              </p>
              
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold font-arabic flex-shrink-0">
                  {review.reviewer_name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-text-main text-sm">{review.reviewer_name}</span>
                  <span className="text-xs text-text-sec font-medium">عميل موثق ✔</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
