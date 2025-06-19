Hi, I'm Amazon Q. I can answer your software development questions. 
                        Ask me to explain, debug, or optimize your code. 
                        You can enter `/` to see a list of quick actions.

---

can you read and understand this project first

---

I'll read and understand your project structure first. Let me explore the workspace to get familiar with the codebase.

---

Now let me read the main README files to understand the project better:

---

Let me also check the main API files to understand the core functionality:

---

Now let me check the frontend components to understand the complete application:

---



Perfect! Now I have a comprehensive understanding of your Premium Calculator project. Let me summarize what I've learned:

## Project Overview

This is a **Health Insurance Premium Calculator** application with the following architecture:

### **Backend (Node.js/Express API)**
- **Main API Server**: `/api/server.js` - Handles premium calculations with Swagger documentation
- **Premium Service**: `/api/premiumService.js` - Core business logic for premium calculations
- **Data Service**: `/api/dataService.js` - Manages Excel file data loading and querying
- **Data Storage**: Excel files instead of traditional database:
  - `ProductRateMaster.xlsx` - Base rates and product info
  - `ProductRateDetail.xlsx` - Detailed rates by payment frequency
  - `ScaleFactors.xlsx` - Coverage scaling factors
  - `RiskLoading.xlsx` - Age/gender risk adjustments
  - `RebatePercentage.xlsx` - Rebate calculations

### **Frontend (React/TypeScript)**
- **Main Component**: `PremiumCalculator.tsx` - Form interface with Tailwind CSS
- **Type Definitions**: `premium.ts` - TypeScript interfaces
- **API Service**: `api.ts` - HTTP communication layer

### **Key Features**
1. **Premium Calculation** for health insurance products (H0A, HA0, AML, BML)
2. **Multiple Payment Frequencies** (weekly, monthly, quarterly, etc.)
3. **Risk Rating** based on age and gender
4. **Scale Factors** for different coverage types (Single, Couple, Family)
5. **Rebate System** with various rebate types
6. **LHC (Lifetime Health Cover) Loading**
7. **Multi-platform Docker Support** (amd64, arm64, arm/v7)

### **Deployment Options**
- **Traditional**: Separate frontend/backend servers
- **Docker Compose**: Complete containerized stack
- **Multi-platform**: Cross-architecture Docker builds

### **API Endpoints**
- `POST /api/calculate-premium` - Main calculation endpoint
- `GET /api/generate-sample-data` - Creates test data
- `GET /api/debug-product/{code}` - Product lookup debugging
- `GET /api-docs` - Swagger documentation

The application follows clean architecture principles with clear separation between presentation, business logic, and data layers. It's designed for Australian health insurance premium calculations with comprehensive business rule support.

Is there anything specific about the project you'd like me to help you with or explain further?

---

can you check the  **@postman_test.md**  and create cases where I can test different rate code?

---

Looking at the postman_test.md file, I can see it only tests with `rateCode: "0"`. Let me check what rate codes are available in the data and create comprehensive test cases for different rate codes.

---

Now let me check what rate codes are available in the sample data generation:

---

The Excel file is binary, so I can't read it directly. Let me check the sample data generation in the server.js to understand what rate codes are available:

---

Creating extended Postman test cases with different rate codes based on the sample data structure

---



I've created comprehensive test cases for different rate codes in `postman_test_extended.md`. Here's what I've provided:

## Key Test Cases Created:

### **Rate Code Testing Scenarios:**
1. **Rate Code "0"** - Standard rate (successful case)
2. **Rate Code "1"** - Non-existent rate (error case)
3. **Invalid Rate Code** - String validation
4. **Empty Rate Code** - Boundary testing
5. **Rate Code with Different States** - State-specific rates
6. **Multiple Products** - All product codes with rate code "0"
7. **Different Payment Frequencies** - Rate code with yearly payments
8. **Scale Factors** - Rate code with couple/family scales
9. **ProductRateDetail** - Using detailed rates instead of base rates
10. **Risk Rating** - Rate code with risk loading

### **Key Features:**
- **Error Handling Tests** - Validates proper error responses for invalid rate codes
- **Data Validation** - Confirms expected premium amounts for known rate codes
- **Boundary Testing** - Tests edge cases like empty strings
- **Integration Testing** - Tests rate codes with other features (rebates, risk rating, etc.)
- **Collection-Level Setup** - Automatic sample data generation

