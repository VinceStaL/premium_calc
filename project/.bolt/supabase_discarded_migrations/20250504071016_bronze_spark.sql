/*
  # Create Risk Loading table

  1. New Tables
    - `RiskLoading`
      - `ProductCode` (text, part of primary key)
      - `Age` (integer, part of primary key)
      - `Sex` (text, part of primary key)
      - `RiskLoading` (double precision)
      - `DateOn` (date, part of primary key)
      - `DateOff` (date)
      - `LastUpdateUser` (text)
      - `LastUpdateTimestamp` (timestamptz)

  2. Security
    - Enable RLS on `RiskLoading` table
    - Add policy for authenticated users to read all data
    - Add policy for authenticated users to insert/update/delete their own data
*/

CREATE TABLE IF NOT EXISTS "RiskLoading" (
  "ProductCode" text NOT NULL,
  "Age" integer NOT NULL,
  "Sex" text NOT NULL,
  "RiskLoading" double precision NOT NULL,
  "DateOn" date NOT NULL,
  "DateOff" date,
  "LastUpdateUser" text,
  "LastUpdateTimestamp" timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY ("ProductCode", "Age", "Sex", "DateOn"),
  CONSTRAINT "valid_sex" CHECK ("Sex" IN ('M', 'F')),
  CONSTRAINT "valid_age" CHECK ("Age" >= 0 AND "Age" <= 120),
  CONSTRAINT "valid_risk_loading" CHECK ("RiskLoading" >= 0 AND "RiskLoading" <= 10),
  CONSTRAINT "valid_dates" CHECK ("DateOff" > "DateOn")
);

ALTER TABLE "RiskLoading" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all risk loading data"
  ON "RiskLoading"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own risk loading data"
  ON "RiskLoading"
  FOR INSERT
  TO authenticated
  WITH CHECK ("LastUpdateUser" = auth.email());

CREATE POLICY "Users can update their own risk loading data"
  ON "RiskLoading"
  FOR UPDATE
  TO authenticated
  USING ("LastUpdateUser" = auth.email())
  WITH CHECK ("LastUpdateUser" = auth.email());

CREATE POLICY "Users can delete their own risk loading data"
  ON "RiskLoading"
  FOR DELETE
  TO authenticated
  USING ("LastUpdateUser" = auth.email());