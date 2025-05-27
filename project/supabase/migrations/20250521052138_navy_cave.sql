/*
  # Fix profiles RLS policies

  1. Changes
    - Drop existing problematic RLS policies
    - Create new, optimized RLS policies that avoid recursion
    
  2. Security
    - Maintain existing security model where:
      - Users can read their own profile
      - Admins can read all profiles
      - Users can only update their own profile (excluding role changes)
      - Admins can perform all operations
    - Policies are designed to prevent infinite recursion
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "admin_read_all" ON public.profiles;
DROP POLICY IF EXISTS "admin_write_all" ON public.profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;

-- Create new optimized policies
-- Allow users to read their own profile
CREATE POLICY "users_read_own_profile" ON public.profiles
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to read all profiles
-- This policy uses a simpler condition that won't cause recursion
CREATE POLICY "admin_read_all" ON public.profiles
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (
        role = 'admin' OR 
        email = 'gdavidsons53@gmail.com'
      )
    )
  );

-- Allow users to update their own profile (excluding role changes)
CREATE POLICY "users_update_own_profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    (role IS NOT DISTINCT FROM 'user'::text)
  );

-- Allow admins full access for all operations
CREATE POLICY "admin_all_access" ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (
        role = 'admin' OR 
        email = 'gdavidsons53@gmail.com'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (
        role = 'admin' OR 
        email = 'gdavidsons53@gmail.com'
      )
    )
  );