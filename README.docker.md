# Docker Setup for Premium Calculator

This document explains how to run the Premium Calculator application (both frontend and backend) using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Configuration

You can configure the application using environment variables:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file to customize:
   - `API_PORT`: The port to expose the API on the host (default: 3000)
   - `FRONTEND_PORT`: The port to expose the frontend on the host (default: 80)
   - `API_URL`: The URL for the frontend to connect to the backend (default: http://api:3000)

## Running with Docker Compose

The easiest way to run both the frontend and backend is using Docker Compose:

```bash
# Build and start the containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the containers
docker-compose down
```

The application will be available at:
- Frontend: http://localhost (or the port specified in FRONTEND_PORT)
- API: http://localhost:3000 (or the port specified in API_PORT)
- API documentation: http://localhost:3000/api-docs (or the port specified in API_PORT)

## Running Individual Services

If you prefer to run services separately:

### Backend API

```bash
# Build the Docker image
docker build -t premium-calc-api ./api

# Run the container
docker run -p 3000:3000 -d \
  -v $(pwd)/api/data:/usr/src/app/data \
  -v $(pwd)/data_files:/usr/src/app/data_files \
  --name premium-calc-api \
  premium-calc-api
```

### Frontend

```bash
# Build the Docker image
docker build -t premium-calc-frontend ./frontend

# Run the container
docker run -p 80:80 -d \
  -e API_URL=http://localhost:3000 \
  --name premium-calc-frontend \
  premium-calc-frontend
```

## Development Workflow

For development, you can:

1. Run the backend in Docker and the frontend locally:
   ```bash
   # Start just the API
   docker-compose up api -d
   
   # Run frontend locally
   cd frontend
   npm install
   VITE_API_URL=http://localhost:3000 npm run dev
   ```

2. Or run both in Docker with mounted source code for live reloading (requires additional configuration)

## Troubleshooting

If you encounter issues:

1. Check container logs: `docker-compose logs` or `docker logs <container-name>`
2. Verify the environment variables are set correctly
3. Ensure ports are not already in use on your host machine