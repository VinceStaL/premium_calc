# Premium Calculation API

A Node.js API for calculating health insurance premiums using XLSX files for data storage.

## Overview

This API provides endpoints for calculating health insurance premiums based on various factors such as product type, state, scale code, payment frequency, and more. Instead of using a database, the application uses XLSX files to store rate tables and configuration data.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### 1. Generate Sample Data

```
GET /api/generate-sample-data
```

This endpoint generates sample XLSX files with test data for the premium calculation. The files are stored in the `data` directory.

### 2. Calculate Premium

```
POST /api/calculate-premium
```

This endpoint calculates the premium based on the provided parameters.

Example request body:
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["H0A", "HA0"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "0",
  "paymentFrequency": "monthly",
  "rebateType": "RB",
  "lhcPercentage": 0,
  "useBaseRate": true,
  "useRiskRating": false
}
```

## Data Files

The API uses the following XLSX files for data storage:

1. **ProductRateMaster.xlsx**: Contains base rates and product information
2. **ProductRateDetail.xlsx**: Contains detailed rates for different payment frequencies
3. **ScaleFactors.xlsx**: Contains scaling factors for different coverage types
4. **RiskLoading.xlsx**: Contains risk loading percentages based on age and gender
5. **RebatePercentage.xlsx**: Contains rebate percentages for different types

## Implementation Details

- **dataService.js**: Handles loading XLSX data into memory and provides query functions
- **premiumService.js**: Implements the premium calculation logic
- **server.js**: Sets up the Express API endpoints