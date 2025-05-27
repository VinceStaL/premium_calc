/*
  # Fix User Management Policies

  1. Changes
    - Drop existing policies
    - Create new policies that properly handle user listing and management
    - Add indexes for performance
    - Ensure proper role validation
    - Set up admin role for initial admin user

  2. Security
    - Enable RLS on profiles table
    - Add policies for user self-management
    - Add policies for admin management
    - Add role validation constraint
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Create new simplified policies
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
USING (
  (SELECT p.role FROM profiles p WHERE p.id = auth.uid()) = 'admin'::text
  OR (SELECT p.email FROM profiles p WHERE p.id = auth.uid()) = 'gdavidsons53@gmail.com'::text
);

-- Ensure proper role validation
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS valid_role;
ALTER TABLE profiles ADD CONSTRAINT valid_role CHECK (role = ANY (ARRAY['user'::text, 'admin'::text]));

-- Ensure setup admin has admin role
UPDATE profiles 
SET role = 'admin'::text 
WHERE email = 'gdavidsons53@gmail.com';