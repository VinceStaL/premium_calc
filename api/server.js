const express = require('express');
const path = require('path');
const fs = require('fs');
const dataService = require('./dataService');
const premiumService = require('./premiumService');

// Create Express app
const app = express();
app.use(express.json());

// Load CSV data on startup
dataService.loadData();

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

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
    // Generate sample ProductRateMaster.csv
    const productRateMaster = [
      'ProductCode,StateCode,RateCode,BaseRate,LHCApplicable,RebateApplicable,DateOn,DateOff',
      'BASIC,N,0,100.00,Y,Y,2023-01-01,2099-12-31',
      'BASIC,V,0,95.00,Y,Y,2023-01-01,2099-12-31',
      'STANDARD,N,0,150.00,Y,Y,2023-01-01,2099-12-31',
      'STANDARD,V,0,145.00,Y,Y,2023-01-01,2099-12-31',
      'PREMIUM,N,0,200.00,Y,Y,2023-01-01,2099-12-31',
      'PREMIUM,V,0,195.00,Y,Y,2023-01-01,2099-12-31'
    ].join('\\n');
    
    // Generate sample ScaleFactors.csv
    const scaleFactors = [
      'ProductCode,ScaleCode,ScaleFactor,DateOn,DateOff',
      'BASIC,S,1.0,2023-01-01,2099-12-31',
      'BASIC,D,2.0,2023-01-01,2099-12-31',
      'BASIC,F,2.5,2023-01-01,2099-12-31',
      'STANDARD,S,1.0,2023-01-01,2099-12-31',
      'STANDARD,D,2.0,2023-01-01,2099-12-31',
      'STANDARD,F,2.5,2023-01-01,2099-12-31',
      'PREMIUM,S,1.0,2023-01-01,2099-12-31',
      'PREMIUM,D,2.0,2023-01-01,2099-12-31',
      'PREMIUM,F,2.5,2023-01-01,2099-12-31'
    ].join('\\n');
    
    // Generate sample RebatePercentage.csv
    const rebatePercentage = [
      'RebateType,Rebate,DateOn,DateOff',
      'TIER1,10.0,2023-01-01,2099-12-31',
      'TIER2,20.0,2023-01-01,2099-12-31',
      'TIER3,30.0,2023-01-01,2099-12-31'
    ].join('\\n');
    
    // Generate sample RiskLoading.csv
    const riskLoading = [
      'ProductCode,Sex,Age,RiskLoading,DateOn,DateOff',
      'BASIC,M,30,0.05,2023-01-01,2099-12-31',
      'BASIC,F,30,0.03,2023-01-01,2099-12-31',
      'STANDARD,M,30,0.05,2023-01-01,2099-12-31',
      'STANDARD,F,30,0.03,2023-01-01,2099-12-31',
      'PREMIUM,M,30,0.05,2023-01-01,2099-12-31',
      'PREMIUM,F,30,0.03,2023-01-01,2099-12-31'
    ].join('\\n');
    
    // Generate sample ProductRateDetail.csv
    const productRateDetail = [
      'ProductCode,StateCode,ScaleCode,RateCode,WeeklyRate,MonthlyRate,QuarterlyRate,HalfYearlyRate,YearlyRate,DateOn,DateOff',
      'BASIC,N,S,0,25.00,100.00,300.00,600.00,1200.00,2023-01-01,2099-12-31',
      'BASIC,N,D,0,50.00,200.00,600.00,1200.00,2400.00,2023-01-01,2099-12-31',
      'STANDARD,N,S,0,37.50,150.00,450.00,900.00,1800.00,2023-01-01,2099-12-31',
      'STANDARD,N,D,0,75.00,300.00,900.00,1800.00,3600.00,2023-01-01,2099-12-31',
      'PREMIUM,N,S,0,50.00,200.00,600.00,1200.00,2400.00,2023-01-01,2099-12-31',
      'PREMIUM,N,D,0,100.00,400.00,1200.00,2400.00,4800.00,2023-01-01,2099-12-31'
    ].join('\\n');
    
    // Write files
    fs.writeFileSync(path.join(dataDir, 'ProductRateMaster.csv'), productRateMaster);
    fs.writeFileSync(path.join(dataDir, 'ScaleFactors.csv'), scaleFactors);
    fs.writeFileSync(path.join(dataDir, 'RebatePercentage.csv'), rebatePercentage);
    fs.writeFileSync(path.join(dataDir, 'RiskLoading.csv'), riskLoading);
    fs.writeFileSync(path.join(dataDir, 'ProductRateDetail.csv'), productRateDetail);
    
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