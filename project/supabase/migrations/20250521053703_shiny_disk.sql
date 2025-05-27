/*
  # Fix Profile RLS Policies

  1. Changes
    - Drop existing policies
    - Create new policies that allow profile creation
    - Fix admin access checks
    - Allow authenticated users to create their own profile
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Special handling for admin access
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "admin_all_access" ON profiles;
DROP POLICY IF EXISTS "admin_read_all" ON profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;

-- Create new simplified policies
CREATE POLICY "admin_all_access"
ON profiles
FOR ALL
TO authenticated
USING (
  ((auth.jwt() ->> 'email'::text) = 'gdavidsons53@gmail.com'::text) OR 
  (role = 'admin'::text)
);

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
WITH CHECK ((auth.uid() = id) AND (NOT (role IS DISTINCT FROM 'user'::text)));

CREATE POLICY "users_create_own_profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id AND
  ((auth.jwt() ->> 'email'::text) = email) AND
  (role = 'user'::text OR (auth.jwt() ->> 'email'::text) = 'gdavidsons53@gmail.com'::text)
);

-- Ensure setup admin has admin role
UPDATE profiles 
SET role = 'admin'::text 
WHERE email = 'gdavidsons53@gmail.com';