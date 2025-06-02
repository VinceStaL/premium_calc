const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Files to process
const filesToProcess = [
  'ProductRateMaster.xlsx',
  'ProductRateDetail.xlsx',
  'ScaleFactors.xlsx',
  'RiskLoading.xlsx',
  'RebatePercentage.xlsx'
];

// Process each file
filesToProcess.forEach(fileName => {
  const filePath = path.join(__dirname, 'data', fileName);
  
  try {
    console.log(`Processing ${fileName}...`);
    
    // Read the file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Update dates to human-readable format
    data.forEach(row => {
      if (row.DateOn !== undefined) {
        row.DateOn = '2023-01-01';
      }
      
      if (row.DateOff !== undefined) {
        row.DateOff = '2099-12-31';
      }
    });
    
    // Convert back to worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    
    // Create a new workbook
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
    
    // Write the file
    XLSX.writeFile(newWorkbook, filePath);
    
    console.log(`Updated ${fileName}`);
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
  }
});

console.log('All files processed. Please restart the server to load the updated data.');