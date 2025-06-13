# Premium Calculator Frontend

A simple React frontend for the Premium Calculator application.

## Features

- Calculate insurance premiums based on various parameters
- Support for product codes (H0A, HA0, AML, BML), states, and payment frequencies
- Risk rating calculations
- LHC and rebate adjustments
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Docker (optional, for containerized deployment)

### Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

### Building for Production

To create a production build:

```
npm run build
```

The build output will be in the `dist` directory.

## API Connection

The frontend is configured to connect to the backend API at `/api`. You can configure the API URL in two ways:

1. **For local development**: Set the `VITE_API_URL` environment variable or create a `.env` file:
   ```
   VITE_API_URL=http://localhost:3000
   ```

2. **For production build**: Update the proxy configuration in `vite.config.ts` if needed.

## Docker Deployment

### Building the Docker Image

```bash
# From the frontend directory
docker build -t premium-calc-frontend:latest .
```

### Running the Container

```bash
# Basic usage
docker run -p 80:80 -e API_URL=http://localhost:3000 premium-calc-frontend:latest

# With a different host port
docker run -p 8080:80 -e API_URL=http://localhost:3000 premium-calc-frontend:latest
```

### Environment Variables

- `API_URL`: The URL of the backend API (used by Nginx at runtime)
  - Example: `http://localhost:3000` or `http://api:3000` (when using Docker Compose)

### Accessing the Application

After starting the container, access the frontend at:
- http://localhost (if using port 80)
- http://localhost:8080 (if using a different port)

## Docker Compose

When using Docker Compose with both frontend and backend services:

```yaml
# Example docker-compose.yml snippet
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - API_URL=http://api:3000
    depends_on:
      - api
```

This configuration allows the frontend container to communicate with the backend API container using the service name `api`.