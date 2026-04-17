import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';

export interface GetProductsOptions {
  category_id?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
  sort?: string;
}

export async function getProducts(options: GetProductsOptions = {}): Promise<{ data: Product[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    let query = supabase.from('products').select('*');

    query = query.eq('active', true);

    if (options.category_id) {
      query = query.eq('category_id', options.category_id);
    }

    if (options.featured !== undefined) {
      query = query.eq('featured', options.featured);
    }

    if (options.search) {
      query = query.or(`name_ar.ilike.%${options.search}%,name_en.ilike.%${options.search}%`);
    }

    if (options.sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (options.sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    if (options.limit !== undefined) {
      query = query.limit(options.limit);
      if (options.offset !== undefined) {
         query = query.range(options.offset, options.offset + options.limit - 1);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return { data: data as Product[], error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
     return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء جلب المنتجات" };
  }
}

export async function getProductById(id: string): Promise<{ data: Product | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    
    if (error) throw error;
    
    return { data: data as Product, error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء جلب المنتج" };
  }
}

export async function getRelatedProducts(category_id: string, exclude_id: string, limit: number = 4): Promise<{ data: Product[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .eq('category_id', category_id)
      .neq('id', exclude_id)
      .limit(limit);
      
    if (error) throw error;
    
    return { data: data as Product[], error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء جلب المنتجات ذات الصلة" };
  }
}

export async function getAllProductIds(): Promise<{ data: string[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('products').select('id').eq('active', true);
    
    if (error) throw error;
    
    return { data: data.map(item => item.id), error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء جلب المعرفات" };
  }
}
