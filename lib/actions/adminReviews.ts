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

    // Get product_id to revalidate the product page (routes use id, not slug)
    const { data: rev } = await supabase
      .from('reviews')
      .select('product_id')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('reviews')
      .update({ approved: true })
      .eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/reviews');
    revalidatePath('/');
    if (rev?.product_id) {
      // Products are routed by /product/[id], not /product/[slug]
      revalidatePath(`/product/${rev.product_id}`);
    }

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteReview(id: string) {
  try {
    const supabase = getAdminSupabase();

    const { data: rev } = await supabase
      .from('reviews')
      .select('product_id')
      .eq('id', id)
      .single();

    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/reviews');
    revalidatePath('/');
    if (rev?.product_id) {
      revalidatePath(`/product/${rev.product_id}`);
    }

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
