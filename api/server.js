const express = require('express');
const path = require('path');
const fs = require('fs');
const dataService = require('./dataService');
const premiumService = require('./premiumService');

// Create Express app
const app = express();
app.use(express.json());

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Load XLSX data on startup
dataService.loadData();

// API endpoint for premium calculation
app.post('/api/calculate-premium', async (req, res) => {
  try {
    const params = req.body;
    
    // Validate required parameters
    if (!params.effectiveDate) return res.status(400).json({ error: 'Effective Date is required' });
    if (!params.productCodes || !params.productCodes.some(code => code)) {
      return res.status(400).json({ error: 'At least one Product Code is required' });
    }
    if (!params.stateCode) return res.status(400).json({ error: 'State Code is required' });
    if (!params.scaleCode) return res.status(400).json({ error: 'Scale Code is required' });
    if (!params.rateCode) return res.status(400).json({ error: 'Rate Code is required' });
    if (!params.paymentFrequency) return res.status(400).json({ error: 'Payment Frequency is required' });
    
    // Additional validation for risk rating
    if (params.useRiskRating) {
      if (!params.sex1) return res.status(400).json({ error: 'Sex (Person 1) is required' });
      if (params.age1 === undefined) return res.status(400).json({ error: 'Age (Person 1) is required' });
      
      const needsSecondPerson = ['D', 'F', 'Q'].includes(params.scaleCode);
      if (needsSecondPerson) {
        if (!params.sex2) return res.status(400).json({ error: 'Sex (Person 2) is required' });
        if (params.age2 === undefined) return res.status(400).json({ error: 'Age (Person 2) is required' });
      }
    }
    
    // Calculate premium
    const results = await premiumService.calculatePremium(params);
    
    // Calculate total premium
    const totalPremium = results.reduce((sum, result) => sum + result.finalPremium, 0);
    
    // Return results
    res.json({
      results,
      totalPremium: Number(totalPremium.toFixed(2))
    });
  } catch (error) {
    console.error('Error calculating premium:', error);
    res.status(500).json({ error: error.message });
  }
});

