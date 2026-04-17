import { getSettings } from '@/lib/data/settings';
import { getCategories } from '@/lib/data/categories';
import { getProducts } from '@/lib/data/products';
import { getStoreReviews } from '@/lib/data/reviews';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { OfferBanner } from '@/components/home/OfferBanner';
import { StoreReviews } from '@/components/home/StoreReviews';

export const revalidate = 60; // ISR for 60 seconds

export default async function HomePage() {
  const [
    { data: settings },
    { data: categories },
    { data: featuredProducts },
    { data: storeReviews }
  ] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getStoreReviews(6)
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        <HeroSection settings={settings} />
        <CategoriesSection categories={categories} />
        <FeaturedProducts products={featuredProducts} />
        <OfferBanner settings={settings} />
        <StoreReviews reviews={storeReviews} />
      </main>
      <Footer />
    </>
  );
}
