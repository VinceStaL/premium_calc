/*
  # Create profiles table and triggers

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `role` (text, default: 'user')
      - `created_at` (timestamp with time zone)
      - `last_sign_in_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for authenticated users to read all profiles
    - Add policies for admins to manage profiles
    - Add policy for users to read their own profile

  3. Triggers
    - Create trigger to automatically create profile on user signup
    - Create trigger to update last_sign_in_at on user sign in
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_sign_in_at timestamptz
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow users to read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admins to manage profiles"
  ON profiles
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    OR auth.email() = 'gdavidsons53@gmail.com'
  );

-- Create function to handle user creation
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

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create function to handle user sign in
CREATE OR REPLACE FUNCTION handle_user_sign_in()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET last_sign_in_at = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user sign in
CREATE OR REPLACE TRIGGER on_auth_user_signed_in
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_sign_in();