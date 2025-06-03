const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const dataService = require('./dataService');

// Load data into memory
dataService.loadData();

// Debug function to check if a product exists
function checkProduct(productCode, stateCode, rateCode) {
  console.log(`\nChecking for product: ${productCode}, state: ${stateCode}, rate: ${rateCode}`);
  
  // Check in ProductRateMaster
  const masterData = dataService.getProductRateMaster(
    productCode, 
    stateCode, 
    rateCode, 
    '2025-06-01'
  );
  
  if (masterData) {
    console.log('FOUND in ProductRateMaster:', masterData);
  } else {
    console.log('NOT FOUND in ProductRateMaster');
    
    // Check if the product code exists at all
    const allProducts = require('./dataService').dataStore.ProductRateMaster;
    const matchingProducts = allProducts.filter(p => p.ProductCode === productCode);
    
    if (matchingProducts.length > 0) {
      console.log(`Found ${matchingProducts.length} entries with product code ${productCode}`);
      console.log('First matching product:', matchingProducts[0]);
      
      // Check state codes
      const states = [...new Set(matchingProducts.map(p => p.StateCode))];
      console.log(`Available state codes for ${productCode}:`, states);
      
      // Check rate codes
      const rates = [...new Set(matchingProducts.map(p => p.RateCode))];
      console.log(`Available rate codes for ${productCode}:`, rates);
      
      // Check exact match
      const exactMatch = matchingProducts.find(p => 
        p.StateCode === stateCode && 
        parseInt(p.RateCode) === parseInt(rateCode)
      );
      
      if (exactMatch) {
        console.log('Found exact match for product, state, and rate:', exactMatch);
        console.log('Date check:', 
          new Date(exactMatch.DateOn) <= new Date('2024-06-01'),
          new Date(exactMatch.DateOff) > new Date('2024-06-01')
        );
      } else {
        console.log('No exact match found for the combination');
      }
    } else {
      console.log(`No products found with code ${productCode}`);
    }
  }
}

// Check for H0A product
checkProduct('H0A', 'A', '0');

// Check for other products
checkProduct('HA0', 'A', '0');
checkProduct('AML', 'A', '0');
checkProduct('BML', 'A', '0');

// Print all product codes, state codes, and rate codes
console.log('\n\nAll available combinations:');
const allProducts = require('./dataService').dataStore.ProductRateMaster;
const combinations = allProducts.map(p => `${p.ProductCode}-${p.StateCode}-${p.RateCode}`);
console.log([...new Set(combinations)].slice(0, 20), `... and ${combinations.length - 20} more`);

// Export the dataStore for inspection
console.log('\nDataStore loaded:', Object.keys(require('./dataService').dataStore).map(
  key => `${key}: ${require('./dataService').dataStore[key].length} rows`
));