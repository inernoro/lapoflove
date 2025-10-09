#!/bin/bash

# Quick Deploy Script for Pet Memorial Website
echo "🐾 Starting Pet Memorial Website Deployment..."

# Configuration
CONTAINER_NAME="pet-memorial"
IMAGE_NAME="pet-memorial:latest"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}[1/6]${NC} Checking SSL certificates..."
if [ ! -f "key/cert.pem" ] || [ ! -f "key/key.pem" ]; then
    echo "Creating self-signed certificate..."
    mkdir -p key
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout key/key.pem \
        -out key/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Pet Memorial/CN=pet.xiudoule.com"
fi

echo -e "${BLUE}[2/6]${NC} Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo -e "${BLUE}[3/6]${NC} Building Docker image..."
docker build -f docker/Dockerfile -t $IMAGE_NAME .

echo -e "${BLUE}[4/6]${NC} Creating directories..."
mkdir -p uploads data

echo -e "${BLUE}[5/6]${NC} Starting container..."
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p 80:80 \
    -p 443:443 \
    -v "$(pwd)/key/cert.pem:/etc/nginx/ssl/cert.pem:ro" \
    -v "$(pwd)/key/key.pem:/etc/nginx/ssl/key.pem:ro" \
    -v "$(pwd)/uploads:/usr/share/nginx/html/uploads" \
    -v "$(pwd)/data:/app/data" \
    $IMAGE_NAME

echo -e "${BLUE}[6/6]${NC} Checking status..."
sleep 3

if docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo "🌐 Access your website at:"
    echo "   https://pet.xiudoule.com"
    echo ""
    echo "📊 Container status:"
    docker ps | grep $CONTAINER_NAME
    echo ""
    echo "📝 View logs: docker logs $CONTAINER_NAME -f"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Container logs:"
    docker logs $CONTAINER_NAME
    exit 1
fi