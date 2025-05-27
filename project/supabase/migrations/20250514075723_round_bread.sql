/*
  # Fix Profile Policies

  1. Changes
    - Drop all existing profile policies
    - Recreate policies with proper permissions
    - Fix policy for admins to use correct metadata field
  
  2. Security
    - Users can only read and update their own profiles
    - Admins can manage all profiles
*/

-- First drop ALL existing policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Setup user can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new, simplified policies
CREATE POLICY "Users can read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_app_meta_data ->> 'role')::text = 'admin'
  )
);

-- Add policy for users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);