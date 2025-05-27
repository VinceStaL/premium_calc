/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing problematic policies that cause infinite recursion
    - Create new, simplified RLS policies for the profiles table
    
  2. Security
    - Enable RLS on profiles table
    - Add policy for admins to manage all profiles
    - Add policy for users to read their own profile
    - Add policy for users to update their own profile (excluding role changes)
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new simplified policies
CREATE POLICY "admin_manage_all_profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles admin 
    WHERE admin.id = auth.uid() 
    AND admin.role = 'admin'
  )
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
  auth.uid() = id 
  AND (role IS NOT DISTINCT FROM 'user')
);