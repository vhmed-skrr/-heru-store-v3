import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';

export function CategoriesSection({ categories }: { categories: Category[] | null }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-arabic font-bold text-text-main mb-8 text-center">
          تسوق حسب التصنيف
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.slice(0, 8).map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.id}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-bg-secondary shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.05]"
            >
              {cat.image_url && (
                <Image 
                  src={cat.image_url} 
                  alt={cat.name_ar} 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <h3 className="text-white font-bold font-arabic text-lg md:text-xl drop-shadow-md">
                  {cat.name_ar}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
