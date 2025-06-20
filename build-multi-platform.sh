#!/bin/bash
set -e

# Define image names and tags
API_IMAGE="vinl/premium-calc-api"
FRONTEND_IMAGE="vinl/premium-calc-frontend"
TAG="v0.6.1"

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

# Build API image (without pushing)
echo "Building multi-platform API image..."
cd api
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t ${API_IMAGE}:${TAG} \
  --load \
  .

# Build Frontend image (without pushing)
echo "Building multi-platform Frontend image..."
cd ../frontend
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t ${FRONTEND_IMAGE}:${TAG} \
  --load \
  .

echo "Multi-platform build completed successfully!"