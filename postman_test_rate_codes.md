# Postman Test Scripts - Rate Code Testing (Based on Actual Data)

This document contains comprehensive test cases for different rate codes based on the actual ProductRateMaster.xlsx data.

## Available Rate Codes
Based on the actual data, the following rate codes are available:
- **0, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112**

## Test Cases for Different Rate Codes

### 1. Rate Code 0 - Standard Rate

#### Request
```
POST http://localhost:3000/api/calculate-premium
```

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["HA0"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "0",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": false
}
```

#### Test Script
```javascript
pm.test("Rate Code 0 - Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Rate Code 0 - Premium calculation successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.results[0].productCode).to.eql("HA0");
    pm.expect(jsonData.results[0].basePremium).to.be.a("number");
});
```

### 2. Rate Code 100 - Alternative Rate

#### Request
```
POST http://localhost:3000/api/calculate-premium
```

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["HA0"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "100",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": false
}
```

#### Test Script
```javascript
pm.test("Rate Code 100 - Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Rate Code 100 - Expected premium for HA0", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.results[0].basePremium).to.eql(83.99);
});
```

### 3. Rate Code 101 - Health Category 3

#### Request
```
POST http://localhost:3000/api/calculate-premium
```

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["HA0"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "101",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": false
}
```

#### Test Script
```javascript
pm.test("Rate Code 101 - Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Rate Code 101 - Expected premium for HA0", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.results[0].basePremium).to.eql(75.62);
});
```

### 4. Rate Code 102 - Higher Premium Tier

#### Request
```
POST http://localhost:3000/api/calculate-premium
```

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["HA0"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "102",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": false
}
```

#### Test Script
```javascript
pm.test("Rate Code 102 - Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Rate Code 102 - Expected premium for HA0", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.results[0].basePremium).to.eql(82.15);
});
```

### 5. Rate Code 112 - Highest Premium Tier

#### Request
```
POST http://localhost:3000/api/calculate-premium
```

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["HA0"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "112",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": false
}
```

#### Test Script
```javascript
pm.test("Rate Code 112 - Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Rate Code 112 - Expected premium for HA0", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.results[0].basePremium).to.eql(73.77);
});
```

### 6. Rate Code Comparison Test - Multiple Rate Codes

#### Request
```
POST http://localhost:3000/api/calculate-premium
```

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["HA0"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "100",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": false
}
```

#### Test Script
```javascript
// Store result for comparison
pm.test("Rate Code 100 - Store result for comparison", function () {
    var jsonData = pm.response.json();
    pm.globals.set("rateCode100Premium", jsonData.results[0].basePremium);
});

// Follow up with Rate Code 101 request and compare
pm.sendRequest({
    url: pm.request.url,
    method: 'POST',
    header: pm.request.headers,
    body: {
        mode: 'raw',
        raw: JSON.stringify({
            "effectiveDate": "2025-06-01",
            "productCodes": ["HA0"],
            "stateCode": "A",
            "scaleCode": "S",
            "rateCode": "101",
            "paymentFrequency": "monthly",
            "useBaseRate": true,
            "useRiskRating": false
        })
    }
}, function (err, response) {
    pm.test("Rate Code Comparison - 100 vs 101", function () {
        var rate100Premium = parseFloat(pm.globals.get("rateCode100Premium"));
        var rate101Premium = response.json().results[0].basePremium;
        
        pm.expect(rate100Premium).to.not.equal(rate101Premium);
        console.log(`Rate 100: $${rate100Premium}, Rate 101: $${rate101Premium}`);
    });
});
```

### 7. State-Specific Rate Code Testing

#### Request
```
POST http://localhost:3000/api/calculate-premium
```

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["HA0"],
  "stateCode": "Q",
  "scaleCode": "S",
  "rateCode": "101",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": false
}
```

#### Test Script
```javascript
pm.test("Rate Code 101 QLD - Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Rate Code 101 QLD - Different premium for different state", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.results[0].basePremium).to.eql(79.89);
});
```

### 8. Invalid Rate Code Testing

#### Request
```
POST http://localhost:3000/api/calculate-premium
```

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["HA0"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "999",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": false
}
```

#### Test Script
```javascript
pm.test("Invalid Rate Code 999 - Should return error", function () {
    pm.response.to.have.status(500);
});

pm.test("Invalid Rate Code 999 - Error message indicates missing rate", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("error");
    pm.expect(jsonData.error).to.include("No base rate found");
});
```

### 9. Rate Code with Scale Factors

#### Request
```
POST http://localhost:3000/api/calculate-premium
```

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["HA0"],
  "stateCode": "A",
  "scaleCode": "D",
  "rateCode": "105",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": false
}
```

#### Test Script
```javascript
pm.test("Rate Code 105 with Couple Scale - Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Rate Code 105 with Couple Scale - Premium scaled correctly", function () {
    var jsonData = pm.response.json();
    var expectedScaledPremium = 79.64 * 2.0; // Base * Scale Factor
    pm.expect(jsonData.results[0].scaledBasePremium).to.eql(expectedScaledPremium);
});
```

### 10. All Rate Codes Validation

#### Request
```
POST http://localhost:3000/api/calculate-premium
```

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["HA0"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "108",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": false
}
```

#### Test Script
```javascript
pm.test("Rate Code 108 - Response time under 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});

pm.test("Rate Code 108 - Correct calculation", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.results[0].basePremium).to.eql(77.12);
});
```

## Expected Premium Values (HA0, State A)

| Rate Code | Expected Premium |
|-----------|------------------|
| 0         | 82.35           |
| 100       | 83.99           |
| 101       | 75.62           |
| 102       | 82.15           |
| 103       | 81.32           |
| 104       | 80.48           |
| 105       | 79.64           |
| 106       | 78.80           |
| 107       | 77.96           |
| 108       | 77.12           |
| 109       | 76.29           |
| 110       | 75.45           |
| 111       | 74.61           |
| 112       | 73.77           |

## Notes

1. **Health Categories**: The data shows HealthCategory field (mostly 3) which might affect premium calculations
2. **State Variations**: Each rate code has different premiums for different states
3. **Date Ranges**: All rates are valid from 2023-01-01 to 2099-12-31
4. **LHC Applicable**: Most HA0 products have LHCApplicable = "N"
5. **Rebate Applicable**: All HA0 products have RebateApplicable = "Y"