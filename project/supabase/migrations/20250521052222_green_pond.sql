/*
  # Fix recursive RLS policies for profiles table

  1. Changes
    - Drop existing recursive policies on profiles table
    - Create new non-recursive policies for admin access
    - Maintain existing user-level policies
    
  2. Security
    - Maintains RLS on profiles table
    - Simplifies admin access policy to prevent recursion
    - Preserves user-level access controls
*/

-- Drop existing policies that are causing recursion
DROP POLICY IF EXISTS "admin_all_access" ON public.profiles;
DROP POLICY IF EXISTS "admin_read_all" ON public.profiles;

-- Create new non-recursive admin policies
CREATE POLICY "admin_all_access" ON public.profiles
  FOR ALL 
  TO authenticated
  USING (role = 'admin'::text OR email = 'gdavidsons53@gmail.com'::text)
  WITH CHECK (role = 'admin'::text OR email = 'gdavidsons53@gmail.com'::text);

CREATE POLICY "admin_read_all" ON public.profiles
  FOR SELECT 
  TO authenticated
  USING (role = 'admin'::text OR email = 'gdavidsons53@gmail.com'::text);

-- Note: The following existing policies are kept unchanged as they don't cause recursion:
-- - users_read_own_profile
-- - users_update_own_profile