### **Current System Limitations:**
Based on the sample data in `server.js`, the system currently only supports:
- **Rate Code "0"** as the standard rate
- Different rates for different states (A=ACT, N=NSW)
- Different rates for different products (H0A, HA0, AML, BML)

### **To Add More Rate Codes:**
The document includes instructions on how to extend the system with additional rate codes by modifying the sample data generation in `server.js`.

This comprehensive test suite will help you validate that the premium calculation API handles different rate codes correctly and provides appropriate error handling for invalid scenarios.

---

can you read this file  **@ProductRateMaster.xlsx** ? where you should be able to see the rate code column

---

I can see the Excel file structure, but the worksheet data appears to be truncated in the file context. Let me try to read the actual Excel file using a different approach to see the rate codes:



---

Reading the Excel file to see the actual rate codes available

---

```shell
cd /Users/sta/dev/15\ Bolt/premium_calc/premium_calc/api && node -e "
const XLSX = require('xlsx');
const path = require('path');

try {
  const filePath = path.join(__dirname, 'data', 'ProductRateMaster.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  console.log('ProductRateMaster data:');
  console.log(JSON.stringify(data, null, 2));
  
  // Show unique rate codes
  const rateCodes = [...new Set(data.map(row => row.RateCode))];
  console.log('\nUnique Rate Codes:', rateCodes);
  
} catch (error) {
  console.error('Error reading file:', error.message);
}
"

ProductRateMaster data:


[
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 286.8,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 286.8,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 283.93,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 281.06,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 278.2,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 275.33,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 272.46,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 269.59,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 266.72,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 263.86,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 260.99,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 258.12,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 255.25,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 252.38,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 286.8,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 286.8,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 283.93,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 281.06,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 278.2,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 275.33,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 272.46,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 269.59,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 266.72,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 263.86,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 260.99,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 258.12,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 255.25,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 252.38,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 305.5,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 305.5,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 302.45,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 299.39,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 296.34,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 293.28,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOf

f": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 290.23,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 287.17,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 284.12,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 281.06,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 278.01,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 274.95,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 271.9,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 268.84,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 278.7,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 278.7,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 275.91,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 273.13,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 270.34,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 267.55,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 264.77,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 261.98,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 259.19,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 256.4,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 253.62,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 250.83,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 248.04,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 245.26,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 295.55,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 295.55,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 292.59,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 289.64,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 286.68,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 283.73,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 280.77,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 277.82,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 274.86,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 271.91,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 268.95,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 266,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 263.04,
    "LHCApplicable": "Y",
    "RebateApplica

ble": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 260.08,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 306.8,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 306.8,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 303.73,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 300.66,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 297.6,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 294.53,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 291.46,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 288.39,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 285.32,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 282.26,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 279.19,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 276.12,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 273.05,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 269.98,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 270.5,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 270.5,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 267.8,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 265.09,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 262.39,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 259.68,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 256.98,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 254.27,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 251.57,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 248.86,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 246.16,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 243.45,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 240.75,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 238.04,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 193.45,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 193.45,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 191.52,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 189.58,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 187.65,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 104,
    "DateOn": "2023-01-0

1",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 185.71,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 183.78,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 181.84,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 179.91,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 177.97,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 176.04,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 174.11,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 172.17,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 170.24,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.35,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.35,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 81.53,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 80.7,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 79.88,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 79.06,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 78.23,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.41,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 76.59,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 75.76,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.94,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.12,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 73.29,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 72.47,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.35,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.35,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 81.53,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 80.7,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 79.88,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 79.06,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 78.23,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.41,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 76.59,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 75.76,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.94,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.12,
    "LHCApplicable": "N",
    "RebateApplicable": 

"Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 73.29,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 72.47,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 87.1,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 87.1,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 86.23,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 85.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 84.49,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 83.62,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.75,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 81.87,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 81,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 80.13,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 79.26,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 78.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.52,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 76.65,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 92.25,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 92.25,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 91.33,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 90.41,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 89.48,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 88.56,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 87.64,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 86.72,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 85.79,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 84.87,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 83.95,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 83.03,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.1,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 81.18,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.2,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.2,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 73.46,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 72.72,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "Heal

thCategory": 3,
    "BaseRate": 71.98,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 71.23,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 70.49,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 69.75,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 69.01,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 68.27,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 67.52,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 66.78,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 66.04,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 65.3,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 83.75,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 83.75,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.91,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.08,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 81.24,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 80.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 79.56,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 78.73,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.89,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.05,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 76.21,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 75.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.54,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 73.7,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.55,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.55,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 76.78,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 76,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 75.22,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.45,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 73.67,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 72.9,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 72.12,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 71.35,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 70.57,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": 

"W",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 69.8,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 69.02,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 68.25,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 71.05,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 71.05,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 70.34,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 69.63,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 68.92,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 68.21,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 67.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 66.79,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 66.08,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 65.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 64.66,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 63.95,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 63.24,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 62.53,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.44,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.31,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.24,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.18,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.11,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.05,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.98,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.92,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.85,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.79,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.72,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.44,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.37,
    "LHCApplicable": "N",
    "Re

bateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.31,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.24,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.18,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.11,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.05,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.98,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.92,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.85,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.79,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.72,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,


    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.44,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 102,
    "DateOn": "2023-01-01",
 

   "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.31,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.24,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.18,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.11,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.05,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.98,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.92,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.85,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.79,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.72,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.44,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.31,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.24,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.18,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.11,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.05,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.98,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.92,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.85,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.79,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.72,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode

": "S",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y

"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.44,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.44,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicabl

e": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.31,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.31,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.24,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.24,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.18,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.18,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.11,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.11,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.05,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.05,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.98,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.98,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-3

1",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.92,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.92,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.85,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.85,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.79,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.79,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "A",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.72,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "N",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.72,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "S",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "V",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "W",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "AML",
    "StateCode": "X",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.5,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 100,
    "D

ateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.44,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.44,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.31,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.31,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.24,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.24,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.39,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.18,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.18,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.11,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.11,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode":

 "BML",
    "StateCode": "S",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.05,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 6.05,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.38,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.98,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.98,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.92,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.92,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.85,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.85,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.79,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.79,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "A",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.72,
    "LHCAppli

cable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "N",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 5.72,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "S",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "V",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "W",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "BML",
    "StateCode": "X",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 5,
    "BaseRate": 0.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 304.98,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 304.98,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 322.32,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 294.05,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 311.82,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 323.69,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 285.39,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 210.89,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 304.98,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 304.98,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 322.32,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 294.05,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 311.82,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 323.69,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 285.39,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 210.89,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 301.93,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 301.93,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 319.1,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 291.11,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 308.7,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 320.45,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 282.54,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 208.78,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 298.88,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 298.88,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 315.87,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 288.17,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 305.58,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 102,
    "Date

On": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 317.22,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 279.68,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 206.67,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 295.83,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 295.83,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 312.65,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 285.23,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 302.47,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 313.98,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 276.83,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 204.56,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 292.78,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 292.78,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 309.43,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 282.29,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 299.35,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 310.74,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 273.97,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 202.45,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 289.73,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 289.73,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 306.2,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 279.35,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 296.23,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 307.51,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 271.12,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 200.35,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 286.68,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 286.68,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 302.98,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 276.41,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 293.11,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 304.27,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 268.27,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 198.24,
    

"LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 283.63,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 283.63,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 299.76,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 273.47,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 289.99,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 301.03,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 265.41,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 196.13,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 280.58,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 280.58,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 296.53,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 270.53,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 286.87,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 297.79,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 262.56,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 194.02,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 277.53,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 277.53,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 293.31,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 267.59,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 283.76,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 294.56,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 259.7,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 191.91,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 274.48,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 274.48,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 290.09,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 264.65,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 280.64,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 291.32,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 256.85,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 189.8,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 271.43,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 271.43,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": 

"Q",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 286.86,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 261.7,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 277.52,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 288.08,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 254,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 187.69,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "A",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 268.38,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "N",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 268.38,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "Q",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 283.64,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "S",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 258.76,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "T",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 274.4,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "V",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 284.85,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "W",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 251.14,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "H0A",
    "StateCode": "X",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 2,
    "BaseRate": 185.58,
    "LHCApplicable": "Y",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 83.83,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 83.83,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 88.66,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 93.91,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 75.53,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 85.25,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 78.94,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 0,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 72.32,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 83.83,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 83.83,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 88.66,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 93.91,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 75.53,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 85.25,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 78.94,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 100,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 72.32,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.99,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.99,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 87.77,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 92.97,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.78,
    "LHCAp

plicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 84.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 78.15,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 101,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 71.6,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.15,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.15,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 86.89,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 92.03,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.02,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 83.55,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.36,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 102,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 70.87,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 81.32,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 81.32,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 86,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 91.09,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 73.27,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.69,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 76.57,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 103,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 70.15,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 80.48,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 80.48,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 85.11,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 90.15,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 72.51,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 81.84,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 75.78,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 104,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 69.43,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 79.64,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 79.64,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 84.23,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 89.21,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 71.75,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 80.99,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 105,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.99,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 105,
    "DateOn": "20

23-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 68.71,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 78.8,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 78.8,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 83.34,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 88.28,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 71,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 80.14,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.2,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 106,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 67.98,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.96,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.96,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.45,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 87.34,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 70.24,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 79.28,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 73.42,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 107,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 67.26,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.12,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.12,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 81.57,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 86.4,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 69.49,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 78.43,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 72.63,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 108,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 66.54,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 76.29,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 76.29,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 80.68,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 85.46,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 68.73,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 77.58,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 71.84,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 109,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 65.81,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 75.45,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 75.45,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"


  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 79.79,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 84.52,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 67.98,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 76.73,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 71.05,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 110,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 65.09,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.61,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 74.61,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 78.91,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 83.58,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 67.22,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 75.87,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 70.26,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 111,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 64.37,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "A",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 73.77,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "N",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 73.77,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "Q",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 78.02,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "S",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 82.64,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "T",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 66.47,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "V",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 75.02,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "W",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 69.47,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  },
  {
    "ProductCode": "HA0",
    "StateCode": "X",
    "RateCode": 112,
    "DateOn": "2023-01-01",
    "DateOff": "2099-12-31",
    "HealthCategory": 3,
    "BaseRate": 63.64,
    "LHCApplicable": "N",
    "RebateApplicable": "Y"
  }
]



Unique Rate Codes: [
    0, 100, 101, 102, 103,
  104, 105, 106, 107, 108,
  109, 110, 111, 112
]


```

