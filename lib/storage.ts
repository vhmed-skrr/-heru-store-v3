import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

function generateFileName(file: File, folder: string = '') {
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 9);
  const baseName = `${timestamp}-${randomId}.${fileExt}`;
  return folder ? `${folder}/${baseName}` : baseName;
}

export async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  try {
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
    return { url: null, error: error.message || 'حدث خطأ أثناء الرفع' };
  }
}

export async function uploadCategoryImage(file: File): Promise<{ url: string | null; error: string | null }> {
  try {
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
    return { url: null, error: error.message || 'حدث خطأ أثناء الرفع' };
  }
}

export async function deleteImage(url: string): Promise<{ success: boolean; error: string | null }> {
  try {
    // Extract path from public URL
    // Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = url.split('/storage/v1/object/public/');
    if (urlParts.length !== 2) {
      throw new Error("Invalid Supabase storage URL");
    }
    
    const pathParts = urlParts[1].split('/');
    const bucket = pathParts[0];
    const filePath = pathParts.slice(1).join('/');

    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (deleteError) throw deleteError;

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'فشل الحذف' };
  }
}

export function getOptimizedUrl(url: string, width: number = 800): string {
  if (!url || !url.includes('/storage/v1/object/public/')) return url;
  
  // Appends Supabase transform parameters
  return `${url}?width=${width}&quality=80&resize=contain`;
}
