/*
  # Fix LastUpdateUserid default value

  Updates the LastUpdateUserid column in RebatePercentage table to:
  - Set correct default value using auth.jwt()
  - Update existing records
*/

-- First remove the existing default constraint
ALTER TABLE "RebatePercentage" 
ALTER COLUMN "LastUpdateUserid" DROP DEFAULT;

-- Set the new default using auth.jwt()
ALTER TABLE "RebatePercentage"
ALTER COLUMN "LastUpdateUserid" SET DEFAULT COALESCE((auth.jwt() ->> 'email'::text), 'system'::text);

-- Update existing null values
UPDATE "RebatePercentage"
SET "LastUpdateUserid" = 'system'
WHERE "LastUpdateUserid" IS NULL;