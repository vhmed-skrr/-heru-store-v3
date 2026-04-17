"use server";
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function saveSettings(settingsData: any) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 1, ...settingsData });
      
    if (error) throw error;
    
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
