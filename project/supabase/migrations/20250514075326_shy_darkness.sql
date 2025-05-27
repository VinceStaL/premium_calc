/*
  # Fix profiles policies

  1. Changes
    - Drop existing policies
    - Create new policies with correct column reference
    - Add policy for users to update their own profile

  2. Security
    - Users can only read and update their own profile
    - Admins can manage all profiles
    - Uses correct column name for app metadata
*/

-- First drop existing policies to replace them
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Setup user can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

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
    AND (auth.users.raw_app_meta_data->>'role')::text = 'admin'
  )
);

-- Add policy for users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);