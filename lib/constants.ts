export const EGYPT_GOVERNORATES = [
  "القاهرة", "الإسكندرية", "الجيزة", "الدقهلية", "الشرقية", "المنوفية",
  "القليوبية", "البحيرة", "الغربية", "بور سعيد", "دمياط", "الإسماعيلية",
  "السويس", "كفر الشيخ", "الفيوم", "بني سويف", "مطروح", "شمال سيناء",
  "جنوب سيناء", "المنيا", "أسيوط", "سوهاج", "قنا", "البحر الأحمر",
  "الأقصر", "أسوان", "الوادي الجديد"
];

export const WHATSAPP_TEMPLATE = `مرحباً، أود تأكيد طلب جديد! 🛒

*رقم الطلب:* {order_number}
*الاسم:* {customer_name}
*رقم الهاتف:* {phone}
*المحافظة:* {governorate}
*المدينة:* {city}
*العنوان بالتفصيل:* {address}
*طريقة الدفع:* {payment_method}
{notes_section}
*المنتجات:*
{items_list}

*الإجمالي الفرعي:* {subtotal} ج.م
*الخصم:* {discount} ج.م
*الإجمالي النهائي:* {total} ج.م
`;

export const WHATSAPP_QUICK_BUY_TEMPLATE = `مرحباً، أنا مهتم بشراء هذا المنتج:
*المنتج:* {product_name}
*السعر:* {price} ج.م
{variant_section}
هل هو متوفر؟`;

export const ERROR_MESSAGES: Record<string, string> = {
  general: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.",
  invalid_phone: "رقم الهاتف غير صحيح، يجب أن يكون رقم مصري صحيح يتكون من 11 رقم.",
  coupon_invalid: "كوبون الخصم غير صالح أو منتهي الصلاحية.",
  coupon_min_order: "لم تتجاوز الحد الأدنى لتفعيل هذا الكوبون.",
  network_error: "يوجد مشكلة في الاتصال بالإنترنت.",
  empty_cart: "السلة فارغة.",
  validation_error: "يرجى ملء جميع الحقول المطلوبة بشكل صحيح."
};

export const PAYMENT_METHODS = [
  { value: "cash", label: "الدفع عند الاستلام", description: "الدفع نقداً للمندوب عند استلام طلبك." },
  { value: "instapay", label: "إنستاباي (InstaPay)", description: "تحويل سريع عبر تطبيق إنستاباي." },
  { value: "vodafone_cash", label: "فودافون كاش", description: "الدفع عبر محفظة فودافون كاش." }
];
