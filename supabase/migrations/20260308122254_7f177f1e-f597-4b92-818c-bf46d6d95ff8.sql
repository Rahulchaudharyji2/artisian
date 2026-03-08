
-- Allow anyone to read all products
DROP POLICY IF EXISTS "Users can read own products" ON public.products;
CREATE POLICY "Anyone can read products" ON public.products FOR SELECT USING (true);

-- Allow anyone to read all profiles (for artisan stories)
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT USING (true);
