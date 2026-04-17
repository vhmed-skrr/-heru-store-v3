"use client";

import React, { useState } from 'react';
import { Review } from '@/types';
import { submitProductReview } from '@/lib/data/reviews';
import { useToast } from '@/components/ui/Toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ProductReviewsProps {
  product_id: string;
  initialReviews: Review[];
}

export function ProductReviews({ product_id, initialReviews }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast("يرجى إدخال اسمك", "error");
      return;
    }
    
    setIsSubmitting(true);
    const { data, error } = await submitProductReview({
      product_id,
      reviewer_name: name,
      rating,
      comment: comment.trim() || null
    });
    
    if (error || !data) {
      toast(error || "حدث خطأ أثناء الإرسال", "error");
    } else {
      toast("تم إرسال تقييمك للمراجعة بنجاح", "success");
      setName('');
      setComment('');
      setRating(5);
    }
    
    setIsSubmitting(false);
  };

  return (
    <section className="mt-16 pt-16 border-t border-border">
      <h2 className="text-2xl font-arabic font-bold text-text-main mb-8">
        تقييمات المنتج
      </h2>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Reviews List */}
        <div className="w-full lg:w-3/5">
          {reviews.length > 0 ? (
            <div className="flex flex-col gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b border-border last:border-0">
                  <div className="flex items-center gap-2 mb-2 text-[#fbbf24]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={i >= review.rating ? "text-text-sec/30" : ""}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <h4 className="font-bold text-text-main text-sm mb-2">{review.reviewer_name}</h4>
                  {review.comment && (
                    <p className="text-text-sec text-sm leading-relaxed">{review.comment}</p>
                  )}
                  <span className="text-xs text-text-sec/60 mt-2 block">
                    {new Date(review.created_at || '').toLocaleDateString('ar-EG')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-bg-secondary rounded-lg border border-border mt-2 border-dashed text-text-sec font-medium">
              لا توجد تقييمات لهذا المنتج حتى الآن. كن أول من يقيّم!
            </div>
          )}
        </div>

        {/* Add Review Form */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm sticky top-24">
            <h3 className="font-bold text-lg text-text-main mb-6">أضف تقييمك</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-main">تقييمك</label>
                <div className="flex items-center gap-1 text-[#fbbf24]">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none focus:scale-110 transition-transform"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill={(hoverRating || rating) > i ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={(hoverRating || rating) <= i ? "text-text-sec/30" : ""}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <Input 
                label="الاسم" 
                placeholder="اكتب اسمك هنا" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-main">
                  تعليقك (اختياري)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  dir="rtl"
                  rows={4}
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text-main placeholder:text-text-sec focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors resize-none"
                  placeholder="كيف كانت تجربتك مع هذا المنتج؟"
                />
              </div>

              <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
                إرسال التقييم
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
