# Premium Calculation API

A simple API for calculating health insurance premiums based on various factors.

## Overview

This API provides a premium calculation service that uses CSV files for data storage instead of a database. It's designed as a proof of concept that implements the same calculation logic as the original application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Generate sample data:
   ```
   # Start the server
   node server.js
   
   # Then make a GET request to:
   http://localhost:3000/api/generate-sample-data
   ```

3. The API will be available at:
   ```
   http://localhost:3000/api/calculate-premium
   ```

## API Documentation

### Calculate Premium

**Endpoint:** `POST /api/calculate-premium`

**Request Body:**
```json
{
  "effectiveDate": "2023-06-01",
  "productCodes": ["BASIC", "STANDARD"],
  "stateCode": "N",
  "scaleCode": "S",
  "rateCode": "0",
  "paymentFrequency": "monthly",
  "rebateType": "TIER1",
  "lhcPercentage": 0,
  "useBaseRate": true,
  "useRiskRating": false,
  "sex1": "F",
  "age1": 35,
  "sex2": "M",
  "age2": 40
}
```

**Response:**
```json
{
  "results": [
    {
      "productCode": "BASIC",
      "basePremium": 100.00,
      "scaledBasePremium": 100.00,
      "scaleAndFrequencyPremium": 100.00,
      "finalPremium": 90.00,
      "scaleFactor": 1.0,
      "riskLoading1": null,
      "riskLoading2": null,
      "riskLoadingAmount1": null,
      "riskLoadingAmount2": null,
      "rebatePercentage": 10.00,
      "rebateAmount": 10.00,
      "premiumBeforeRebate": 100.00,
      "lhcPercentage": 0,
      "lhcAmount": 0.00
    },
    {
      "productCode": "STANDARD",
      "basePremium": 150.00,
      "scaledBasePremium": 150.00,
      "scaleAndFrequencyPremium": 150.00,
      "finalPremium": 135.00,
      "scaleFactor": 1.0,
      "riskLoading1": null,
      "riskLoading2": null,
      "riskLoadingAmount1": null,
      "riskLoadingAmount2": null,
      "rebatePercentage": 10.00,
      "rebateAmount": 15.00,
      "premiumBeforeRebate": 150.00,
      "lhcPercentage": 0,
      "lhcAmount": 0.00
    }
  ],
  "totalPremium": 225.00
}
```

## CSV File Structure

The API uses the following CSV files stored in the `data` directory:

1. **ProductRateMaster.csv**
   - Contains base rates and product information
   - Fields: ProductCode, StateCode, RateCode, BaseRate, LHCApplicable, RebateApplicable, DateOn, DateOff

2. **ProductRateDetail.csv**
   - Contains detailed rate information for different payment frequencies
   - Fields: ProductCode, StateCode, ScaleCode, RateCode, WeeklyRate, MonthlyRate, QuarterlyRate, HalfYearlyRate, YearlyRate, DateOn, DateOff

3. **ScaleFactors.csv**
   - Contains scaling factors for different coverage types
   - Fields: ProductCode, ScaleCode, ScaleFactor, DateOn, DateOff

4. **RiskLoading.csv**
   - Contains risk loading percentages based on age and gender
   - Fields: ProductCode, Sex, Age, RiskLoading, DateOn, DateOff

5. **RebatePercentage.csv**
   - Contains rebate percentages for different types
   - Fields: RebateType, Rebate, DateOn, DateOff

## Implementation Details

The API is built with:
- Node.js and Express
- CSV files for data storage
- In-memory data querying