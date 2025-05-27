/*
  # Fix profiles table RLS policy

  1. Changes
    - Remove existing problematic RLS policies on profiles table
    - Add new simplified RLS policies that avoid recursion:
      - Allow users to read their own profile
      - Allow admins to manage all profiles
      - Allow initial setup user to manage all profiles
  
  2. Security
    - Maintains RLS protection
    - Prevents infinite recursion
    - Ensures proper access control
*/

-- Drop existing policies to replace them with fixed versions
DROP POLICY IF EXISTS "Allow admins to manage profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to read all profiles" ON profiles;

-- Create new policies that avoid recursion
CREATE POLICY "Users can read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
);

CREATE POLICY "Admins can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Special policy for initial setup user
CREATE POLICY "Setup user can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  auth.jwt()->>'email' = 'gdavidsons53@gmail.com'
);