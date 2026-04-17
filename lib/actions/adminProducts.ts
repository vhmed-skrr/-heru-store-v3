"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { Product } from '@/types';

// Get Admin Service role
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Generate base slug without duplicates initially, supabase will handle slug unique constraints via UI typically. I'll add timestamp to resolve conflicts natively.
function makeSlug(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') + '-' + Date.now().toString().slice(-4);
}

export async function upsertProduct(productData: Partial<Product>) {
  try {
    const supabase = getAdminSupabase();
    const isNew = !productData.id;

    if (isNew) {
      if (!productData.slug) {
        productData.slug = makeSlug(productData.name_ar || 'product');
      }

      const { data, error } = await supabase
        .from('products')
        .insert(productData as Omit<Product, 'id'>)
        .select()
        .single();
        
      if (error) throw error;
    } else {
      // Don't update slug to prevent breaking SEO URLs unless explicitly requested
      const { id, created_at, ...updateData } = productData;
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productData.id)
        .select()
        .single();
        
      if (error) throw error;
    }

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/products');
    if (!isNew && productData.slug) {
      revalidatePath(`/product/${productData.slug}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error upserting product:', error);
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
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
}
