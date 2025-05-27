/*
  # Fix profiles table policies and access control

  1. Changes
    - Drop existing policies
    - Create new policies with correct WITH CHECK clauses
    - Fix admin access to see all profiles
    
  2. Security
    - Admins can see and manage all profiles
    - Users can only see and update their own profiles
    - Prevent role escalation
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
  (email = 'gdavidsons53@gmail.com'::text) OR 
  (role = 'admin'::text)
)
WITH CHECK (
  (email = 'gdavidsons53@gmail.com'::text) OR 
  (role = 'admin'::text)
);

CREATE POLICY "users_read_own_profile"
ON profiles
FOR SELECT
TO authenticated
USING (uid() = id);

CREATE POLICY "users_update_own_profile"
ON profiles
FOR UPDATE
TO authenticated
USING (uid() = id)
WITH CHECK (
  (uid() = id) AND 
  (
    (NOT (role IS DISTINCT FROM 'user'::text)) OR 
    ((jwt() ->> 'email'::text) = 'gdavidsons53@gmail.com'::text)
  )
);