"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { Category } from '@/types';

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function makeSlug(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') + '-' + Date.now().toString().slice(-4);
}

export async function upsertCategory(categoryData: Partial<Category>) {
  try {
    const supabase = getAdminSupabase();
    const isNew = !categoryData.id;

    if (isNew) {
      if (!categoryData.slug) {
        categoryData.slug = makeSlug(categoryData.name_ar || 'category');
      }

      const { error } = await supabase
        .from('categories')
        .insert(categoryData as Omit<Category, 'id'>);
        
      if (error) throw error;
    } else {
      const { id, created_at, ...updateData } = categoryData;
      const { error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', categoryData.id);
        
      if (error) throw error;
    }

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/categories');
    
    if (!isNew && categoryData.slug) {
        revalidatePath(`/category/${categoryData.slug}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error upserting category:', error);
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
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
}
