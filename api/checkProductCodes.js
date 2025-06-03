const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Read the ProductRateMaster file
const filePath = path.join(__dirname, 'data', 'ProductRateMaster.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// Extract unique product codes
const productCodes = [...new Set(data.map(row => row.ProductCode))];

console.log('\nAvailable Product Codes in ProductRateMaster.xlsx:\n');
console.log(productCodes);

// Check if specific product code exists
const searchCode = 'H0A';
if (productCodes.includes(searchCode)) {
  console.log(`\nProduct code "${searchCode}" exists in the file.`);
} else {
  console.log(`\nProduct code "${searchCode}" does NOT exist in the file.`);
  console.log(`This explains the error: "No base rate found for product code ${searchCode}"`);
}

// Show some sample rows
console.log('\nChecking for specific parameters in the first few rows:');
console.log(JSON.stringify(data.slice(0, 3), null, 2));

// Check state codes
const stateCodes = [...new Set(data.map(row => row.StateCode))];
console.log('\nState codes available:', stateCodes);

// Check rate codes
const rateCodes = [...new Set(data.map(row => row.RateCode))];
console.log('Rate codes available:', rateCodes);