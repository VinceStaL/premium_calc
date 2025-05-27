/*
  # Fix Profile Policies

  1. Changes
    - Drop existing policies
    - Create new policies using auth.uid() instead of uid()
    - Fix role check syntax
    
  2. Security
    - Allow admins to manage all profiles
    - Allow users to read their own profile
    - Allow users to update their own profile (without changing role)
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
USING ((role = 'admin') OR (email = 'gdavidsons53@gmail.com'));

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