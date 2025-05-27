const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// In-memory data store for CSV data
const dataStore = {
  ProductRateMaster: [],
  ProductRateDetail: [],
  ScaleFactors: [],
  RiskLoading: [],
  RebatePercentage: []
};

// Load all CSV files into memory
function loadData() {
  const tables = Object.keys(dataStore);
  
  tables.forEach(table => {
    const filePath = path.join(__dirname, 'data', `${table}.csv`);
    
    if (fs.existsSync(filePath)) {
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // Convert numeric strings to numbers
          Object.keys(row).forEach(key => {
            if (!isNaN(row[key]) && row[key] !== '') {
              row[key] = parseFloat(row[key]);
            }
          });
          rows.push(row);
        })
        .on('end', () => {
          dataStore[table] = rows;
          console.log(`Loaded ${rows.length} rows from ${table}.csv`);
        });
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