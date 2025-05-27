/*
  # Fix Authentication Policies

  1. Changes
    - Drop existing policies
    - Create new policies using correct auth.uid() function
    - Add proper admin and user access controls
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Special handling for admin access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies without recursion
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
USING (
  email = 'gdavidsons53@gmail.com' OR
  role = 'admin'
);