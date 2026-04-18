import { createClient } from '@/lib/supabase/client';

/**
 * Storage Upload Utilities
 *
 * WHY the client must be created INSIDE each function (not at module level):
 *
 * The old code did:
 *   const supabase = createClient()   ← module-level, runs at import time
 *
 * This causes an RLS error ("new row violates row-level security policy") because:
 *   1. The module is imported before the user's auth session is established.
 *   2. The singleton client captures the auth state at import time (no session).
 *   3. All subsequent upload calls use an anonymous client → storage RLS blocks them.
 *
 * Fix: call createClient() inside each function so it reads the current
 * session cookies at the moment the upload actually happens.
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
    // ← createClient() called here, inside the function, with the live session
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
    // ← createClient() called here, inside the function, with the live session
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

export async function deleteImage(
  url: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient();

    // Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
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
