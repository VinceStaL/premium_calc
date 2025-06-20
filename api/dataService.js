const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// In-memory data store for XLSX data
const dataStore = {
  ProductRateMaster: [],
  ProductRateDetail: [],
  ScaleFactors: [],
  RiskLoading: [],
  RebatePercentage: []
};

// Convert Excel serial date to JavaScript Date
function excelSerialToDate(serial) {
  if (typeof serial !== 'number') return null;
  const excelEpoch = new Date(1899, 11, 30);
  return new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
}

// Load all XLSX files into memory
function loadData() {
  const tables = Object.keys(dataStore);
  
  tables.forEach(table => {
    const filePath = path.join(__dirname, 'data', `${table}.xlsx`);
    
    if (fs.existsSync(filePath)) {
      try {
        // Read the XLSX file
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const rows = XLSX.utils.sheet_to_json(worksheet);
        
        // Convert numeric strings to numbers and handle date fields
        rows.forEach(row => {
          Object.keys(row).forEach(key => {
            // Handle date fields (DateOn, DateOff)
            if ((key === 'DateOn' || key === 'DateOff') && typeof row[key] === 'number') {
              row[key] = excelSerialToDate(row[key]);
            }
            // Convert other numeric strings to numbers
            else if (!isNaN(row[key]) && row[key] !== '' && typeof row[key] === 'string') {
              row[key] = parseFloat(row[key]);
            }
          });
        });
        
        dataStore[table] = rows;
        console.log(`Loaded ${rows.length} rows from ${table}.xlsx`);
      } catch (error) {
        console.error(`Error loading ${table}.xlsx:`, error);
      }
    } else {
      console.warn(`Warning: ${filePath} does not exist`);
    }
  });
}

// Query functions to replace database queries
function getProductRateMaster(productCode, stateCode, rateCode, effectiveDate) {
  console.log(`Looking for ProductRateMaster: ${productCode}, ${stateCode}, ${rateCode}, ${effectiveDate}`);
  
  const matches = dataStore.ProductRateMaster.filter(row => 
    row.ProductCode === productCode &&
    row.StateCode === stateCode &&
    parseInt(row.RateCode) === parseInt(rateCode) &&
    row.DateOn <= new Date(effectiveDate) &&
    row.DateOff > new Date(effectiveDate)
  );
  
  if (matches.length === 0) {
    console.log('No matching product found. Checking all products with this code:');
    const allMatches = dataStore.ProductRateMaster.filter(row => row.ProductCode === productCode);
    console.log(`Found ${allMatches.length} products with code ${productCode}`);
    if (allMatches.length > 0) {
      console.log('First match:', allMatches[0]);
    }
    return null;
  }
  
  if (matches.length > 1) {
    console.log(`Warning: Found ${matches.length} matching entries for ${productCode}, ${stateCode}, ${rateCode}`);
    console.log('Matches:', matches.map(m => ({ BaseRate: m.BaseRate, DateOn: m.DateOn, DateOff: m.DateOff })));
    // For now, return the first match, but this needs business rule clarification
    console.log('Using first match with BaseRate:', matches[0].BaseRate);
  }
  
  return matches[0];
}

function getProductRateDetail(productCode, stateCode, scaleCode, rateCode, effectiveDate) {
  const matches = dataStore.ProductRateDetail.filter(row => 
    row.ProductCode === productCode &&
    row.StateCode === stateCode &&
    row.ScaleCode === scaleCode &&
    parseInt(row.RateCode) === parseInt(rateCode) &&
    row.DateOn <= new Date(effectiveDate) &&
    row.DateOff > new Date(effectiveDate)
  );
  
  if (matches.length > 1) {
    console.log(`Warning: Found ${matches.length} matching ProductRateDetail entries`);
  }
  
  return matches[0] || null;
}

function getScaleFactor(productCode, scaleCode, effectiveDate) {
  const matches = dataStore.ScaleFactors.filter(row => 
    row.ProductCode === productCode &&
    row.ScaleCode === scaleCode &&
    row.DateOn <= new Date(effectiveDate) &&
    row.DateOff > new Date(effectiveDate)
  );
  
  if (matches.length > 1) {
    console.log(`Warning: Found ${matches.length} matching ScaleFactor entries`);
  }
  
  return matches.length > 0 ? matches[0].ScaleFactor : null;
}

function getRiskLoading(productCode, sex, age, effectiveDate) {
  const matches = dataStore.RiskLoading.filter(row => 
    row.ProductCode === productCode &&
    row.Sex === sex &&
    parseInt(row.Age) === parseInt(age) &&
    row.DateOn <= new Date(effectiveDate) &&
    row.DateOff > new Date(effectiveDate)
  );
  
  if (matches.length > 1) {
    console.log(`Warning: Found ${matches.length} matching RiskLoading entries`);
  }
  
  return matches.length > 0 ? matches[0].RiskLoading : null;
}

function getRebatePercentage(rebateType, effectiveDate) {
  if (!rebateType) return null;
  
  const matches = dataStore.RebatePercentage.filter(row => 
    row.RebateType === rebateType &&
    row.DateOn <= new Date(effectiveDate) &&
    row.DateOff > new Date(effectiveDate)
  );
  
  if (matches.length > 1) {
    console.log(`Warning: Found ${matches.length} matching RebatePercentage entries`);
  }
  
  return matches.length > 0 ? matches[0].Rebate : null;
}

module.exports = {
  dataStore,
  loadData,
  getProductRateMaster,
  getProductRateDetail,
  getScaleFactor,
  getRiskLoading,
  getRebatePercentage,
  dataStore // Export dataStore for debugging
};