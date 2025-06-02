# Premium Calculator Application

This application calculates health insurance premiums based on various factors such as product type, state, scale code, payment frequency, and more.

API documentation is available via Swagger UI at http://localhost:3000/api-docs when the server is running.

## Project Structure

- **api/**: Backend API built with Node.js and Express
- **frontend/**: Frontend application built with React and TypeScript
- **data_files/**: Business Excel files containing rate data

## Getting Started

### Backend Setup

1. Navigate to the API directory:
   ```
   cd premium_calc/api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

   The API will be available at http://localhost:3000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd premium_calc/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   The frontend will be available at http://localhost:5173

## Data Files

The application uses Excel files for data storage:

1. **ProductRateMaster.xlsx**: Contains base rates and product information
2. **ProductRateDetail.xlsx**: Contains detailed rates for different payment frequencies
3. **ScaleFactors.xlsx**: Contains scaling factors for different coverage types
4. **RiskLoading.xlsx**: Contains risk loading percentages based on age and gender
5. **RebatePercentage.xlsx**: Contains rebate percentages for different types

## Available Product Codes

The application supports the following product codes from the business files:
- H0A
- HA0
- AML
- BML

## Testing

Postman test scripts are available in the `postman_test.md` file for testing the API endpoints.