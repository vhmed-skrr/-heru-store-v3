"use server";
import { createClient } from '@supabase/supabase-js';

export async function submitSuggestion(data: any) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const payload = {
      name: data.name,
      phone: data.phone,
      description: data.description,
      image_url: data.image_url || null,
      status: 'pending'
    };
    
    const { error } = await supabase.from('suggestions').insert(payload);
    if (error) throw error;
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
