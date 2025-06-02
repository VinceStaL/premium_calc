const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Function to convert Excel date to JS Date
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
}

// Function to convert JS Date to Excel date
function jsDateToExcelDate(date) {
  return 25569 + ((date.getTime() - date.getTimezoneOffset() * 60 * 1000) / (1000 * 60 * 60 * 24));
}

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
    
    // Update dates
    data.forEach(row => {
      if (row.DateOn !== undefined) {
        // Convert Excel date to JS Date
        const dateOn = excelDateToJSDate(row.DateOn);
        
        // Set DateOn to 2023-01-01
        const newDateOn = new Date(2023, 0, 1); // January 1, 2023
        row.DateOn = jsDateToExcelDate(newDateOn);
      }
      
      if (row.DateOff !== undefined) {
        // Convert Excel date to JS Date
        const dateOff = excelDateToJSDate(row.DateOff);
        
        // Set DateOff to 2099-12-31
        const newDateOff = new Date(2099, 11, 31); // December 31, 2099
        row.DateOff = jsDateToExcelDate(newDateOff);
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