import { createClient } from '@/lib/supabase/server';
import { Category } from '@/types';

export async function getCategories(active_only: boolean = true): Promise<{ data: Category[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    let query = supabase.from('categories').select('*').order('sort_order', { ascending: true });
    
    if (active_only) {
      query = query.eq('active', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return { data: data as Category[], error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء جلب التصنيفات" };
  }
}
