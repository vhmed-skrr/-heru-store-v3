"use server";

import { createClient } from '@supabase/supabase-js';

/**
 * submitReview — Server Actions for product & store reviews
 *
 * Uses SERVICE_ROLE key instead of anon key.
 * WHY: The anon key is subject to RLS policies. If the reviews table has
 * RLS enabled (which is the default), anonymous inserts will be blocked.
 * The service_role key bypasses RLS, allowing public users to submit reviews
 * while keeping the logic secure server-side (this is a Server Action).
 */

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('[submitReview] Missing Supabase env vars');
  return createClient(url, key);
}

export async function submitProductReview(data: {
  product_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
}): Promise<{ data: { id: string } | null; error: string | null }> {
  try {
    if (!data.reviewer_name?.trim()) {
      return { data: null, error: 'الاسم مطلوب' };
    }
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      return { data: null, error: 'يجب اختيار تقييم من 1 إلى 5 نجوم' };
    }

    const supabase = getSupabase();
    const { data: inserted, error } = await supabase
      .from('reviews')
      .insert({
        product_id:    data.product_id,
        reviewer_name: data.reviewer_name.trim(),
        rating:        data.rating,
        comment:       data.comment?.trim() || null,
        approved:      false,
      })
      .select('id')
      .single();

    if (error) throw error;
    return { data: inserted as { id: string }, error: null };
  } catch (error: unknown) {
    console.error('[submitProductReview] error:', error);
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
    if (!data.reviewer_name?.trim()) {
      return { data: null, error: 'الاسم مطلوب' };
    }
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      return { data: null, error: 'يجب اختيار تقييم من 1 إلى 5 نجوم' };
    }

    const supabase = getSupabase();
    const { data: inserted, error } = await supabase
      .from('store_reviews')
      .insert({
        reviewer_name: data.reviewer_name.trim(),
        rating:        data.rating,
        comment:       data.comment?.trim() || null,
        approved:      false,
      })
      .select('id')
      .single();

    if (error) throw error;
    return { data: inserted as { id: string }, error: null };
  } catch (error: unknown) {
    console.error('[submitStoreReview] error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال التقييم',
    };
  }
}
