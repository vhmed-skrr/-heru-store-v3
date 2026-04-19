import { getSettings } from '@/lib/data/settings';
import { getCategories, getFeaturedCategories } from '@/lib/data/categories';
import { getProducts } from '@/lib/data/products';
import { getStoreReviews } from '@/lib/data/reviews';
import { HeroSection } from '@/components/home/HeroSection';

import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { CategorySection } from '@/components/home/CategorySection';
import { StoreReviews } from '@/components/home/StoreReviews';

export const revalidate = 60; // ISR for 60 seconds

export default async function HomePage() {
  const [
    { data: settings },
    { data: categories },
    { data: featuredProducts },
    { data: storeReviews },
    { data: featuredCategories }
  ] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getStoreReviews(6),
    getFeaturedCategories()
  ]);

  // تشخيص مؤقت — احذفه بعد التأكد
  console.log('[HomePage] featuredCategories count:', featuredCategories?.length ?? 0);

  /**
   * WHY fetch here and not inside CategorySection:
   * CategorySection is rendered inside .map() in a Server Component.
   * Nested async Server Components that call cookies() (via createClient)
   * can silently fail in Next.js 15. We fetch all products here in one
   * parallel batch and pass them down as plain props — safe and fast.
   */
  const categoryProductsList = featuredCategories && featuredCategories.length > 0
    ? await Promise.all(
        featuredCategories.map(cat =>
          getProducts({ category_id: cat.id, limit: 10 })
            .then(res => ({ categoryId: cat.id, products: res.data ?? [] }))
        )
      )
    : [];

  // تشخيص مؤقت — احذفه بعد التأكد
  categoryProductsList.forEach(({ categoryId, products }) => {
    const cat = featuredCategories?.find(c => c.id === categoryId);
    console.log(`[HomePage] category "${cat?.name_ar}" → ${products.length} products`);
  });

  return (
    <>
      <main className="flex-1 flex flex-col">
        <HeroSection settings={settings} />

        <CategoryShowcase categories={featuredCategories} />
        <FeaturedProducts products={featuredProducts} />

        {featuredCategories?.map((category) => {
          const entry = categoryProductsList.find(e => e.categoryId === category.id);
          const products = entry?.products ?? [];
          return (
            <CategorySection
              key={category.id}
              category={category}
              products={products}
            />
          );
        })}

        <StoreReviews reviews={storeReviews} />
      </main>
    </>
  );
}
