/*
  # Fix Profile Policies and Admin Access

  1. Changes
    - Drop existing policies
    - Create new policies that properly handle admin access
    - Add special handling for setup admin
    - Fix policy expressions
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Special handling for admin access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "admin_manage_all_profiles" ON profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;

-- Create new policies
CREATE POLICY "admin_manage_all_profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  (SELECT p.role FROM profiles p WHERE p.id = auth.uid()) = 'admin'
  OR (SELECT p.email FROM profiles p WHERE p.id = auth.uid()) = 'gdavidsons53@gmail.com'
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
WITH CHECK ((auth.uid() = id) AND (NOT (role IS DISTINCT FROM 'user')));

-- Ensure setup admin has admin role
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'gdavidsons53@gmail.com';