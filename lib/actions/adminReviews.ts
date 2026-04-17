"use server";
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function approveReview(id: string) {
  try {
    const supabase = getAdminSupabase();
    
    // First figure out if it's a product review to target its static page for revalidation
    let product_slug = null;
    const { data: rev } = await supabase.from('reviews').select('product_id').eq('id', id).single();
    if (rev && rev.product_id) {
       const { data: prod } = await supabase.from('products').select('slug').eq('id', rev.product_id).single();
       if (prod) product_slug = prod.slug;
    }

    const { error } = await supabase.from('reviews').update({ approved: true }).eq('id', id);
    if (error) throw error;
    
    revalidatePath('/admin/reviews');
    revalidatePath('/');
    if (product_slug) {
       revalidatePath(`/product/${product_slug}`);
    }
    
    return { success: true };
  } catch(e: any) { 
    return { success: false, error: e.message }; 
  }
}

export async function deleteReview(id: string) {
  try {
    const supabase = getAdminSupabase();
    
    let product_slug = null;
    const { data: rev } = await supabase.from('reviews').select('product_id').eq('id', id).single();
    if (rev && rev.product_id) {
       const { data: prod } = await supabase.from('products').select('slug').eq('id', rev.product_id).single();
       if (prod) product_slug = prod.slug;
    }

    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/admin/reviews');
    revalidatePath('/');
    if (product_slug) {
       revalidatePath(`/product/${product_slug}`);
    }
    
    return { success: true };
  } catch(e: any) { 
    return { success: false, error: e.message }; 
  }
}
