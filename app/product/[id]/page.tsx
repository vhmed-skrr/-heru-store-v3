import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductById, getAllProductIds, getRelatedProducts } from '@/lib/data/products';
import { getProductReviews } from '@/lib/data/reviews';
import { getSettings } from '@/lib/data/settings';
import { ProductGallery } from '@/components/product/ProductGallery';
import { QuickBuyButton } from '@/components/product/QuickBuyButton';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export const revalidate = 30;

export async function generateStaticParams() {
  const { data: ids } = await getAllProductIds();
  if (!ids) return [];
  return ids.map((id) => ({ id }));
}

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const { data: product } = await getProductById(params.id);
  
  if (!product) {
    return { title: 'المنتج غير موجود' };
  }

  const { data: settings } = await getSettings();
  const storeName = settings?.store_name || 'Heru Store';

  return {
    title: product.name_ar,
    description: product.description_ar ? product.description_ar.substring(0, 150) : product.name_ar,
    openGraph: {
      title: `${product.name_ar} | ${storeName}`,
      description: product.description_ar ? product.description_ar.substring(0, 150) : '',
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
    other: {
      'og:price:amount': product.price.toString(),
      'og:price:currency': 'EGP',
    }
  };
}

export default async function ProductPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { data: product } = await getProductById(params.id);
  
  if (!product || !product.active) {
    notFound();
  }

  const categoryIdStr = typeof product.category_id === 'object' 
    ? (product.category_id as any).id 
    : product.category_id;

  const [{ data: reviews }, { data: relatedProducts }] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(categoryIdStr, product.id, 4)
  ]);

  const isSale = product.original_price && product.original_price > product.price;
  /**
   * isNew — derived from created_at (7-day window).
   * is_new column does not exist in the products schema.
   */
  const isNew = product.created_at
    ? new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    : false;
  let percentage = '';
  if (isSale) {
    percentage = Math.round(((product.original_price! - product.price) / product.original_price!) * 100).toString() + '%';
  }

  return (
    <>
      <main className="flex-1 bg-background pt-8 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Main Product Section */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 mb-16 bg-white p-4 md:p-8 rounded-2xl border border-border/60 shadow-sm">
            
            {/* Gallery */}
            <div className="w-full md:w-1/2">
              <ProductGallery images={product.images || []} alt={product.name_ar} />
            </div>

            {/* Info */}
            <div className="w-full md:w-1/2 flex flex-col pt-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-arabic font-bold text-text-main leading-tight mb-4">
                {product.name_ar}
              </h1>

              <div className="flex items-center gap-2 mb-6">
                {isSale && (
                  <Badge variant="sale" percentage={percentage} />
                )}
                {isNew && !isSale && (
                  <Badge variant="new">جديد</Badge>
                )}
                
                {reviews && reviews.length > 0 && (
                  <div className="flex items-center gap-1 font-medium text-sm text-text-sec mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>({reviews.length} تقييم)</span>
                  </div>
                )}
              </div>

              <div className="flex items-end gap-3 mb-8 pb-6 border-b border-border">
                <span className="text-3xl font-bold text-brand-600 tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {isSale && (
                  <span className="text-lg text-text-sec line-through tabular-nums mb-1">
                    {formatPrice(product.original_price!)}
                  </span>
                )}
              </div>

              <div className="prose prose-sm md:prose-base prose-neutral rtl:text-right mb-10 text-text-sec max-w-none leading-relaxed">
                <p>{product.description_ar}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-auto">
                <AddToCartButton product={product} />
                <QuickBuyButton product={product} />
              </div>
            </div>
          </div>

          <RelatedProducts products={relatedProducts || []} />

          <ProductReviews product_id={product.id} initialReviews={reviews || []} />
        </div>
      </main>
    </>
  );
}
