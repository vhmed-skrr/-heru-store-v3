-- Enable UUID extension if it's not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Sequence for order numbers (ORD-2026-0001, etc.)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- 2. Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    color TEXT,
    icon TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    price NUMERIC NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    images TEXT[] DEFAULT '{}',
    attributes JSONB DEFAULT '{}'::jsonb,
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT DEFAULT ('ORD-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('order_number_seq')::text, 4, '0')),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    governorate TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    coupon_code TEXT,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'instapay', 'vodafone_cash')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Order Status History Table
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    old_payment_status TEXT,
    new_payment_status TEXT,
    changed_by TEXT,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Coupons Table
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value NUMERIC NOT NULL CHECK (value > 0),
    min_order NUMERIC DEFAULT 0,
    product_ids TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    uses_count INTEGER DEFAULT 0 CHECK (uses_count >= 0),
    max_uses INTEGER,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    reviewer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Store Reviews Table
CREATE TABLE store_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Suggestions Table
CREATE TABLE suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    phone TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Settings Table
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON products(active, featured);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

CREATE INDEX IF NOT EXISTS idx_reviews_product_approved ON reviews(product_id, approved);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id);


-- ==========================================
-- SECURITY: ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- Authenticated ALL Policies
-- ------------------------------------------
CREATE POLICY "Authenticated users can do all on categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can do all on products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can do all on orders" ON orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can do all on order_status_history" ON order_status_history FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can do all on coupons" ON coupons FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can do all on reviews" ON reviews FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can do all on store_reviews" ON store_reviews FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can do all on suggestions" ON suggestions FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can do all on settings" ON settings FOR ALL TO authenticated USING (true);

-- ------------------------------------------
-- Public SELECT Policies
-- ------------------------------------------
CREATE POLICY "Public can select active categories" ON categories FOR SELECT TO public USING (active = true);
CREATE POLICY "Public can select active products" ON products FOR SELECT TO public USING (active = true);
CREATE POLICY "Public can select approved reviews" ON reviews FOR SELECT TO public USING (approved = true);
CREATE POLICY "Public can select approved store_reviews" ON store_reviews FOR SELECT TO public USING (approved = true);

CREATE POLICY "Public can select specific settings" ON settings FOR SELECT TO public USING (
    key IN (
        'store_name', 'whatsapp', 'announcement_items', 'announcement_active', 
        'hero_title', 'hero_subtitle', 'hero_cta_primary', 'hero_cta_secondary', 
        'footer_tagline', 'footer_support_hours', 'social_instagram', 'social_facebook', 
        'social_tiktok', 'social_telegram', 'logo_type', 'logo_value', 'logo_height', 
        'nav_links', 'store_bg_primary', 'store_accent_color'
    )
);

-- ------------------------------------------
-- Public INSERT Policies
-- ------------------------------------------
CREATE POLICY "Public can insert reviews" ON reviews FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can insert store_reviews" ON store_reviews FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can insert suggestions" ON suggestions FOR INSERT TO public WITH CHECK (true);

-- ------------------------------------------
-- Service Role INSERT Policies
-- ------------------------------------------
-- (Note: service_role inherently bypasses RLS, but defining them makes intent explicit)
CREATE POLICY "Service role can insert orders" ON orders FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can insert order_status_history" ON order_status_history FOR INSERT TO service_role WITH CHECK (true);
