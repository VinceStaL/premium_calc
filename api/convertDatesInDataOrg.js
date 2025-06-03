const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Function to convert Excel serial date to yyyy-mm-dd format
function excelDateToYYYYMMDD(serial) {
  if (typeof serial !== 'number' || isNaN(serial)) {
    return serial; // Return as-is if not a number
  }
  
  // Excel date calculation (Excel epoch starts at 1900-01-01, but has a leap year bug)
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  
  // Format as yyyy-mm-dd
  const year = date_info.getFullYear();
  const month = String(date_info.getMonth() + 1).padStart(2, '0');
  const day = String(date_info.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Function to identify date columns for each file type
function getDateColumns(fileName) {
  const dateColumnMap = {
    'ProductRateMaster.xlsx': ['DateOn', 'DateOff'],
    'ProductRateDetail.xlsx': ['DateOn', 'DateOff'],
    'ScaleFactors.xlsx': ['DateOn', 'DateOff'],
    'RiskLoading.xlsx': ['DateOn', 'DateOff'],
    'RebatePercentage.xlsx': ['DateOn', 'DateOff']
  };
  
  return dateColumnMap[fileName] || [];
}

// Function to process a single Excel file
function processExcelFile(filePath, fileName) {
  try {
    console.log(`\n📁 Processing ${fileName}...`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return false;
    }
    
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      console.log(`⚠️  No data found in ${fileName}`);
      return false;
    }
    
    // Get date columns for this file type
    const dateColumns = getDateColumns(fileName);
    console.log(`📅 Date columns to convert: ${dateColumns.join(', ')}`);
    
    let conversionsCount = 0;
    let sampleConversions = [];
    
    // Process each row
    data.forEach((row, index) => {
      dateColumns.forEach(column => {
        if (row[column] !== undefined && row[column] !== null) {
          const originalValue = row[column];
          
          // Only convert if it's a number (Excel serial date)
          if (typeof originalValue === 'number' && !isNaN(originalValue)) {
            const convertedDate = excelDateToYYYYMMDD(originalValue);
            row[column] = convertedDate;
            conversionsCount++;
            
            // Store sample conversions for display
            if (sampleConversions.length < 3) {
              sampleConversions.push({
                row: index + 2, // +2 for Excel row number (header + 0-based index)
                column,
                original: originalValue,
                converted: convertedDate
              });
            }
          }
        }
      });
    });
    
    // Show sample conversions
    if (sampleConversions.length > 0) {
      console.log(`📊 Sample conversions:`);
      sampleConversions.forEach(sample => {
        console.log(`   Row ${sample.row}, ${sample.column}: ${sample.original} → ${sample.converted}`);
      });
    }
    
    if (conversionsCount === 0) {
      console.log(`ℹ️  No date conversions needed (dates may already be in string format)`);
      return true;
    }
    
    // Convert back to worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    
    // Create a new workbook with the same sheet name
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
    
    // Create backup of original file
    const backupPath = filePath.replace('.xlsx', '_backup.xlsx');
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`💾 Backup created: ${path.basename(backupPath)}`);
    }
    
    // Write the updated file
    XLSX.writeFile(newWorkbook, filePath);
    
    console.log(`✅ Updated ${fileName} (${conversionsCount} date conversions)`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);
    return false;
  }
}

// Main function to process all files in data_org directory
function convertAllDatesInDataOrg() {
  console.log('🔄 CONVERTING EXCEL DATES TO YYYY-MM-DD FORMAT');
  console.log('===============================================');
  console.log('Target directory: api/data_org/');
  
  const dataOrgPath = path.join(__dirname, 'data_org');
  
  if (!fs.existsSync(dataOrgPath)) {
    console.error(`❌ Directory not found: ${dataOrgPath}`);
    return;
  }
  
  // List of Excel files to process
  const excelFiles = [
    'ProductRateMaster.xlsx',
    'ProductRateDetail.xlsx',
    'ScaleFactors.xlsx',
    'RiskLoading.xlsx',
    'RebatePercentage.xlsx'
  ];
  
  let successCount = 0;
  let totalFiles = excelFiles.length;
  
  // Process each file
  excelFiles.forEach(fileName => {
    const filePath = path.join(dataOrgPath, fileName);
    const success = processExcelFile(filePath, fileName);
    if (success) successCount++;
  });
  
  // Summary
  console.log('\n===============================================');
  console.log('🏁 CONVERSION COMPLETE');
  console.log(`📊 Successfully processed: ${successCount}/${totalFiles} files`);
  
  if (successCount > 0) {
    console.log('\n📝 Notes:');
    console.log('- Original files backed up with "_backup.xlsx" suffix');
    console.log('- Excel serial dates converted to yyyy-mm-dd format');
    console.log('- String dates left unchanged');
    console.log('- You may need to restart your server to load updated data');
  }
}

// Function to verify conversions
function verifyConversions() {
  console.log('\n🔍 VERIFICATION: Checking converted files...');
  
  const dataOrgPath = path.join(__dirname, 'data_org');
  const excelFiles = [
    'ProductRateMaster.xlsx',
    'ProductRateDetail.xlsx',
    'ScaleFactors.xlsx',
    'RiskLoading.xlsx',
    'RebatePercentage.xlsx'
  ];
  
  excelFiles.forEach(fileName => {
    const filePath = path.join(dataOrgPath, fileName);
    
    if (fs.existsSync(filePath)) {
      try {
        const workbook = XLSX.readFile(filePath);
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        
        if (data.length > 0) {
          const firstRow = data[0];
          const dateColumns = getDateColumns(fileName);
          
          console.log(`\n📄 ${fileName}:`);
          dateColumns.forEach(col => {
            if (firstRow[col] !== undefined) {
              console.log(`   ${col}: ${firstRow[col]} (${typeof firstRow[col]})`);
            }
          });
        }
      } catch (error) {
        console.log(`❌ Error reading ${fileName}: ${error.message}`);
      }
    }
  });
}

// Run the conversion
if (require.main === module) {
  convertAllDatesInDataOrg();
  verifyConversions();
}

module.exports = { 
  convertAllDatesInDataOrg, 
  excelDateToYYYYMMDD, 
  processExcelFile,
  verifyConversions 
};
