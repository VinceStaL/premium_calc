# Postman Test Scripts for Premium Calculation API

This document contains Postman test scripts for testing the Premium Calculation API endpoints.

## 1. Generate Sample Data

### Request
```
GET http://localhost:3000/api/generate-sample-data
```

### Test Script
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response contains success message", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.message).to.eql("Sample data generated successfully");
});

// Set a variable to indicate data has been generated
pm.environment.set("dataGenerated", true);
```

## 2. Basic Premium Calculation

### Request
```
POST http://localhost:3000/api/calculate-premium
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["H0A"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "0",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": false
}
```

### Test Script
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response contains results array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("results");
    pm.expect(jsonData.results).to.be.an("array");
    pm.expect(jsonData.results.length).to.be.at.least(1);
});

pm.test("Response contains total premium", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("totalPremium");
    pm.expect(jsonData.totalPremium).to.be.a("number");
});

pm.test("H0A product premium calculation is correct", function () {
    var jsonData = pm.response.json();
    var product = jsonData.results.find(item => item.productCode === "H0A");
    
    pm.expect(product).to.not.be.undefined;
    pm.expect(product.basePremium).to.be.a("number");
    pm.expect(product.finalPremium).to.be.a("number");
});
```

## 3. Multiple Products Premium Calculation

### Request
```
POST http://localhost:3000/api/calculate-premium
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["H0A", "HA0"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "0",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": false
}
```

### Test Script
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response contains results for both products", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.results.length).to.eql(2);
    
    var productCodes = jsonData.results.map(item => item.productCode);
    pm.expect(productCodes).to.include("H0A");
    pm.expect(productCodes).to.include("HA0");
});

pm.test("Total premium is sum of individual premiums", function () {
    var jsonData = pm.response.json();
    var sumOfPremiums = jsonData.results.reduce((sum, item) => sum + item.finalPremium, 0);
    
    // Account for potential floating point precision issues
    pm.expect(Math.abs(jsonData.totalPremium - sumOfPremiums)).to.be.below(0.01);
});
```

## 4. Premium Calculation with Rebate

### Request
```
POST http://localhost:3000/api/calculate-premium
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["H0A"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "0",
  "paymentFrequency": "monthly",
  "rebateType": "RB",
  "useBaseRate": true,
  "useRiskRating": false
}
```

### Test Script
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Rebate is applied correctly", function () {
    var jsonData = pm.response.json();
    var product = jsonData.results.find(item => item.productCode === "H0A");
    
    pm.expect(product).to.have.property("rebateAmount");
    pm.expect(product.rebateAmount).to.be.a("number");
    
    // Check that rebate amount is applied
    pm.expect(product.rebateAmount).to.be.at.least(0);
    
    // Final premium should be premiumBeforeRebate minus rebateAmount
    var expectedFinalPremium = product.premiumBeforeRebate - product.rebateAmount;
    pm.expect(Math.abs(product.finalPremium - expectedFinalPremium)).to.be.below(0.01);
});
```

## 5. Premium Calculation with Risk Rating

### Request
```
POST http://localhost:3000/api/calculate-premium
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["H0A"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "0",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": true,
  "sex1": "M",
  "age1": 30
}
```

### Test Script
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Risk loading is applied correctly", function () {
    var jsonData = pm.response.json();
    var product = jsonData.results.find(item => item.productCode === "H0A");
    
    pm.expect(product).to.have.property("riskLoadingAmount1");
    
    if (product.riskLoading1 !== null) {
        pm.expect(product.riskLoadingAmount1).to.be.a("number");
        
        // Check that risk loading amount is calculated correctly
        var expectedRiskLoading = product.scaleAndFrequencyPremium * product.riskLoading1;
        pm.expect(Math.abs(product.riskLoadingAmount1 - expectedRiskLoading)).to.be.below(0.01);
    }
});
```

## 6. Error Handling - Missing Required Parameters

### Request
```
POST http://localhost:3000/api/calculate-premium
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "effectiveDate": "2025-06-01",
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "0",
  "paymentFrequency": "monthly"
}
```

### Test Script
```javascript
pm.test("Status code is 400 for missing required parameters", function () {
    pm.response.to.have.status(400);
});

pm.test("Error message indicates missing product codes", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("error");
    pm.expect(jsonData.error).to.include("Product Code");
});
```

## 7. Error Handling - Invalid Risk Rating Parameters

### Request
```
POST http://localhost:3000/api/calculate-premium
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["H0A"],
  "stateCode": "A",
  "scaleCode": "D",
  "rateCode": "0",
  "paymentFrequency": "monthly",
  "useBaseRate": true,
  "useRiskRating": true,
  "sex1": "M",
  "age1": 30
  // Missing sex2 and age2 for couple coverage
}
```

### Test Script
```javascript
pm.test("Status code is 400 for missing risk rating parameters", function () {
    pm.response.to.have.status(400);
});

pm.test("Error message indicates missing second person details", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("error");
    pm.expect(jsonData.error).to.include("Person 2");
});
```