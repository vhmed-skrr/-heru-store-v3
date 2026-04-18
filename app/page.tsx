import { getSettings } from '@/lib/data/settings';
import { getCategories, getFeaturedCategories } from '@/lib/data/categories';
import { getProducts } from '@/lib/data/products';
import { getStoreReviews } from '@/lib/data/reviews';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
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

  return (
    <>
      <main className="flex-1 flex flex-col">
        <HeroSection settings={settings} />
        <CategoriesSection categories={categories} />
        <FeaturedProducts products={featuredProducts} />
        <CategoryShowcase categories={featuredCategories} />
        <StoreReviews reviews={storeReviews} />
      </main>
    </>
  );
}
