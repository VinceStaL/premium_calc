/*
  # Enable RLS and Create Policies

  1. Changes
    - Enable RLS on all tables
    - Create CRUD policies for authenticated users
  
  2. Security
    - Enable RLS on ProductRateMaster, ProductRateDetail, RiskLoading, and ScaleFactors tables
    - Create policies allowing authenticated users to perform all CRUD operations
    - Policies ensure only authenticated users can access and modify data
*/

-- Enable RLS on ProductRateMaster
ALTER TABLE "ProductRateMaster" ENABLE ROW LEVEL SECURITY;

-- Create policies for ProductRateMaster
CREATE POLICY "Allow authenticated users to select ProductRateMaster"
  ON "ProductRateMaster"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert ProductRateMaster"
  ON "ProductRateMaster"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update ProductRateMaster"
  ON "ProductRateMaster"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete ProductRateMaster"
  ON "ProductRateMaster"
  FOR DELETE
  TO authenticated
  USING (true);

-- Enable RLS on ProductRateDetail
ALTER TABLE "ProductRateDetail" ENABLE ROW LEVEL SECURITY;

-- Create policies for ProductRateDetail
CREATE POLICY "Allow authenticated users to select ProductRateDetail"
  ON "ProductRateDetail"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert ProductRateDetail"
  ON "ProductRateDetail"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update ProductRateDetail"
  ON "ProductRateDetail"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete ProductRateDetail"
  ON "ProductRateDetail"
  FOR DELETE
  TO authenticated
  USING (true);

-- Enable RLS on RiskLoading
ALTER TABLE "RiskLoading" ENABLE ROW LEVEL SECURITY;

-- Create policies for RiskLoading
CREATE POLICY "Allow authenticated users to select RiskLoading"
  ON "RiskLoading"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert RiskLoading"
  ON "RiskLoading"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update RiskLoading"
  ON "RiskLoading"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete RiskLoading"
  ON "RiskLoading"
  FOR DELETE
  TO authenticated
  USING (true);

-- Enable RLS on ScaleFactors
ALTER TABLE "ScaleFactors" ENABLE ROW LEVEL SECURITY;

-- Create policies for ScaleFactors
CREATE POLICY "Allow authenticated users to select ScaleFactors"
  ON "ScaleFactors"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert ScaleFactors"
  ON "ScaleFactors"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update ScaleFactors"
  ON "ScaleFactors"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete ScaleFactors"
  ON "ScaleFactors"
  FOR DELETE
  TO authenticated
  USING (true);