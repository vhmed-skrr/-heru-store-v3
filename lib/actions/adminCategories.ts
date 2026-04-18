"use server";

/**
 * adminCategories — Server Actions
 *
 * DB Schema (schema.sql):
 *   categories(id UUID, name_ar, name_en, color, icon, image_url, sort_order, active, created_at)
 *
 * IMPORTANT: There is NO `order_index`, NO `image`, NO `slug` column in the DB.
 * Always build an explicit clean payload — never spread the whole Category object
 * into insert/update, or Supabase will throw a schema cache error for unknown columns.
 */

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { Category } from '@/types';

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('[adminCategories] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, key);
}

/** Only the columns that actually exist in the `categories` table. */
interface CategoryDbPayload {
  name_ar: string;
  name_en: string;
  color: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  active: boolean;
}

function buildDbPayload(data: Partial<Category>): CategoryDbPayload {
  return {
    name_ar:    data.name_ar    ?? '',
    name_en:    data.name_en    ?? '',
    color:      data.color      ?? null,
    icon:       data.icon       ?? null,
    image_url:  data.image_url  ?? null,   // ← image_url, NOT image
    sort_order: data.sort_order ?? 0,       // ← sort_order, NOT order_index
    active:     data.active     ?? true,
  };
}

export async function upsertCategory(categoryData: Partial<Category>) {
  try {
    const supabase = getAdminSupabase();
    const isNew    = !categoryData.id;
    const payload  = buildDbPayload(categoryData);

    if (isNew) {
      const { error } = await supabase.from('categories').insert(payload);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', categoryData.id!);
      if (error) throw error;
    }

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/categories');

    return { success: true };
  } catch (error: any) {
    console.error('[adminCategories] upsertCategory error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/categories');

    return { success: true };
  } catch (error: any) {
    console.error('[adminCategories] deleteCategory error:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleCategoryHomepage(id: string, show_on_homepage: boolean) {
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase
      .from('categories')
      .update({ show_on_homepage })
      .eq('id', id);
    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/categories');

    return { success: true };
  } catch (error: any) {
    console.error('[adminCategories] toggleCategoryHomepage error:', error);
    return { success: false, error: error.message };
  }
}
