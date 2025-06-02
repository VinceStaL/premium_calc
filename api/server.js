const express = require('express');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const dataService = require('./dataService');
const premiumService = require('./premiumService');

// Create Express app
const app = express();
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Load XLSX data on startup
dataService.loadData();

/**
 * @swagger
 * /api/calculate-premium:
 *   post:
 *     summary: Calculate insurance premium
 *     description: Calculates insurance premium based on provided parameters
 *     tags: [Premium]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PremiumParams'
 *     responses:
 *       200:
 *         description: Premium calculation successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PremiumResult'
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/generate-sample-data:
 *   get:
 *     summary: Generate sample data
 *     description: Generates sample Excel files with test data for premium calculation
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: Sample data generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sample data generated successfully
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/generate-sample-data', (req, res) => {
  try {
    const XLSX = require('xlsx');
    
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

/**
 * @swagger
 * /api/debug-product/{productCode}:
 *   get:
 *     summary: Debug product lookup
 *     description: Checks if a product exists in the data store
 *     tags: [Debug]
 *     parameters:
 *       - in: path
 *         name: productCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Product code to look up
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: State code (defaults to A)
 *       - in: query
 *         name: rate
 *         schema:
 *           type: string
 *         description: Rate code (defaults to 0)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Effective date (defaults to 2025-06-01)
 *     responses:
 *       200:
 *         description: Product lookup result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/debug-product/:productCode', (req, res) => {
  try {
    const { productCode } = req.params;
    const stateCode = req.query.state || 'A';
    const rateCode = req.query.rate || '0';
    const effectiveDate = req.query.date || '2025-06-01';
    
    // Try to find the product
    const product = dataService.getProductRateMaster(
      productCode, 
      stateCode, 
      rateCode, 
      effectiveDate
    );
    
    if (product) {
      res.json({
        success: true,
        message: 'Product found',
        product
      });
    } else {
      // Check if the product exists at all
      const allProducts = dataService.dataStore.ProductRateMaster;
      const matchingProducts = allProducts.filter(p => p.ProductCode === productCode);
      
      res.json({
        success: false,
        message: 'Product not found',
        searchParams: { productCode, stateCode, rateCode, effectiveDate },
        matchCount: matchingProducts.length,
        sampleMatches: matchingProducts.slice(0, 3)
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation:`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`1. Generate sample data: GET http://localhost:${PORT}/api/generate-sample-data`);
  console.log(`2. Calculate premium: POST http://localhost:${PORT}/api/calculate-premium`);
  console.log(`3. Debug product lookup: GET http://localhost:${PORT}/api/debug-product/H0A`);
});

// Example request body for calculate-premium:
/*
{
  "effectiveDate": "2025-06-01",
  "productCodes": ["H0A", "HA0"],
  "stateCode": "A",
  "scaleCode": "S",
  "rateCode": "0",
  "paymentFrequency": "monthly",
  "rebateType": "RB",
  "lhcPercentage": 0,
  "useBaseRate": true,
  "useRiskRating": false
}
*/