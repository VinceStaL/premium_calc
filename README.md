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

## Docker Deployment

### Using Docker Compose (Recommended)

To run both the frontend and backend with a single command:

1. From the project root directory:
   ```
   docker-compose up -d
   ```

2. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api-docs

### Multi-Platform Docker Builds

The application supports multi-platform Docker builds for different CPU architectures:

1. Make the build script executable:
   ```
   chmod +x build-multi-platform.sh
   ```

2. Run the build script to create multi-platform images:
   ```
   ./build-multi-platform.sh
   ```

3. This will build and push images for the following platforms:
   - linux/amd64 (Intel/AMD 64-bit)
   - linux/arm64 (ARM 64-bit)
   - linux/arm/v7 (ARM 32-bit)

### Running Individual Containers

#### Backend Container

```bash
# Build the image
cd premium_calc/api
docker build -t premium-calc-api .

# Run the container
docker run -p 3000:3000 -d \
  -v $(pwd)/data:/usr/src/app/data \
  -v $(pwd)/../data_files:/usr/src/app/data_files \
  --name premium-calc-api \
  premium-calc-api
```

#### Frontend Container

```bash
# Build the image
cd premium_calc/frontend
docker build -t premium-calc-frontend .

# Run the container (macOS/Windows)
docker run -p 80:80 -d \
  -e API_URL=http://host.docker.internal:3000 \
  --name premium-calc-frontend \
  premium-calc-frontend

# Run the container (Linux)
docker run -p 80:80 -d \
  -e API_URL=http://YOUR_HOST_IP:3000 \
  --name premium-calc-frontend \
  premium-calc-frontend
```

### Important Docker Notes

- On macOS/Windows, use `host.docker.internal` to connect to services on your host machine
- On Linux, use your host machine's actual IP address
- Make sure the port in API_URL matches the port your backend is running on
- See individual README files in api/ and frontend/ directories for more detailed Docker instructions

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

## Documentation

- **README.md**: This file, provides an overview and setup instructions
- **architecture_document.md**: Detailed architecture documentation
- **api/README.docker.md**: Docker-specific instructions for the backend
- **frontend/README.docker.md**: Docker-specific instructions for the frontend