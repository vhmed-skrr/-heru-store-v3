export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  color: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  stock: number;
  category_id: string | null;
  images: string[];
  attributes: Record<string, unknown>;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  name_ar: string;
  price: number;
  quantity: number;
  image: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  coupon_code: string | null;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'cash' | 'instapay' | 'vodafone_cash';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  old_status: string | null;
  new_status: string;
  old_payment_status: string | null;
  new_payment_status: string | null;
  changed_by: string | null;
  note: string | null;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number;
  product_ids: string[];
  active: boolean;
  uses_count: number;
  max_uses: number | null;
  expires_at: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  created_at: string;
}

export interface StoreReview {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  created_at: string;
}

export interface Suggestion {
  id: string;
  name: string | null;
  phone: string | null;
  description: string;
  image_url: string | null;
  status: 'new' | 'reviewed' | 'approved' | 'rejected';
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string | Record<string, unknown> | null;
  created_at: string;
}

export interface CartItem {
  id: string;
  name_ar: string;
  price: number;
  quantity: number;
  image: string | null;
}

export interface CheckoutFormData {
  customer_name: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  payment_method: 'cash' | 'instapay' | 'vodafone_cash';
  coupon_code: string | null;
  notes: string | null;
}
