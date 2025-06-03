const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Function to analyze date format differences
function analyzeDateFormats() {
  const currentFilePath = path.join(__dirname, 'data', 'ProductRateMaster.xlsx');
  const originalFilePath = path.join(__dirname, 'data_org', 'ProductRateMaster.xlsx');
  
  // Read both files
  const currentWorkbook = XLSX.readFile(currentFilePath);
  const originalWorkbook = XLSX.readFile(originalFilePath);
  
  const currentData = XLSX.utils.sheet_to_json(currentWorkbook.Sheets[currentWorkbook.SheetNames[0]]);
  const originalData = XLSX.utils.sheet_to_json(originalWorkbook.Sheets[originalWorkbook.SheetNames[0]]);
  
  console.log('📅 DATE FORMAT ANALYSIS');
  console.log('======================');
  
  // Sample a few records to show the date format differences
  console.log('\nSample date format differences:');
  console.log('Row | ProductCode | Current DateOn | Original DateOn | Current DateOff | Original DateOff');
  console.log('----|-------------|----------------|-----------------|-----------------|------------------');
  
  for (let i = 0; i < Math.min(10, currentData.length); i++) {
    const current = currentData[i];
    const original = originalData[i];
    
    if (current.DateOn !== original.DateOn || current.DateOff !== original.DateOff) {
      console.log(`${i+2}   | ${current.ProductCode || 'N/A'} | ${current.DateOn} | ${original.DateOn} | ${current.DateOff} | ${original.DateOff}`);
    }
  }
  
  // Convert Excel serial dates to readable format
  console.log('\n📊 EXCEL SERIAL DATE CONVERSION:');
  console.log('Original file uses Excel serial dates:');
  console.log('- 45748 = ' + excelDateToJSDate(45748).toISOString().split('T')[0]);
  console.log('- 73050 = ' + excelDateToJSDate(73050).toISOString().split('T')[0]);
  
  console.log('\nCurrent file uses ISO date strings:');
  console.log('- "2023-01-01" = 2023-01-01');
  console.log('- "2099-12-31" = 2099-12-31');
  
  // Count different date patterns
  const currentDatePatterns = new Set();
  const originalDatePatterns = new Set();
  
  currentData.forEach(record => {
    if (record.DateOn) currentDatePatterns.add(typeof record.DateOn + ': ' + record.DateOn);
    if (record.DateOff) currentDatePatterns.add(typeof record.DateOff + ': ' + record.DateOff);
  });
  
  originalData.forEach(record => {
    if (record.DateOn) originalDatePatterns.add(typeof record.DateOn + ': ' + record.DateOn);
    if (record.DateOff) originalDatePatterns.add(typeof record.DateOff + ': ' + record.DateOff);
  });
  
  console.log('\n🔍 UNIQUE DATE PATTERNS:');
  console.log('\nCurrent file patterns:');
  Array.from(currentDatePatterns).slice(0, 10).forEach(pattern => console.log('  ' + pattern));
  
  console.log('\nOriginal file patterns:');
  Array.from(originalDatePatterns).slice(0, 10).forEach(pattern => console.log('  ' + pattern));
}

// Function to convert Excel serial date to JavaScript Date
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info;
}

// Run the analysis
analyzeDateFormats();
