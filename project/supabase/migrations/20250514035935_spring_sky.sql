/*
  # Fix LastUpdateUserid default value

  Updates the LastUpdateUserid column in RebatePercentage table to use auth.uid()
  instead of auth.jwt() for better reliability.

  1. Changes
    - Drops existing default value
    - Sets new default using auth.uid()
    - Updates null values to 'system'
*/

-- First remove the existing default constraint
ALTER TABLE "RebatePercentage" 
ALTER COLUMN "LastUpdateUserid" DROP DEFAULT;

-- Set the new default using auth.uid()
ALTER TABLE "RebatePercentage"
ALTER COLUMN "LastUpdateUserid" SET DEFAULT auth.uid()::text;

-- Update existing null values
UPDATE "RebatePercentage"
SET "LastUpdateUserid" = 'system'
WHERE "LastUpdateUserid" IS NULL;