const fs = require('fs');
const path = require('path');

// Path to the premiumService.js file
const filePath = path.join(__dirname, 'premiumService.js');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Add debug logging to the calculateSinglePremium function
content = content.replace(
  'function calculateSinglePremium(productCode, params) {',
  `function calculateSinglePremium(productCode, params) {
  // Debug logging
  console.log('DEBUG - calculateSinglePremium called with:');
  console.log('  productCode:', productCode);
  console.log('  params:', JSON.stringify(params, null, 2));
`
);

// Add more debug logging before the error is thrown
content = content.replace(
  'throw new Error(`No base rate found for product code ${productCode}`);',
  `console.log('DEBUG - About to throw error: No base rate found for product code ' + productCode);
    console.log('DEBUG - All available products with this code:', JSON.stringify(matches, null, 2));
    throw new Error(\`No base rate found for product code \${productCode}\`);`
);

// Write the modified content back to the file
fs.writeFileSync(filePath, content);

console.log('Added debug logging to premiumService.js');