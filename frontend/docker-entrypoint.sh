#!/bin/sh

# Check if API_URL is set
if [ -z "$API_URL" ]; then
  echo "Warning: API_URL environment variable is not set. Using default http://localhost:3000"
  API_URL="http://localhost:3000"
fi

# Replace API_URL placeholder in nginx config
sed -i "s|API_URL_PLACEHOLDER|$API_URL|g" /etc/nginx/conf.d/default.conf

# Start nginx
exec "$@"