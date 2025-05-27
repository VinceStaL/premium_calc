/*
  # Fix Admin Policies

  1. Changes
    - Drop existing policies
    - Create new policies that properly handle admin access
    - Add special handling for setup admin (gdavidsons53@gmail.com)
    
  2. Security
    - Ensure admins can manage all profiles
    - Allow users to read their own profile
    - Allow users to update their own profile (while keeping user role)
    - Special access for setup admin
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies
CREATE POLICY "Users can read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK ((auth.uid() = id) AND (role = 'user'::text));

CREATE POLICY "Admins can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING ((email = 'gdavidsons53@gmail.com') OR (role = 'admin'::text));

-- Ensure setup admin has admin role
UPDATE profiles 
SET role = 'admin'::text 
WHERE email = 'gdavidsons53@gmail.com';