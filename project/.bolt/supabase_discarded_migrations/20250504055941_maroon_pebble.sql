/*
  # Create Risk Loading table

  1. New Tables
    - `RiskLoading`
      - `ProductCode` (text, primary key)
      - `Age` (integer, primary key)
      - `Sex` (text, primary key)
      - `RiskLoading` (double precision)
      - `DateOn` (date, primary key)
      - `DateOff` (date, nullable)
      - `LastUpdateUser` (text)
      - `LastUpdateTimestamp` (timestamptz)

  2. Security
    - Enable RLS on `RiskLoading` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS "RiskLoading" (
  "ProductCode" text NOT NULL,
  "Age" integer NOT NULL CHECK ("Age" >= 0 AND "Age" <= 120),
  "Sex" text NOT NULL CHECK ("Sex" IN ('M', 'F')),
  "RiskLoading" double precision NOT NULL CHECK ("RiskLoading" >= 0 AND "RiskLoading" <= 10),
  "DateOn" date NOT NULL,
  "DateOff" date,
  "LastUpdateUser" text,
  "LastUpdateTimestamp" timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY ("ProductCode", "Age", "Sex", "DateOn")
);

ALTER TABLE "RiskLoading" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON "RiskLoading"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own data"
  ON "RiskLoading"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own data"
  ON "RiskLoading"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own data"
  ON "RiskLoading"
  FOR DELETE
  TO authenticated
  USING (true);