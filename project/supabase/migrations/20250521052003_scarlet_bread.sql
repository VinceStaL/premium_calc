/*
  # Fix User Management Policies

  1. Changes
    - Drop existing policies
    - Create separate policies for admin read and write operations
    - Fix user self-management policies
    
  2. Security
    - Allow admins to view and manage all profiles
    - Allow users to view their own profile
    - Allow users to update their own profile (without changing role)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "admin_full_access" ON profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;

-- Create admin policies
CREATE POLICY "admin_read_all"
ON profiles
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'email'::text) = 'gdavidsons53@gmail.com'::text OR 
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'::text
  )
);

CREATE POLICY "admin_write_all"
ON profiles
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'email'::text) = 'gdavidsons53@gmail.com'::text OR 
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'::text
  )
);

-- Create user policies
CREATE POLICY "users_read_own_profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  (auth.uid() = id) AND 
  (NOT (role IS DISTINCT FROM 'user'::text))
);