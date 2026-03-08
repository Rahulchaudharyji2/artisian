
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Allow anyone to upload to product-images bucket
CREATE POLICY "Anyone can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow anyone to read product images
CREATE POLICY "Anyone can read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
