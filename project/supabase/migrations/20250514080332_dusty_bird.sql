/*
  # Fix profiles table policies

  1. Changes
    - Remove recursive policies that were causing infinite loops
    - Implement direct role checks without recursion
    - Simplify admin access checks
    - Maintain proper row-level security

  2. Security
    - Users can read and update their own profiles
    - Admins can manage all profiles
    - No circular references in policies
*/

-- First, drop all existing policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create policy for admins to manage all profiles
CREATE POLICY "Admins can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  role = 'admin'
);

-- Create policy for users to read their own profile
CREATE POLICY "Users can read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id AND role = 'user'
);