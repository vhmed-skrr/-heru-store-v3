"use server";
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function addCoupon(data: any) {
  try {
    const supabase = getAdminSupabase();
    const payload = {
      code: data.code.toUpperCase().replace(/\s+/g, ''),
      type: data.type,
      value: parseFloat(data.value),
      min_order: parseFloat(data.min_order) || 0,
      max_uses: parseInt(data.max_uses) || null,
      expires_at: data.expires_at || null,
      active: true,
      uses: 0
    };
    
    const { error } = await supabase.from('coupons').insert(payload);
    if (error) throw error;
    
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleCouponActive(id: string, currentStatus: boolean) {
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from('coupons').update({ active: !currentStatus }).eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch(e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteCoupon(id: string) {
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch(e: any) {
    return { success: false, error: e.message };
  }
}
