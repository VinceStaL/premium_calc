const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const dataService = require('./dataService');

// Load data
dataService.loadData();

// Test product lookup
const productCode = 'H0A';
const stateCode = 'A';
const rateCode = 0;
const effectiveDate = '2023-12-01';

console.log(`Looking for product: ${productCode}, state: ${stateCode}, rate: ${rateCode}, date: ${effectiveDate}`);

// Direct lookup in the data store
const matches = dataService.dataStore.ProductRateMaster.filter(row => 
  row.ProductCode === productCode &&
  row.StateCode === stateCode &&
  parseInt(row.RateCode) === parseInt(rateCode)
);

console.log(`Found ${matches.length} direct matches by code, state, and rate`);
if (matches.length > 0) {
  console.log('First match:', JSON.stringify(matches[0], null, 2));
  
  // Check date comparison
  const effectiveDateTime = new Date(effectiveDate);
  matches.forEach((match, index) => {
    const dateOn = new Date(match.DateOn);
    const dateOff = new Date(match.DateOff);
    
    console.log(`\nMatch ${index + 1} date check:`);
    console.log(`DateOn: ${match.DateOn} (${dateOn})`);
    console.log(`DateOff: ${match.DateOff} (${dateOff})`);
    console.log(`Effective Date: ${effectiveDate} (${effectiveDateTime})`);
    console.log(`DateOn <= EffectiveDate: ${dateOn <= effectiveDateTime}`);
    console.log(`DateOff > EffectiveDate: ${dateOff > effectiveDateTime}`);
    console.log(`Date check passes: ${dateOn <= effectiveDateTime && dateOff > effectiveDateTime}`);
  });
}

// Try using the service function
const result = dataService.getProductRateMaster(productCode, stateCode, rateCode, effectiveDate);
console.log('\nUsing dataService.getProductRateMaster:');
if (result) {
  console.log('FOUND in ProductRateMaster:', result);
} else {
  console.log('NOT FOUND in ProductRateMaster');
}

// Check all products
console.log('\nAll products in ProductRateMaster:');
const allProducts = [...new Set(dataService.dataStore.ProductRateMaster.map(p => p.ProductCode))];
console.log(allProducts);

// Check all state codes for H0A
console.log('\nAll state codes for H0A:');
const h0aStates = [...new Set(dataService.dataStore.ProductRateMaster
  .filter(p => p.ProductCode === 'H0A')
  .map(p => p.StateCode))];
console.log(h0aStates);

// Check all rate codes for H0A and state A
console.log('\nAll rate codes for H0A and state A:');
const h0aRates = [...new Set(dataService.dataStore.ProductRateMaster
  .filter(p => p.ProductCode === 'H0A' && p.StateCode === 'A')
  .map(p => p.RateCode))];
console.log(h0aRates);