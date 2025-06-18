FROM --platform=$BUILDPLATFORM node:18-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Create data directory if it doesn't exist
RUN mkdir -p data

# Final image
FROM --platform=$TARGETPLATFORM node:18-alpine

WORKDIR /usr/src/app

# Copy from builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/*.js ./
COPY --from=builder /usr/src/app/data ./data
COPY --from=builder /usr/src/app/swagger.js ./swagger.js

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]