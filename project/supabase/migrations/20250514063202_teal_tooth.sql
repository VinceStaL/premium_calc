/*
  # Fix LastUpdateUserid to use email

  1. Changes
    - Update LastUpdateUserid to use email from JWT instead of user ID
    - Set default value to use email or 'system' as fallback
    - Update existing records to use 'system' where null
*/

-- First remove the existing default constraint
ALTER TABLE "RebatePercentage" 
ALTER COLUMN "LastUpdateUserid" DROP DEFAULT;

-- Set the new default using JWT email
ALTER TABLE "RebatePercentage"
ALTER COLUMN "LastUpdateUserid" SET DEFAULT COALESCE((auth.jwt() ->> 'email'::text), 'system'::text);

-- Update existing null values
UPDATE "RebatePercentage"
SET "LastUpdateUserid" = 'system'
WHERE "LastUpdateUserid" IS NULL;