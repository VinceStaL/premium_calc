const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Paths to the two sets of files
const sampleFilesPath = path.join(__dirname, 'data');
const businessFilesPath = path.join(__dirname, '..', 'data_files');

// Files to compare
const filesToCompare = [
  'ProductRateMaster.xlsx',
  'ProductRateDetail.xlsx',
  'ScaleFactors.xlsx',
  'RiskLoading.xlsx',
  'RebatePercentage.xlsx'
];

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
    return { data, headers: Object.keys(data[0] || {}) };
  } catch (error) {
    return { error: `Error reading file ${filePath}: ${error.message}` };
  }
}

// Compare two datasets
function compareDatasets(sampleData, businessData, fileName) {
  console.log(`\n=== Comparing ${fileName} ===`);
  
  if (sampleData.error) {
    console.log(`Sample file error: ${sampleData.error}`);
    return;
  }
  
  if (businessData.error) {
    console.log(`Business file error: ${businessData.error}`);
    return;
  }
  
  // Compare headers (column names)
  const sampleHeaders = sampleData.headers;
  const businessHeaders = businessData.headers;
  
  console.log(`Sample file columns: ${sampleHeaders.join(', ')}`);
  console.log(`Business file columns: ${businessHeaders.join(', ')}`);
  
  // Find missing columns in each file
  const missingInSample = businessHeaders.filter(h => !sampleHeaders.includes(h));
  const missingInBusiness = sampleHeaders.filter(h => !businessHeaders.includes(h));
  
  if (missingInSample.length > 0) {
    console.log(`Columns in business file but missing in sample: ${missingInSample.join(', ')}`);
  }
  
  if (missingInBusiness.length > 0) {
    console.log(`Columns in sample file but missing in business: ${missingInBusiness.join(', ')}`);
  }
  
  // Compare row counts
  console.log(`Sample file rows: ${sampleData.data.length}`);
  console.log(`Business file rows: ${businessData.data.length}`);
  
  // Check if data structure is compatible with the code
  const requiredColumns = getRequiredColumns(fileName);
  if (requiredColumns.length > 0) {
    const missingRequired = requiredColumns.filter(col => !businessHeaders.includes(col));
    if (missingRequired.length > 0) {
      console.log(`WARNING: Business file is missing required columns: ${missingRequired.join(', ')}`);
    } else {
      console.log(`Business file has all required columns for the application.`);
    }
  }
}

// Get required columns based on file name
function getRequiredColumns(fileName) {
  switch (fileName) {
    case 'ProductRateMaster.xlsx':
      return ['ProductCode', 'StateCode', 'RateCode', 'DateOn', 'DateOff', 'BaseRate', 'LHCApplicable', 'RebateApplicable'];
    case 'ProductRateDetail.xlsx':
      return ['ProductCode', 'StateCode', 'ScaleCode', 'RateCode', 'DateOn', 'DateOff', 'WeeklyRate', 'MonthlyRate', 'QuarterlyRate', 'HalfYearlyRate', 'YearlyRate'];
    case 'ScaleFactors.xlsx':
      return ['ProductCode', 'ScaleCode', 'DateOn', 'DateOff', 'ScaleFactor'];
    case 'RiskLoading.xlsx':
      return ['ProductCode', 'Sex', 'Age', 'DateOn', 'DateOff', 'RiskLoading'];
    case 'RebatePercentage.xlsx':
      return ['RebateType', 'DateOn', 'DateOff', 'Rebate'];
    default:
      return [];
  }
}

// Main comparison function
function compareFiles() {
  console.log('Comparing sample files with business files...');
  
  filesToCompare.forEach(fileName => {
    const sampleFilePath = path.join(sampleFilesPath, fileName);
    const businessFilePath = path.join(businessFilesPath, fileName);
    
    const sampleData = readExcelFile(sampleFilePath);
    const businessData = readExcelFile(businessFilePath);
    
    compareDatasets(sampleData, businessData, fileName);
  });
}

// Run the comparison
compareFiles();