---

Perfect! Now I can see the actual rate codes available in the ProductRateMaster.xlsx file. Let me create updated test cases based on the real data:

---

Creating comprehensive rate code test cases based on the actual Excel data showing rate codes 0, 100-112

---



Perfect! I've created comprehensive test cases based on the actual rate codes found in your ProductRateMaster.xlsx file. Here's what I discovered and included:

## **Available Rate Codes:**
- **0, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112**

## **Key Test Cases Created:**

### **1. Individual Rate Code Tests**
- Tests for specific rate codes (0, 100, 101, 102, 112)
- Each test validates the expected premium amount based on actual data

### **2. Rate Code Comparison Tests**
- Compares premiums between different rate codes
- Validates that different rate codes produce different premiums

### **3. State-Specific Testing**
- Tests same rate code across different states
- Validates state-specific premium variations

### **4. Invalid Rate Code Testing**
- Tests non-existent rate codes (999)
- Validates proper error handling

### **5. Comprehensive Range Testing**
- Tests all valid rate codes systematically
- Performance testing for response times

### **6. Integration Testing**
- Rate codes with scale factors (couple/family)
- Rate codes with different payment frequencies
- Rate codes with yearly calculations

## **Expected Premium Values (HA0, State A):**
I've included a reference table showing the expected premium for each rate code, such as:
- Rate Code 0: $82.35
- Rate Code 100: $83.99
- Rate Code 101: $75.62
- Rate Code 112: $73.77

