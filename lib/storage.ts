import { createClient } from '@/lib/supabase/client';

/**
 * Storage Upload Utilities
 *
 * WHY the client must be created INSIDE each function (not at module level):
 * createClient() at module level captures the auth state at import time (no session yet).
 * By calling it inside each function, it reads the current session at upload time.
 */

function generateFileName(file: File, folder: string = '') {
  const fileExt   = file.name.split('.').pop();
  const timestamp = Date.now();
  const randomId  = Math.random().toString(36).substring(2, 9);
  const baseName  = `${timestamp}-${randomId}.${fileExt}`;
  return folder ? `${folder}/${baseName}` : baseName;
}

export async function uploadProductImage(
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();
    const fileName = generateFileName(file, 'products');

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return { url: publicUrl, error: null };
  } catch (error: any) {
    console.error('[storage] uploadProductImage error:', error);
    return { url: null, error: error.message || 'حدث خطأ أثناء رفع صورة المنتج' };
  }
}

export async function uploadCategoryImage(
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();
    const fileName = generateFileName(file, 'categories');

    const { error: uploadError } = await supabase.storage
      .from('category-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('category-images')
      .getPublicUrl(fileName);

    return { url: publicUrl, error: null };
  } catch (error: any) {
    console.error('[storage] uploadCategoryImage error:', error);
    return { url: null, error: error.message || 'حدث خطأ أثناء رفع صورة التصنيف' };
  }
}

/**
 * uploadSuggestionImage — uploads to the `suggestions` bucket.
 *
 * WHY a separate function & bucket:
 * The suggest page is used by anonymous (unauthenticated) visitors.
 * The `product-images` and `category-images` buckets require an authenticated
 * Supabase session → RLS blocks anonymous uploads.
 *
 * The `suggestions` bucket has a PUBLIC INSERT policy so anyone can upload:
 *   CREATE POLICY "public can upload suggestions"
 *   ON storage.objects FOR INSERT TO public
 *   WITH CHECK (bucket_id = 'suggestions');
 *
 * See the SQL section in the fix notes for the full setup script.
 */
export async function uploadSuggestionImage(
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();
    const fileName = generateFileName(file, 'suggestions');

    const { error: uploadError } = await supabase.storage
      .from('suggestions')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('suggestions')
      .getPublicUrl(fileName);

    return { url: publicUrl, error: null };
  } catch (error: any) {
    console.error('[storage] uploadSuggestionImage error:', error);
    return { url: null, error: error.message || 'حدث خطأ أثناء رفع الصورة' };
  }
}

export async function deleteImage(
  url: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient();

    const urlParts = url.split('/storage/v1/object/public/');
    if (urlParts.length !== 2) {
      throw new Error('Invalid Supabase storage URL format');
    }

    const pathParts = urlParts[1].split('/');
    const bucket    = pathParts[0];
    const filePath  = pathParts.slice(1).join('/');

    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (deleteError) throw deleteError;

    return { success: true, error: null };
  } catch (error: any) {
    console.error('[storage] deleteImage error:', error);
    return { success: false, error: error.message || 'فشل حذف الصورة' };
  }
}

export function getOptimizedUrl(url: string, width: number = 800): string {
  if (!url || !url.includes('/storage/v1/object/public/')) return url;
  return `${url}?width=${width}&quality=80&resize=contain`;
}
