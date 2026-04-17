-- Supabase RLS Verification Script for Heru Store v3
-- Run this in your Supabase SQL Editor to verify and establish correct RLS policies.

-- 1. Enable RLS on all primary tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 🛒 PRODUCTS & CATEGORIES
-- ==============================================

-- Anonymous Users: Can only SELECT (Read)
CREATE POLICY "Allow public read access to active products" ON products
    FOR SELECT USING (active = true);

CREATE POLICY "Allow public read access to categories" ON categories
    FOR SELECT USING (true);

-- Admin (Authenticated Roles or Service Role): Can ALL
-- NOTE: Service role circumvents RLS anyway, but for specific authenticated admins:
CREATE POLICY "Allow authenticated full access to products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access to categories" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================
-- 📦 ORDERS & ORDER ITEMS
-- ==============================================

-- Anonymous Users: Can insert an order (Checkout) but CANNOT read others' orders
CREATE POLICY "Allow public insert to orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Anonymous Users: Cannot SELECT orders. 
-- (They shouldn't list all orders. They only see the success page via order_number token, which may require a special policy or just use Service Role for fetching during checkout success).
CREATE POLICY "Allow public select own order by phone or token" ON orders
    FOR SELECT USING (false); -- Prevent listing. Adjust if using token verification.

-- Admin: Can ALL
CREATE POLICY "Allow authenticated full access to orders" ON orders
    FOR ALL USING (auth.role() = 'authenticated');

-- Order Items
CREATE POLICY "Allow public insert to order items" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to order items" ON order_items
    FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================
-- 💬 REVIEWS
-- ==============================================

-- Anonymous Users: Can SELECT approved reviews, Can INSERT new review
CREATE POLICY "Allow public read access to approved reviews" ON reviews
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow public insert to reviews" ON reviews
    FOR INSERT WITH CHECK (true); -- Requires UI/Server validation before insert

-- Admin: Can ALL
CREATE POLICY "Allow authenticated full access to reviews" ON reviews
    FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================
-- ⚙️ SETTINGS
-- ==============================================

-- Anonymous Users: Can SELECT
CREATE POLICY "Allow public read access to settings" ON settings
    FOR SELECT USING (true);

-- Admin: Can Update
CREATE POLICY "Allow authenticated full access to settings" ON settings
    FOR ALL USING (auth.role() = 'authenticated');
