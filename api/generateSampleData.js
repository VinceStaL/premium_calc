const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create sample data objects with business product codes
const productRateMasterData = [
  { ProductCode: 'H0A', StateCode: 'A', RateCode: 0, BaseRate: 286.80, LHCApplicable: 'Y', RebateApplicable: 'Y', DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'H0A', StateCode: 'N', RateCode: 0, BaseRate: 290.00, LHCApplicable: 'Y', RebateApplicable: 'Y', DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'HA0', StateCode: 'A', RateCode: 0, BaseRate: 82.35, LHCApplicable: 'N', RebateApplicable: 'Y', DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'HA0', StateCode: 'N', RateCode: 0, BaseRate: 85.00, LHCApplicable: 'N', RebateApplicable: 'Y', DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'AML', StateCode: 'A', RateCode: 0, BaseRate: 6.50, LHCApplicable: 'N', RebateApplicable: 'Y', DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'BML', StateCode: 'A', RateCode: 0, BaseRate: 6.50, LHCApplicable: 'N', RebateApplicable: 'Y', DateOn: '2023-01-01', DateOff: '2099-12-31' }
];

const scaleFactorsData = [
  { ProductCode: 'H0A', ScaleCode: 'S', ScaleFactor: 1.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'H0A', ScaleCode: 'D', ScaleFactor: 2.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'H0A', ScaleCode: 'F', ScaleFactor: 2.5, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'HA0', ScaleCode: 'S', ScaleFactor: 1.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'HA0', ScaleCode: 'D', ScaleFactor: 2.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'HA0', ScaleCode: 'F', ScaleFactor: 2.5, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'AML', ScaleCode: 'S', ScaleFactor: 1.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'AML', ScaleCode: 'D', ScaleFactor: 2.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'BML', ScaleCode: 'S', ScaleFactor: 1.0, DateOn: '2023-01-01', DateOff: '2099-12-31' }
];

const rebatePercentageData = [
  { RebateType: 'RB', Rebate: 10.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { RebateType: 'RF', Rebate: 20.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { RebateType: 'RI', Rebate: 30.0, DateOn: '2023-01-01', DateOff: '2099-12-31' }
];

const riskLoadingData = [
  { ProductCode: 'H0A', Sex: 'M', Age: 30, RiskLoading: 0.05, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'H0A', Sex: 'F', Age: 30, RiskLoading: 0.03, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'HA0', Sex: 'M', Age: 30, RiskLoading: 0.05, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'HA0', Sex: 'F', Age: 30, RiskLoading: 0.03, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'AML', Sex: 'M', Age: 30, RiskLoading: 0.05, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'BML', Sex: 'F', Age: 30, RiskLoading: 0.03, DateOn: '2023-01-01', DateOff: '2099-12-31' }
];

const productRateDetailData = [
  { ProductCode: 'H0A', StateCode: 'A', ScaleCode: 'S', RateCode: 0, WeeklyRate: 71.70, MonthlyRate: 286.80, QuarterlyRate: 860.40, HalfYearlyRate: 1720.80, YearlyRate: 3441.60, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'H0A', StateCode: 'A', ScaleCode: 'D', RateCode: 0, WeeklyRate: 143.40, MonthlyRate: 573.60, QuarterlyRate: 1720.80, HalfYearlyRate: 3441.60, YearlyRate: 6883.20, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'HA0', StateCode: 'A', ScaleCode: 'S', RateCode: 0, WeeklyRate: 20.59, MonthlyRate: 82.35, QuarterlyRate: 247.05, HalfYearlyRate: 494.10, YearlyRate: 988.20, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'HA0', StateCode: 'A', ScaleCode: 'D', RateCode: 0, WeeklyRate: 41.18, MonthlyRate: 164.70, QuarterlyRate: 494.10, HalfYearlyRate: 988.20, YearlyRate: 1976.40, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'AML', StateCode: 'A', ScaleCode: 'S', RateCode: 0, WeeklyRate: 1.63, MonthlyRate: 6.50, QuarterlyRate: 19.50, HalfYearlyRate: 39.00, YearlyRate: 78.00, DateOn: '2023-01-01', DateOff: '2099-12-31' },
  { ProductCode: 'BML', StateCode: 'A', ScaleCode: 'S', RateCode: 0, WeeklyRate: 1.63, MonthlyRate: 6.50, QuarterlyRate: 19.50, HalfYearlyRate: 39.00, YearlyRate: 78.00, DateOn: '2023-01-01', DateOff: '2099-12-31' }
];

// Function to create and save XLSX file
function createXlsxFile(data, fileName) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, path.join(dataDir, fileName));
  console.log(`Created ${fileName}`);
}

// Write files
createXlsxFile(productRateMasterData, 'ProductRateMaster.xlsx');
createXlsxFile(scaleFactorsData, 'ScaleFactors.xlsx');
createXlsxFile(rebatePercentageData, 'RebatePercentage.xlsx');
createXlsxFile(riskLoadingData, 'RiskLoading.xlsx');
createXlsxFile(productRateDetailData, 'ProductRateDetail.xlsx');

console.log('Sample data generated successfully. Please restart the server to load the new data.');