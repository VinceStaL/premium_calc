/*
  # Fix profiles table policies

  1. Changes
    - Remove existing policies that may cause infinite recursion
    - Create new, simplified policies for the profiles table
    - Maintain security while avoiding recursive policy checks
  
  2. Security
    - Enable RLS on profiles table
    - Add policies for:
      - Admin users can manage all profiles
      - Regular users can read and update their own profile
      - Special admin (gdavidsons53@gmail.com) has full access
*/

-- First, drop existing policies to start fresh
DROP POLICY IF EXISTS "admin_manage_all_profiles" ON profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;

-- Create new, simplified policies
CREATE POLICY "admin_full_access"
ON profiles
FOR ALL
TO authenticated
USING (
  (email = 'gdavidsons53@gmail.com') OR 
  (role = 'admin')
)
WITH CHECK (
  (email = 'gdavidsons53@gmail.com') OR 
  (role = 'admin')
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
  auth.uid() = id AND 
  (
    -- Users can't change their role to admin
    (role IS NOT DISTINCT FROM 'user') OR
    -- Unless they're the special admin
    (auth.jwt()->>'email' = 'gdavidsons53@gmail.com')
  )
);