/*
  # Migrate User Data to Profiles

  1. Changes
    - Ensures all existing auth.users are represented in profiles table
    - Sets up correct roles for existing users
    - Preserves last sign in data
    - Sets initial admin user

  2. Data Migration
    - Copies missing users from auth.users to profiles
    - Updates last_sign_in_at for existing users
    - Sets admin role for setup user

  3. Validation
    - Ensures email uniqueness
    - Validates role values
*/

-- First ensure the profiles table exists and has the correct structure
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_sign_in_at timestamptz
);

-- Migrate any missing users from auth.users to profiles
INSERT INTO profiles (id, email, role, created_at, last_sign_in_at)
SELECT 
  users.id,
  users.email,
  CASE 
    WHEN users.email = 'gdavidsons53@gmail.com' THEN 'admin'
    ELSE 'user'
  END as role,
  users.created_at,
  users.last_sign_in_at
FROM auth.users
LEFT JOIN profiles ON users.id = profiles.id
WHERE profiles.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Update any existing profiles with missing data
UPDATE profiles p
SET 
  last_sign_in_at = u.last_sign_in_at,
  created_at = u.created_at
FROM auth.users u
WHERE p.id = u.id
  AND (p.last_sign_in_at IS NULL OR p.created_at IS NULL);

-- Ensure the setup user has admin role
UPDATE profiles
SET role = 'admin'
WHERE email = 'gdavidsons53@gmail.com'
  AND role != 'admin';

-- Add a check constraint to ensure role is either 'user' or 'admin'
ALTER TABLE profiles
ADD CONSTRAINT valid_role CHECK (role IN ('user', 'admin'));