-- Supabase Storage Setup for Heru Store v3
-- Run this in your Supabase SQL Editor.

-- Create product-images bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, '{"image/jpeg","image/png","image/webp","image/gif"}');

-- Create category-images bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('category-images', 'category-images', true, 2097152, '{"image/jpeg","image/png","image/webp","image/gif"}');

-- ==========================================
-- POLICIES FOR product-images
-- ==========================================
CREATE POLICY "Public Access: Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

-- ==========================================
-- POLICIES FOR category-images
-- ==========================================
CREATE POLICY "Public Access: Anyone can view category images"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

CREATE POLICY "Authenticated users can upload category images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'category-images');

CREATE POLICY "Authenticated users can delete category images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'category-images');

CREATE POLICY "Authenticated users can update category images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'category-images');