## **Key Insights from the Data:**
1. **Health Categories**: All entries show HealthCategory = 3
2. **State Variations**: Each rate code has different premiums per state
3. **LHC Applicable**: Most HA0 products have "N" (not applicable)
4. **Rebate Applicable**: All HA0 products have "Y" (applicable)

These test cases will help you thoroughly validate that your premium calculation API correctly handles all the different rate codes available in your system and provides accurate premium calculations for each scenario.

---

great, do we still need this file postman_test_extended.md ?

---

No, we don't need `postman_test_extended.md` anymore. The new `postman_test_rate_codes.md` file is based on actual data and supersedes it.



---

Removing the outdated extended test file since it was based on assumptions rather than actual data

---

```shell
rm postman_test_extended.md

```

---



Done. The `postman_test_extended.md` file has been removed since `postman_test_rate_codes.md` contains comprehensive test cases based on your actual data with real rate codes (0, 100-112) and expected premium values.

---

OK, now I used your script and I can see the backend API works fine with different rate code, but on the frontend UI, when clicking on Rate Code, in the dropdown menu, I can only see &quot;Standard&quot;, I don&#39;t see other rate code

---

The frontend dropdown only shows "Standard (0)" because it's hardcoded. Let me update it to include all available rate codes:

---

Adding all available rate codes to the frontend dropdown based on the actual data from ProductRateMaster.xlsx

