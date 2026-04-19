import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { HomepageSectionsClient, SectionCategory } from '@/components/admin/HomepageSectionsClient';

export const dynamic = 'force-dynamic';

export default async function HomepageSectionsPage() {
  const supabase = await createClient();

  /**
   * Fetch all active categories.
   * We use a subquery count trick via Supabase to get product_count per category.
   * Supabase supports: select('*, products(count)') which returns
   *   { ...category, products: [{ count: N }] }
   */
  const { data: rawCategories, error } = await supabase
    .from('categories')
    .select(`
      id,
      name_ar,
      icon,
      sort_order,
      show_on_homepage,
      products:products(count)
    `)
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[HomepageSectionsPage] fetch error:', error);
  }

  // Normalise the Supabase count format: products: [{ count: N }] → product_count: N
  const categories: SectionCategory[] = (rawCategories ?? []).map((row: any) => ({
    id: row.id as string,
    name_ar: row.name_ar as string,
    icon: row.icon as string | null,
    sort_order: (row.sort_order as number) ?? 0,
    show_on_homepage: (row.show_on_homepage as boolean) ?? false,
    product_count: Array.isArray(row.products) && row.products.length > 0
      ? (row.products[0].count as number) ?? 0
      : 0,
  }));

  const featured = categories
    .filter((c) => c.show_on_homepage)
    .sort((a, b) => a.sort_order - b.sort_order);

  const available = categories
    .filter((c) => !c.show_on_homepage)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <HomepageSectionsClient featured={featured} available={available} />
  );
}
