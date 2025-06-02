const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Path to the business files
const businessFilesPath = path.join(__dirname, '..', 'data_files');

// Function to read Excel file and return data as JSON
function readExcelFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { error: `File does not exist: ${filePath}` };
    }
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    return { data };
  } catch (error) {
    return { error: `Error reading file ${filePath}: ${error.message}` };
  }
}

// Check product codes in ProductRateMaster
const productRateMasterPath = path.join(businessFilesPath, 'ProductRateMaster.xlsx');
const result = readExcelFile(productRateMasterPath);

if (result.error) {
  console.log(result.error);
} else {
  // Extract unique product codes
  const productCodes = [...new Set(result.data.map(row => row.ProductCode))];
  console.log('Available Product Codes in ProductRateMaster.xlsx:');
  console.log(productCodes);
  
  // Check if BASIC exists
  if (productCodes.includes('BASIC')) {
    console.log('\nProduct code "BASIC" exists in the file.');
  } else {
    console.log('\nProduct code "BASIC" does NOT exist in the file.');
    console.log('This explains the error: "No base rate found for product code BASIC"');
  }
  
  // Check for specific parameters that might be causing the issue
  console.log('\nChecking for specific parameters in the first few rows:');
  const sampleRows = result.data.slice(0, 3);
  console.log(JSON.stringify(sampleRows, null, 2));
}

// Also check the sample files to see what product codes were there
const sampleFilesPath = path.join(__dirname, 'data');
const sampleProductRateMasterPath = path.join(sampleFilesPath, 'ProductRateMaster.xlsx');
const sampleResult = readExcelFile(sampleProductRateMasterPath);

if (sampleResult.error) {
  console.log(sampleResult.error);
} else {
  const sampleProductCodes = [...new Set(sampleResult.data.map(row => row.ProductCode))];
  console.log('\nProduct Codes in the original sample files:');
  console.log(sampleProductCodes);
}