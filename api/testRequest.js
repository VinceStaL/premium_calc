const http = require('http');

// Create the request data
const requestData = JSON.stringify({
  effectiveDate: '2024-06-01',
  productCodes: ['H0A'],
  stateCode: 'A',
  scaleCode: 'S',
  rateCode: '0',
  paymentFrequency: 'monthly',
  useBaseRate: true,
  useRiskRating: false
});

// Set up the request options
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/calculate-premium',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestData)
  }
};

// Send the request
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('RESPONSE BODY:');
    try {
      const parsedData = JSON.parse(responseData);
      console.log(JSON.stringify(parsedData, null, 2));
    } catch (e) {
      console.log(responseData);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write the request data
req.write(requestData);
req.end();

console.log('Request sent:');
console.log(requestData);