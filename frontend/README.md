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

The frontend is configured to connect to the backend API at `/api`. Make sure your backend server is running on port 3000 or update the proxy configuration in `vite.config.ts` if needed.