// Sample data generation endpoint
app.get('/api/generate-sample-data', (req, res) => {
  try {
    const XLSX = require('xlsx');
    
    // Create sample data objects
    const productRateMasterData = [
      { ProductCode: 'BASIC', StateCode: 'N', RateCode: 0, BaseRate: 100.00, LHCApplicable: 'Y', RebateApplicable: 'Y', DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'BASIC', StateCode: 'V', RateCode: 0, BaseRate: 95.00, LHCApplicable: 'Y', RebateApplicable: 'Y', DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'STANDARD', StateCode: 'N', RateCode: 0, BaseRate: 150.00, LHCApplicable: 'Y', RebateApplicable: 'Y', DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'STANDARD', StateCode: 'V', RateCode: 0, BaseRate: 145.00, LHCApplicable: 'Y', RebateApplicable: 'Y', DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'PREMIUM', StateCode: 'N', RateCode: 0, BaseRate: 200.00, LHCApplicable: 'Y', RebateApplicable: 'Y', DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'PREMIUM', StateCode: 'V', RateCode: 0, BaseRate: 195.00, LHCApplicable: 'Y', RebateApplicable: 'Y', DateOn: '2023-01-01', DateOff: '2099-12-31' }
    ];
    
    const scaleFactorsData = [
      { ProductCode: 'BASIC', ScaleCode: 'S', ScaleFactor: 1.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'BASIC', ScaleCode: 'D', ScaleFactor: 2.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'BASIC', ScaleCode: 'F', ScaleFactor: 2.5, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'STANDARD', ScaleCode: 'S', ScaleFactor: 1.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'STANDARD', ScaleCode: 'D', ScaleFactor: 2.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'STANDARD', ScaleCode: 'F', ScaleFactor: 2.5, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'PREMIUM', ScaleCode: 'S', ScaleFactor: 1.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'PREMIUM', ScaleCode: 'D', ScaleFactor: 2.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'PREMIUM', ScaleCode: 'F', ScaleFactor: 2.5, DateOn: '2023-01-01', DateOff: '2099-12-31' }
    ];
    
    const rebatePercentageData = [
      { RebateType: 'TIER1', Rebate: 10.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { RebateType: 'TIER2', Rebate: 20.0, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { RebateType: 'TIER3', Rebate: 30.0, DateOn: '2023-01-01', DateOff: '2099-12-31' }
    ];
    
    const riskLoadingData = [
      { ProductCode: 'BASIC', Sex: 'M', Age: 30, RiskLoading: 0.05, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'BASIC', Sex: 'F', Age: 30, RiskLoading: 0.03, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'STANDARD', Sex: 'M', Age: 30, RiskLoading: 0.05, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'STANDARD', Sex: 'F', Age: 30, RiskLoading: 0.03, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'PREMIUM', Sex: 'M', Age: 30, RiskLoading: 0.05, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'PREMIUM', Sex: 'F', Age: 30, RiskLoading: 0.03, DateOn: '2023-01-01', DateOff: '2099-12-31' }
    ];
    
    const productRateDetailData = [
      { ProductCode: 'BASIC', StateCode: 'N', ScaleCode: 'S', RateCode: 0, WeeklyRate: 25.00, MonthlyRate: 100.00, QuarterlyRate: 300.00, HalfYearlyRate: 600.00, YearlyRate: 1200.00, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'BASIC', StateCode: 'N', ScaleCode: 'D', RateCode: 0, WeeklyRate: 50.00, MonthlyRate: 200.00, QuarterlyRate: 600.00, HalfYearlyRate: 1200.00, YearlyRate: 2400.00, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'STANDARD', StateCode: 'N', ScaleCode: 'S', RateCode: 0, WeeklyRate: 37.50, MonthlyRate: 150.00, QuarterlyRate: 450.00, HalfYearlyRate: 900.00, YearlyRate: 1800.00, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'STANDARD', StateCode: 'N', ScaleCode: 'D', RateCode: 0, WeeklyRate: 75.00, MonthlyRate: 300.00, QuarterlyRate: 900.00, HalfYearlyRate: 1800.00, YearlyRate: 3600.00, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'PREMIUM', StateCode: 'N', ScaleCode: 'S', RateCode: 0, WeeklyRate: 50.00, MonthlyRate: 200.00, QuarterlyRate: 600.00, HalfYearlyRate: 1200.00, YearlyRate: 2400.00, DateOn: '2023-01-01', DateOff: '2099-12-31' },
      { ProductCode: 'PREMIUM', StateCode: 'N', ScaleCode: 'D', RateCode: 0, WeeklyRate: 100.00, MonthlyRate: 400.00, QuarterlyRate: 1200.00, HalfYearlyRate: 2400.00, YearlyRate: 4800.00, DateOn: '2023-01-01', DateOff: '2099-12-31' }
    ];
    
    // Function to create and save XLSX file
    function createXlsxFile(data, fileName) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, path.join(dataDir, fileName));
    }
    
    // Write files
    createXlsxFile(productRateMasterData, 'ProductRateMaster.xlsx');
    createXlsxFile(scaleFactorsData, 'ScaleFactors.xlsx');
    createXlsxFile(rebatePercentageData, 'RebatePercentage.xlsx');
    createXlsxFile(riskLoadingData, 'RiskLoading.xlsx');
    createXlsxFile(productRateDetailData, 'ProductRateDetail.xlsx');
    
    // Reload data
    dataService.loadData();
    
    res.json({ message: 'Sample data generated successfully' });
  } catch (error) {
    console.error('Error generating sample data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation:`);
  console.log(`1. Generate sample data: GET http://localhost:${PORT}/api/generate-sample-data`);
  console.log(`2. Calculate premium: POST http://localhost:${PORT}/api/calculate-premium`);
});

// Example request body for calculate-premium:
/*
{
  "effectiveDate": "2023-06-01",
  "productCodes": ["BASIC", "STANDARD"],
  "stateCode": "N",
  "scaleCode": "S",
  "rateCode": "0",
  "paymentFrequency": "monthly",
  "rebateType": "TIER1",
  "lhcPercentage": 0,
  "useBaseRate": true,
  "useRiskRating": false
}
*/