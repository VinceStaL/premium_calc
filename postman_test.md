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
  "effectiveDate": "2023-06-01",
  "productCodes": ["BASIC"],
  "stateCode": "N",
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

pm.test("Basic product premium calculation is correct", function () {
    var jsonData = pm.response.json();
    var basicProduct = jsonData.results.find(item => item.productCode === "BASIC");
    
    pm.expect(basicProduct).to.not.be.undefined;
    pm.expect(basicProduct.basePremium).to.be.a("number");
    pm.expect(basicProduct.finalPremium).to.be.a("number");
    
    // For single coverage with monthly payment, the final premium should match the monthly rate
    pm.expect(basicProduct.finalPremium).to.eql(100.00);
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
  "effectiveDate": "2023-06-01",
  "productCodes": ["BASIC", "STANDARD"],
  "stateCode": "N",
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
    pm.expect(productCodes).to.include("BASIC");
    pm.expect(productCodes).to.include("STANDARD");
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
  "effectiveDate": "2023-06-01",
  "productCodes": ["BASIC"],
  "stateCode": "N",
  "scaleCode": "S",
  "rateCode": "0",
  "paymentFrequency": "monthly",
  "rebateType": "TIER1",
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
    var basicProduct = jsonData.results.find(item => item.productCode === "BASIC");
    
    pm.expect(basicProduct).to.have.property("rebateAmount");
    pm.expect(basicProduct.rebateAmount).to.be.a("number");
    
    // TIER1 rebate is 10%, so rebate amount should be 10% of the base premium
    var expectedRebate = basicProduct.basePremium * 0.1;
    pm.expect(Math.abs(basicProduct.rebateAmount - expectedRebate)).to.be.below(0.01);
    
    // Final premium should be base premium minus rebate
    var expectedFinalPremium = basicProduct.basePremium - expectedRebate;
    pm.expect(Math.abs(basicProduct.finalPremium - expectedFinalPremium)).to.be.below(0.01);
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
  "effectiveDate": "2023-06-01",
  "productCodes": ["BASIC"],
  "stateCode": "N",
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
    var basicProduct = jsonData.results.find(item => item.productCode === "BASIC");
    
    pm.expect(basicProduct).to.have.property("riskLoadingAmount");
    pm.expect(basicProduct.riskLoadingAmount).to.be.a("number");
    
    // For a 30-year-old male, risk loading is 5% of base premium
    var expectedRiskLoading = basicProduct.basePremium * 0.05;
    pm.expect(Math.abs(basicProduct.riskLoadingAmount - expectedRiskLoading)).to.be.below(0.01);
    
    // Final premium should include risk loading
    var expectedFinalPremium = basicProduct.basePremium + expectedRiskLoading;
    pm.expect(Math.abs(basicProduct.finalPremium - expectedFinalPremium)).to.be.below(0.01);
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
  "effectiveDate": "2023-06-01",
  "stateCode": "N",
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
  "effectiveDate": "2023-06-01",
  "productCodes": ["BASIC"],
  "stateCode": "N",
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