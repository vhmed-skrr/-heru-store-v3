"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function updateOrderStatus({
  order_id,
  new_status,
  new_payment_status,
  note
}: {
  order_id: string;
  new_status: string;
  new_payment_status?: string;
  note?: string;
}) {
  try {
    const supabase = getAdminSupabase();

    const updateData: any = {
      status: new_status,
      updated_at: new Date().toISOString()
    };

    if (new_payment_status) {
      updateData.payment_status = new_payment_status;
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', order_id);

    if (updateError) throw updateError;

    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert({
        order_id,
        status: new_status,
        note: note || '',
      });

    if (historyError) throw historyError;

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${order_id}`);
    revalidatePath('/admin');

    return { success: true };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
}
