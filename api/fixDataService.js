const fs = require('fs');
const path = require('path');

// Path to the dataService.js file
const filePath = path.join(__dirname, 'dataService.js');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Add debug logging to the getProductRateMaster function
content = content.replace(
  'function getProductRateMaster(productCode, stateCode, rateCode, effectiveDate) {',
  `function getProductRateMaster(productCode, stateCode, rateCode, effectiveDate) {
  console.log('DEBUG - getProductRateMaster called with:');
  console.log('  productCode:', productCode);
  console.log('  stateCode:', stateCode);
  console.log('  rateCode:', rateCode);
  console.log('  effectiveDate:', effectiveDate);
  console.log('  effectiveDate as Date object:', new Date(effectiveDate));
`
);

// Add more debug logging for the result
content = content.replace(
  'return result;',
  `if (result) {
    console.log('DEBUG - Found matching product:', JSON.stringify(result, null, 2));
  } else {
    console.log('DEBUG - No matching product found');
  }
  return result;`
);

// Write the modified content back to the file
fs.writeFileSync(filePath, content);

console.log('Added debug logging to dataService.js');