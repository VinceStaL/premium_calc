-- Drop all existing policies
DROP POLICY IF EXISTS "admin_all_access" ON profiles;
DROP POLICY IF EXISTS "admin_read_all" ON profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;

-- Create new simplified policies
CREATE POLICY "admin_all_access"
ON profiles
FOR ALL
TO authenticated
USING ((role = 'admin') OR (email = 'gdavidsons53@gmail.com'));

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
WITH CHECK ((uid() = id) AND (NOT (role IS DISTINCT FROM 'user')));

-- Ensure setup admin has admin role
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'gdavidsons53@gmail.com';