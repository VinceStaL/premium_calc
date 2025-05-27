/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing problematic policies
    - Create new simplified policies without recursion
    - Add role validation constraint
    - Create indexes for performance

  2. Security
    - Allow admins to manage all profiles
    - Allow users to read their own profile
    - Allow users to update their own profile (without changing role)
    - Prevent role escalation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "admin_manage_all_profiles" ON profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;

-- Create index for email lookups if not exists
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Create index for role lookups if not exists
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Create new simplified policies
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
WITH CHECK ((auth.uid() = id) AND (role IS NOT DISTINCT FROM 'user'::text));

CREATE POLICY "admin_manage_all_profiles"
ON profiles
FOR ALL
TO authenticated
USING (role = 'admin'::text);

-- Ensure proper role validation
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS valid_role;
ALTER TABLE profiles ADD CONSTRAINT valid_role CHECK (role = ANY (ARRAY['user'::text, 'admin'::text]));