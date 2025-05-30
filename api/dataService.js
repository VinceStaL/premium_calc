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
        
        // Convert numeric strings to numbers
        rows.forEach(row => {
          Object.keys(row).forEach(key => {
            if (!isNaN(row[key]) && row[key] !== '') {
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
  return dataStore.ProductRateMaster.find(row => 
    row.ProductCode === productCode &&
    row.StateCode === stateCode &&
    parseInt(row.RateCode) === parseInt(rateCode) &&
    new Date(row.DateOn) <= new Date(effectiveDate) &&
    new Date(row.DateOff) > new Date(effectiveDate)
  );
}

function getProductRateDetail(productCode, stateCode, scaleCode, rateCode, effectiveDate) {
  return dataStore.ProductRateDetail.find(row => 
    row.ProductCode === productCode &&
    row.StateCode === stateCode &&
    row.ScaleCode === scaleCode &&
    parseInt(row.RateCode) === parseInt(rateCode) &&
    new Date(row.DateOn) <= new Date(effectiveDate) &&
    new Date(row.DateOff) > new Date(effectiveDate)
  );
}

function getScaleFactor(productCode, scaleCode, effectiveDate) {
  const factor = dataStore.ScaleFactors.find(row => 
    row.ProductCode === productCode &&
    row.ScaleCode === scaleCode &&
    new Date(row.DateOn) <= new Date(effectiveDate) &&
    new Date(row.DateOff) > new Date(effectiveDate)
  );
  
  return factor ? factor.ScaleFactor : null;
}

function getRiskLoading(productCode, sex, age, effectiveDate) {
  const loading = dataStore.RiskLoading.find(row => 
    row.ProductCode === productCode &&
    row.Sex === sex &&
    parseInt(row.Age) === parseInt(age) &&
    new Date(row.DateOn) <= new Date(effectiveDate) &&
    new Date(row.DateOff) > new Date(effectiveDate)
  );
  
  return loading ? loading.RiskLoading : null;
}

function getRebatePercentage(rebateType, effectiveDate) {
  if (!rebateType) return null;
  
  const rebate = dataStore.RebatePercentage.find(row => 
    row.RebateType === rebateType &&
    new Date(row.DateOn) <= new Date(effectiveDate) &&
    new Date(row.DateOff) > new Date(effectiveDate)
  );
  
  return rebate ? rebate.Rebate : null;
}

module.exports = {
  loadData,
  getProductRateMaster,
  getProductRateDetail,
  getScaleFactor,
  getRiskLoading,
  getRebatePercentage
};