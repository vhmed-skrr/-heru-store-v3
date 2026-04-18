"use server";

/**
 * adminProducts — Server Actions
 *
 * DB Schema (schema.sql) — products:
 *   id, name_ar, name_en, description_ar, description_en,
 *   price, stock, category_id, images (text[]), attributes (jsonb),
 *   featured (bool), active (bool), created_at
 *
 * COLUMNS THAT DO NOT EXIST IN THE SCHEMA:
 *   ❌ is_new       → removed from all payloads (caused schema cache error)
 *   ❌ updated_at   → not in schema
 *
 * NOTE on optional columns (may exist if you ran ALTER TABLE migrations):
 *   ⚠️ slug           → used for SEO URLs — see SQL section if you need it
 *   ⚠️ original_price → used for sale badges — see SQL section if you need it
 *
 * SAFE APPROACH: explicitly strip is_new and updated_at from the payload.
 * All other fields (slug, original_price) are kept via conditional spread —
 * they'll only cause errors if they don't exist in your DB.
 */

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { Product } from '@/types';

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('[adminProducts] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, key);
}

function makeSlug(text: string) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '') +
    '-' +
    Date.now().toString().slice(-4)
  );
}

/**
 * Build explicit DB payload that EXCLUDES columns not in the schema.
 * Using an explicit interface is safer than spreading the full Product type.
 */
function buildProductDbPayload(data: Partial<Product>): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name_ar:        data.name_ar        ?? '',
    name_en:        data.name_en        ?? null,
    description_ar: data.description_ar ?? null,
    description_en: data.description_en ?? null,
    price:          data.price          ?? 0,
    stock:          data.stock          ?? 0,
    category_id:    data.category_id    ?? null,
    images:         data.images         ?? [],
    attributes:     data.attributes     ?? {},
    featured:       data.featured       ?? false,
    active:         data.active         ?? true,
    // is_new is intentionally EXCLUDED — column does not exist in schema
    // updated_at is intentionally EXCLUDED — column does not exist in schema
  };

  // Optional columns — only include if the value was provided
  // These columns may or may not exist in your DB depending on migrations run
  if (data.original_price !== undefined) {
    payload.original_price = data.original_price;
  }
  if (data.slug !== undefined) {
    payload.slug = data.slug;
  }

  return payload;
}

export async function upsertProduct(productData: Partial<Product>) {
  try {
    const supabase = getAdminSupabase();
    const isNew = !productData.id;

    if (isNew) {
      const payload = buildProductDbPayload(productData);

      // Generate slug if not provided
      if (!payload.slug) {
        payload.slug = makeSlug((productData.name_ar as string) || 'product');
      }

      const { error } = await supabase.from('products').insert(payload);
      if (error) throw error;
    } else {
      const payload = buildProductDbPayload(productData);
      // Never overwrite slug on update to preserve SEO URLs
      delete payload.slug;

      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', productData.id!);
      if (error) throw error;
    }

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/products');
    // Revalidate by id (products are served by /product/[id])
    if (!isNew && productData.id) {
      revalidatePath(`/product/${productData.id}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('[adminProducts] upsertProduct error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/products');

    return { success: true };
  } catch (error: any) {
    console.error('[adminProducts] deleteProduct error:', error);
    return { success: false, error: error.message };
  }
}
