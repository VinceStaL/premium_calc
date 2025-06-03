const express = require('express');
const dataService = require('./dataService');

// Create Express app
const app = express();
app.use(express.json());

// Load XLSX data on startup
dataService.loadData();

// Simple test endpoint
app.get('/test', (req, res) => {
  // Test if we can find H0A product
  const product = dataService.getProductRateMaster('H0A', 'A', '0', '2023-12-01');
  
  if (product) {
    res.json({
      success: true,
      message: 'Product found',
      product
    });
  } else {
    res.json({
      success: false,
      message: 'Product not found',
      availableProducts: dataService.dataStore.ProductRateMaster
        .filter(p => p.ProductCode === 'H0A')
        .slice(0, 5)
    });
  }
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/test`);
});