---



Done! The frontend dropdown now includes all available rate codes (0, 100-112) that exist in your ProductRateMaster.xlsx file. Users can now select any of these rate codes from the dropdown menu.

---

I messed up my git branches, can you 1) recreate the postman_test_rate_codes.md and 2) fix the frontend UI that is not loading the correct ratecodes. You have done this before, but I messed up my branches so can you please check and redo them?

---

I'll recreate both files for you.

---

Recreating the comprehensive rate code test file

---

Now let me check and fix the frontend rate code dropdown:

---

Now I'll fix the rate code dropdown to include all available rate codes:

---

Adding all available rate codes (0, 100-112) to the frontend dropdown

---



Done! I've recreated both files:

1. **`postman_test_rate_codes.md`** - Comprehensive test cases for all rate codes (0, 100-112) with expected premium values
2. **Fixed the frontend dropdown** - Now includes all available rate codes from your ProductRateMaster.xlsx file

The frontend Rate Code dropdown now shows:
- Standard (0)
- Rate 100 through Rate 112

Users can now select any of these rate codes and the API will calculate premiums using the correct rates from your Excel data.

---

Now lets try to fix another issue, in the  **@postman_test.md** I can see we can do a premium calculation with multiple product code, in real life, we would want user to be able to select 3 product code, can you first check if our backend API support 3 product code in a query?

---

Let me test if the backend API supports 3 product codes by creating a quick test:



---

Testing if the backend API supports 3 product codes in a single request

---

```shell
curl -X POST http://localhost:3000/api/calculate-premium \
  -H "Content-Type: application/json" \
  -d '{
    "effectiveDate": "2025-06-01",
    "productCodes": ["H0A", "HA0", "AML"],
    "stateCode": "A",
    "scaleCode": "S",
    "rateCode": "0",
    "paymentFrequency": "monthly",
    "useBaseRate": true,
    "useRiskRating": false
  }'

  % Total    % Received % X

ferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0

100  1199  10

0   964  100   235   541k   131k --:--:-- --:--:-- --:--:-- 1170k


{"results":[{"productCode":"H0A","basePremium":286.8,"scaledBasePremium":286.8,"scaleAndFrequencyPremium":286.8,"finalPremium":286.8,"scaleFactor":1,"riskLoading1":null,"riskLoading2":null,"riskLoadingAmount1":null,"riskLoadingAmount2":null,"rebatePercentage":null,"rebateAmount":0,"premiumBeforeRebate":286.8,"lhcAmount":0},{"productCode":"HA0","basePremium":82.35,"scaledBasePremium":82.35,"scaleAndFrequencyPremium":82.35,"finalPremium":82.35,"scaleFactor":1,"riskLoading1":null,"riskLoading2":null,"riskLoadingAmount1":null,"riskLoadingAmount2":null,"rebatePercentage":null,"rebateAmount":0,"premiumBeforeRebate":82.35,"lhcAmount":0},{"productCode":"AML","basePremium":6.5,"scaledBasePremium":6.5,"scaleAndFrequencyPremium":6.5,"finalPremium":6.5,"scaleFactor":1,"riskLoading1":null,"riskLoading2":null,"riskLoadingAmount1":null,"riskLoadingAmount2":null,"rebatePercentage":null,"rebateAmount":0,"premiumBeforeRebate":6.5,"lhcAmount":0}],"totalPremium":375.65}

```

---

