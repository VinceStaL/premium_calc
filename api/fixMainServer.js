const fs = require('fs');
const path = require('path');

// Path to the server.js file
const serverPath = path.join(__dirname, 'server.js');

// Read the server.js file
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Check if dataStore is already exported in dataService.js
const dataServicePath = path.join(__dirname, 'dataService.js');
let dataServiceContent = fs.readFileSync(dataServicePath, 'utf8');

if (!dataServiceContent.includes('dataStore: dataStore')) {
  // Add dataStore export to dataService.js
  dataServiceContent = dataServiceContent.replace(
    'module.exports = {',
    'module.exports = {\n  dataStore,'
  );
  fs.writeFileSync(dataServicePath, dataServiceContent, 'utf8');
  console.log('Updated dataService.js to export dataStore');
}

// Add debug logging to premiumService.js
const premiumServicePath = path.join(__dirname, 'premiumService.js');
let premiumServiceContent = fs.readFileSync(premiumServicePath, 'utf8');

if (!premiumServiceContent.includes('console.log(`Looking for product')) {
  // Add debug logging to calculateSinglePremium function
  premiumServiceContent = premiumServiceContent.replace(
    'const masterData = dataService.getProductRateMaster(',
    'console.log(`Looking for product: ${productCode}, state: ${params.stateCode}, rate: ${params.rateCode}, date: ${params.effectiveDate}`);\n  const masterData = dataService.getProductRateMaster('
  );
  
  // Add more debug logging after the lookup
  premiumServiceContent = premiumServiceContent.replace(
    'if (!masterData) {',
    'if (!masterData) {\n    console.log(`No product found for ${productCode}. Checking all products with this code:`);\n    const matches = dataService.dataStore.ProductRateMaster.filter(row => row.ProductCode === productCode);\n    console.log(`Found ${matches.length} products with code ${productCode}`);\n    if (matches.length > 0) {\n      console.log(`Sample match:`, matches[0]);\n      console.log(`State codes available:`, [...new Set(matches.map(m => m.StateCode))]);\n      console.log(`Rate codes available:`, [...new Set(matches.map(m => m.RateCode))]);\n    }'
  );
  
  fs.writeFileSync(premiumServicePath, premiumServiceContent, 'utf8');
  console.log('Updated premiumService.js with debug logging');
}

console.log('Server files updated with debugging. Please restart the server.');