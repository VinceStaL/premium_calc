/*
  # Fix profiles table policies

  1. Changes
    - Remove recursive policy for admin management
    - Implement non-recursive policies for admin access
    - Maintain existing user self-management policies
  
  2. Security
    - Admins can manage all profiles without recursive checks
    - Users can still read and update their own profiles
    - Maintains row-level security
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Create new non-recursive admin policy
CREATE POLICY "Admins can manage all profiles" ON profiles
FOR ALL 
TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Ensure existing user self-management policies remain
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can read own profile" ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);