Perfect! The backend API already supports 3 product codes. Let me test with all 4 available product codes:



---

Testing with all 4 product codes to confirm full support

---

```shell
curl -X POST http://localhost:3000/api/calculate-premium \
  -H "Content-Type: application/json" \
  -d '{
    "effectiveDate": "2025-06-01",
    "productCodes": ["H0A", "HA0", "AML", "BML"],
    "stateCode": "A",
    "scaleCode": "S",
    "rateCode": "0",
    "paymentFrequency": "monthly",
    "useBaseRate": true,
    "useRiskRating": false
  }'

  % Total    % R

eceived % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0

100  1509  100  1267

  100   242   682k   130k --:--:-- --:--:-- --:--:-- 1473k


{"results":[{"productCode":"H0A","basePremium":286.8,"scaledBasePremium":286.8,"scaleAndFrequencyPremium":286.8,"finalPremium":286.8,"scaleFactor":1,"riskLoading1":null,"riskLoading2":null,"riskLoadingAmount1":null,"riskLoadingAmount2":null,"rebatePercentage":null,"rebateAmount":0,"premiumBeforeRebate":286.8,"lhcAmount":0},{"productCode":"HA0","basePremium":82.35,"scaledBasePremium":82.35,"scaleAndFrequencyPremium":82.35,"finalPremium":82.35,"scaleFactor":1,"riskLoading1":null,"riskLoading2":null,"riskLoadingAmount1":null,"riskLoadingAmount2":null,"rebatePercentage":null,"rebateAmount":0,"premiumBeforeRebate":82.35,"lhcAmount":0},{"productCode":"AML","basePremium":6.5,"scaledBasePremium":6.5,"scaleAndFrequencyPremium":6.5,"finalPremium":6.5,"scaleFactor":1,"riskLoading1":null,"riskLoading2":null,"riskLoadingAmount1":null,"riskLoadingAmount2":null,"rebatePercentage":null,"rebateAmount":0,"premiumBeforeRebate":6.5,"lhcAmount":0},{"productCode":"BML","basePremium":6.5,"scaledBasePremium":6.5,"scaleAndFrequencyPremium":6.5,"finalPremium":6.5,"scaleFactor":1,"riskLoading1":null,"riskLoading2":null,"riskLoadingAmount1":null,"riskLoadingAmount2":null,"rebatePercentage":null,"rebateAmount":0,"premiumBeforeRebate":6.5,"lhcAmount":0}],"totalPremium":382.15}

```

---



Excellent! The backend API fully supports multiple product codes (tested with 3 and 4 products successfully). The API returns:

- **3 products**: Total premium $375.65 (H0A: $286.80 + HA0: $82.35 + AML: $6.50)
- **4 products**: Total premium $382.15 (H0A: $286.80 + HA0: $82.35 + AML: $6.50 + BML: $6.50)

**Conclusion**: Your backend API already supports multiple product codes (3, 4, or any number). The API correctly:
1. Processes each product code individually
2. Calculates premiums for each product
3. Returns results array with all products
4. Calculates total premium as sum of all individual premiums

The backend is ready for multiple product selection - no changes needed there!

---

great, now can you update the frontend UI so user can select up to 3 product code, so they can select 1 or 2 or 3 product code for premium calculation.

---

I'll update the frontend to allow users to select up to 3 product codes using checkboxes:

---

Replacing single product dropdown with checkboxes allowing selection of up to 3 products

---

Now I need to update the form validation to ensure at least one product is selected:

---

Adding validation to ensure at least one product code is selected

---



Perfect! The frontend now supports selecting up to 3 product codes with the following features:

## **Changes Made:**

1. **Replaced dropdown with checkboxes** - Users can now select multiple products
2. **Limited to 3 selections** - Checkboxes become disabled when 3 are selected
3. **Visual feedback** - Shows "Select up to 3" in the label
4. **Validation** - Requires at least 1 product to be selected
5. **Error handling** - Shows error message if no products selected

## **User Experience:**

- Users can select 1, 2, or 3 product codes
- Once 3 are selected, remaining checkboxes are disabled
- Clear visual indication of what's selected
- Form validation prevents submission without selections
- Backend will calculate premiums for all selected products and return total

The backend already supports this functionality perfectly, so users can now get comprehensive premium calculations for multiple products in a single request!