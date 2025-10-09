#!/bin/sh

# Start Node.js backend in background
echo "Starting Node.js backend..."
cd /app
node server.js &

# Wait for backend to start
sleep 5

# Start nginx in foreground
echo "Starting Nginx..."
nginx -g 'daemon off;'