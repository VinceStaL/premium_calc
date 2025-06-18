#!/bin/bash
set -e

# Define image names and tags
API_IMAGE="premium-calc-api"
FRONTEND_IMAGE="premium-calc-frontend"
TAG="0.4"

# Check if Docker BuildKit is enabled
if [ -z "${DOCKER_BUILDKIT}" ]; then
  export DOCKER_BUILDKIT=1
fi

# Create builder instance if it doesn't exist
if ! docker buildx inspect multiplatform-builder &>/dev/null; then
  echo "Creating new buildx builder instance..."
  docker buildx create --name multiplatform-builder --driver docker-container --bootstrap
fi

# Use the builder
docker buildx use multiplatform-builder

# Build and push API image
echo "Building multi-platform API image..."
cd api
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t ${API_IMAGE}:${TAG} \
  --push \
  .

# Build and push Frontend image
echo "Building multi-platform Frontend image..."
cd ../frontend
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t ${FRONTEND_IMAGE}:${TAG} \
  --push \
  .

echo "Multi-platform build completed successfully!"