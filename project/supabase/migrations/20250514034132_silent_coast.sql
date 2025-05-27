/*
  # Fix RebatePercentage LastUpdateUserid

  1. Changes
    - Enable RLS on RebatePercentage table
    - Add security policies for CRUD operations
    - Set default value for LastUpdateUserid using auth.uid()
    - Update existing null values

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Enable RLS
ALTER TABLE "RebatePercentage" ENABLE ROW LEVEL SECURITY;

-- Add security policies
CREATE POLICY "Allow authenticated users to select RebatePercentage"
  ON "RebatePercentage"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert RebatePercentage"
  ON "RebatePercentage"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update RebatePercentage"
  ON "RebatePercentage"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete RebatePercentage"
  ON "RebatePercentage"
  FOR DELETE
  TO authenticated
  USING (true);

-- Update LastUpdateUserid default and existing values
ALTER TABLE "RebatePercentage" 
ALTER COLUMN "LastUpdateUserid" SET DEFAULT COALESCE(auth.uid()::text, 'system');

UPDATE "RebatePercentage"
SET "LastUpdateUserid" = 'system'
WHERE "LastUpdateUserid" IS NULL;