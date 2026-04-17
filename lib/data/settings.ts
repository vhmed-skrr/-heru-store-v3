import { createClient } from '@/lib/supabase/server';
import { Setting } from '@/types';

export async function getSettings(): Promise<{ data: Record<string, string> | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('settings').select('key, value');

    if (error) throw error;

    const settingsRecord: Record<string, string> = {};
    for (const item of data as Setting[]) {
      if (typeof item.value === 'string') {
        settingsRecord[item.key] = item.value;
      } else {
         settingsRecord[item.key] = JSON.stringify(item.value);
      }
    }

    return { data: settingsRecord, error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء جلب إعدادات المتجر" };
  }
}

export async function getSettingByKey(key: string): Promise<{ data: string | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) throw error;

    const value = (data as Setting).value;
    return { data: typeof value === 'string' ? value : JSON.stringify(value), error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء جلب الإعداد" };
  }
}
