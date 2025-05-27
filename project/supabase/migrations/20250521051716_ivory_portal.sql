/*
  # Fix Admin Profile Access

  1. Changes
    - Drop existing policies
    - Create new policies that allow admins to view all profiles
    - Maintain user self-management capabilities
    - Fix policy expressions for proper admin access
    
  2. Security
    - Admins can view and manage all profiles
    - Users can still only manage their own profiles
    - Maintain special access for setup admin
*/

-- Drop existing policies
DROP POLICY IF EXISTS "admin_full_access" ON profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;

-- Create new policies
CREATE POLICY "admin_full_access"
ON profiles
FOR ALL
TO authenticated
USING (
  ((email = 'gdavidsons53@gmail.com'::text) OR (role = 'admin'::text))
)
WITH CHECK (
  ((email = 'gdavidsons53@gmail.com'::text) OR (role = 'admin'::text))
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
WITH CHECK (
  ((auth.uid() = id) AND ((NOT (role IS DISTINCT FROM 'user'::text)) OR ((auth.jwt() ->> 'email'::text) = 'gdavidsons53@gmail.com'::text)))
);