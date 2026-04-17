"use server";

import { createClient } from '@supabase/supabase-js';

// Use the anon client directly (no cookies needed for public inserts)
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function submitProductReview(data: {
  product_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
}): Promise<{ data: { id: string } | null; error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    const { data: inserted, error } = await supabase
      .from('reviews')
      .insert({
        product_id: data.product_id,
        reviewer_name: data.reviewer_name,
        rating: data.rating,
        comment: data.comment,
        approved: false,
      })
      .select('id')
      .single();

    if (error) throw error;
    return { data: inserted as { id: string }, error: null };
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال المراجعة',
    };
  }
}

export async function submitStoreReview(data: {
  reviewer_name: string;
  rating: number;
  comment: string | null;
}): Promise<{ data: { id: string } | null; error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    const { data: inserted, error } = await supabase
      .from('store_reviews')
      .insert({
        reviewer_name: data.reviewer_name,
        rating: data.rating,
        comment: data.comment,
        approved: false,
      })
      .select('id')
      .single();

    if (error) throw error;
    return { data: inserted as { id: string }, error: null };
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال التقييم',
    };
  }
}
