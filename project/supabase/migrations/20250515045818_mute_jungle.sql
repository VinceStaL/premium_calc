/*
  # Fix User Management Policies

  1. Changes
    - Replace uid() with auth.uid() for proper authentication
    - Add indexes for performance
    - Update role validation
    - Ensure admin access

  2. Security
    - Enable RLS
    - Add policies for user and admin access
    - Validate roles
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
USING ((email = 'gdavidsons53@gmail.com'::text) OR (role = 'admin'::text));

-- Ensure proper role validation
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS valid_role;
ALTER TABLE profiles ADD CONSTRAINT valid_role CHECK (role = ANY (ARRAY['user'::text, 'admin'::text]));

-- Ensure setup admin has admin role
UPDATE profiles 
SET role = 'admin'::text 
WHERE email = 'gdavidsons53@gmail.com';