/*
  # Fix RebatePercentage LastUpdateUserid handling

  1. Changes
    - Remove default value constraint from LastUpdateUserid
    - Enable RLS on RebatePercentage table
    - Add security policies for CRUD operations
    - Update existing null values
*/

-- First remove the existing default constraint
ALTER TABLE "RebatePercentage" 
ALTER COLUMN "LastUpdateUserid" DROP DEFAULT;

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

-- Update existing null values
UPDATE "RebatePercentage"
SET "LastUpdateUserid" = 'system'
WHERE "LastUpdateUserid" IS NULL;