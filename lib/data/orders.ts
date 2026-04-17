import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as createRegularClient } from '@/lib/supabase/server';
import { CheckoutFormData, CartItem, Order } from '@/types';

export async function createOrder(
  data: CheckoutFormData & { items: CartItem[]; subtotal: number; discount: number; total: number }
): Promise<{ data: Order | null; error: string | null }> {
  try {
    const cookieStore = await cookies();
    
    // Using SERVICE_ROLE to bypass RLS for creating orders securely
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );
    
    const newOrder = {
      customer_name: data.customer_name,
      phone: data.phone,
      governorate: data.governorate,
      city: data.city,
      address: data.address,
      items: data.items,
      subtotal: data.subtotal,
      discount: data.discount,
      coupon_code: data.coupon_code,
      total: data.total,
      status: 'pending',
      payment_method: data.payment_method,
      payment_status: 'unpaid',
      notes: data.notes
    };

    const { data: insertedOrder, error } = await supabase
      .from('orders')
      .insert(newOrder)
      .select()
      .single();

    if (error) throw error;

    return { data: insertedOrder as Order, error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الطلب" };
  }
}

export async function getOrderByNumber(order_number: string): Promise<{ data: Order | null; error: string | null }> {
  try {
    const supabase = await createRegularClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', order_number)
      .single();

    if (error) throw error;

    return { data: data as Order, error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "لم يتم العثور على الطلب" };
  }
}
