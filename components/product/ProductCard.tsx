import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { AddToCartButton } from './AddToCartButton';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isSale = product.original_price && product.original_price > product.price;
  const isNew = product.is_new;
  
  let percentage = '';
  if (isSale) {
    percentage = Math.round(((product.original_price! - product.price) / product.original_price!) * 100).toString() + '%';
  }

  const categoryName = typeof product.category_id === 'object' 
    ? (product.category_id as any as Category).name_ar 
    : 'تصنيف عام';

  return (
    <div className="group flex flex-col bg-white border border-border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/3] w-full overflow-hidden flex-shrink-0 bg-bg-secondary">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name_ar}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-600">
             لا توجد صورة
           </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 rtl:right-auto rtl:left-2">
          {isSale && (
            <Badge variant="sale" percentage={percentage} />
          )}
          {isNew && !isSale && (
            <Badge variant="new">جديد</Badge>
          )}
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/category/${product.category_id}`} className="text-xs font-medium text-text-sec mb-1 hover:text-brand-600 transition-colors">
          {categoryName}
        </Link>
        <Link href={`/product/${product.slug}`} className="flex-1">
          <h3 className="font-arabic font-bold text-text-main text-sm md:text-base line-clamp-2 leading-snug mb-2 group-hover:text-brand-600 transition-colors">
            {product.name_ar}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-4 mt-auto">
          <span className="font-bold text-brand-600 text-lg tabular-nums">
            {formatPrice(product.price)}
          </span>
          {isSale ? (
            <span className="text-sm text-text-sec line-through tabular-nums">
              {formatPrice(product.original_price!)}
            </span>
          ) : null}
        </div>
        
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
