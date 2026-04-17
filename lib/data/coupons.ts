import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Coupon } from '@/types';

export async function validateCoupon(code: string, subtotal: number): Promise<{ data: Coupon | null; error: string | null }> {
  try {
    const cookieStore = await cookies();
    
    // Using SERVICE_ROLE to securely access coupon rules
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

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !data) return { data: null, error: "كوبون الخصم غير صحيح أو غير موجود" };

    const coupon = data as Coupon;

    if (!coupon.active) return { data: null, error: "كوبون الخصم غير مفعل" };
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { data: null, error: "انتهت صلاحية هذا الكوبون" };
    }
    if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
      return { data: null, error: "تم الوصول للحد الأقصى لاستخدام الكوبون" };
    }
    if (subtotal < coupon.min_order) {
      return { data: null, error: `الحد الأدنى لتفعيل الكوبون هو ${coupon.min_order} ج.م` };
    }

    return { data: coupon, error: null };
  } catch (error: Omit<Error, "name"> | unknown) {
    return { data: null, error: error instanceof Error ? error.message : "حدث خطأ أثناء التحقق من الكوبون" };
  }
}
