import { createClient } from '@/lib/supabase/server';
import { Review, StoreReview } from '@/types';

export async function getProductReviews(product_id: string): Promise<{ data: Review[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', product_id)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as Review[], error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء جلب المراجعات" };
  }
}

export async function getStoreReviews(limit: number = 10): Promise<{ data: StoreReview[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('store_reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: data as StoreReview[], error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء جلب تقييمات المتجر" };
  }
}

export async function submitProductReview(data: { product_id: string; reviewer_name: string; rating: number; comment: string | null }): Promise<{ data: Review | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data: inserted, error } = await supabase
      .from('reviews')
      .insert({
        product_id: data.product_id,
        reviewer_name: data.reviewer_name,
        rating: data.rating,
        comment: data.comment,
        approved: false 
      })
      .select()
      .single();

    if (error) throw error;
    return { data: inserted as Review, error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال المراجعة" };
  }
}

export async function submitStoreReview(data: { reviewer_name: string; rating: number; comment: string | null }): Promise<{ data: StoreReview | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data: inserted, error } = await supabase
      .from('store_reviews')
      .insert({
        reviewer_name: data.reviewer_name,
        rating: data.rating,
        comment: data.comment,
        approved: false
      })
      .select()
      .single();

    if (error) throw error;
    return { data: inserted as StoreReview, error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال التقييم" };
  }
}
