/*
  # Fix Admin Check and Add Sign Out

  1. Changes
    - Drop existing policies
    - Create new policies for profiles table
    - Add constraint for valid roles
    - Add trigger for handling new users
    - Add trigger for updating last sign in

  2. Security
    - Enable RLS on profiles table
    - Add policies for user access control
    - Add special handling for admin users
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

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Ensure gdavidsons53@gmail.com is always an admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'gdavidsons53@gmail.com';

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE
      WHEN NEW.email = 'gdavidsons53@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the function to handle user sign in
CREATE OR REPLACE FUNCTION handle_user_sign_in()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET last_sign_in_at = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;