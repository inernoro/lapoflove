#!/bin/bash

# Pet Memorial Website Deployment Script
# This script builds and deploys the pet memorial website with HTTPS support

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="pet.xiudoule.com"
CONTAINER_NAME="pet-memorial"
IMAGE_NAME="pet-memorial:latest"
HTTP_PORT=80
HTTPS_PORT=443

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."

    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info >/dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi

    print_success "Prerequisites check passed"
}

# Check SSL certificates
check_ssl_certificates() {
    print_status "Checking SSL certificates..."

    if [ ! -f "key/cert.pem" ] || [ ! -f "key/key.pem" ]; then
        print_warning "SSL certificates not found in key/ directory"
        print_warning "Expected files: key/cert.pem and key/key.pem"
        print_warning "Creating self-signed certificates for testing..."

        # Create key directory if it doesn't exist
        mkdir -p key

        # Generate self-signed certificate
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout key/key.pem \
            -out key/cert.pem \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=$DOMAIN"

        print_warning "Self-signed certificate created. Replace with real certificate for production."
    else
        print_success "SSL certificates found"
    fi
}

# Stop and remove existing container
cleanup_existing() {
    print_status "Cleaning up existing deployment..."

    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        print_status "Stopping existing container..."
        docker stop $CONTAINER_NAME >/dev/null 2>&1 || true
    fi

    if docker ps -aq -f name=$CONTAINER_NAME | grep -q .; then
        print_status "Removing existing container..."
        docker rm $CONTAINER_NAME >/dev/null 2>&1 || true
    fi

    # Remove old image
    if docker images -q $IMAGE_NAME | grep -q .; then
        print_status "Removing old image..."
        docker rmi $IMAGE_NAME >/dev/null 2>&1 || true
    fi

    print_success "Cleanup completed"
}

# Build Docker image
build_image() {
    print_status "Building Docker image..."

    docker build -f docker/Dockerfile -t $IMAGE_NAME . || {
        print_error "Failed to build Docker image"
        exit 1
    }

    print_success "Docker image built successfully"
}

# Deploy container
deploy_container() {
    print_status "Deploying container..."

    # Create uploads directory with proper permissions
    mkdir -p uploads
    chmod 755 uploads

    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p $HTTP_PORT:80 \
        -p $HTTPS_PORT:443 \
        -v "$(pwd)/key/cert.pem:/etc/nginx/ssl/cert.pem:ro" \
        -v "$(pwd)/key/key.pem:/etc/nginx/ssl/key.pem:ro" \
        -v "$(pwd)/uploads:/usr/share/nginx/html/uploads" \
        -v "$(pwd)/data:/app/data" \
        $IMAGE_NAME || {
        print_error "Failed to deploy container"
        exit 1
    }

    print_success "Container deployed successfully"
}

# Check container health
check_health() {
    print_status "Checking container health..."

    sleep 5

    if ! docker ps | grep -q $CONTAINER_NAME; then
        print_error "Container is not running"
        print_error "Container logs:"
        docker logs $CONTAINER_NAME
        exit 1
    fi

    # Test HTTP redirect
    if command_exists curl; then
        print_status "Testing HTTP to HTTPS redirect..."
        if curl -s -I "http://localhost:$HTTP_PORT" | grep -q "301\|302"; then
            print_success "HTTP to HTTPS redirect working"
        else
            print_warning "HTTP redirect may not be working properly"
        fi
    fi

    print_success "Container is running healthy"
}

# Display deployment info
show_deployment_info() {
    print_success "=== Deployment Completed Successfully ==="
    echo ""
    echo "🌐 Website URLs:"
    echo "   HTTP:  http://$DOMAIN (redirects to HTTPS)"
    echo "   HTTPS: https://$DOMAIN"
    echo ""
    echo "🐳 Docker Container:"
    echo "   Name: $CONTAINER_NAME"
    echo "   Image: $IMAGE_NAME"
    echo "   Status: $(docker inspect -f '{{.State.Status}}' $CONTAINER_NAME)"
    echo ""
    echo "📁 Mounted Volumes:"
    echo "   SSL Certificates: key/ → /etc/nginx/ssl/"
    echo "   Uploads: uploads/ → /usr/share/nginx/html/uploads"
    echo "   Data: data/ → /app/data"
    echo ""
    echo "🔧 Management Commands:"
    echo "   View logs: docker logs $CONTAINER_NAME -f"
    echo "   Stop: docker stop $CONTAINER_NAME"
    echo "   Start: docker start $CONTAINER_NAME"
    echo "   Remove: docker rm -f $CONTAINER_NAME"
    echo ""
    echo "📝 Notes:"
    echo "   • Make sure DNS points $DOMAIN to this server"
    echo "   • Replace self-signed certificates with real ones for production"
    echo "   • Firewall should allow ports 80 and 443"
    echo ""
}

# Main deployment function
main() {
    echo ""
    print_status "🐾 Pet Memorial Website Deployment"
    print_status "===================================="
    echo ""

    check_prerequisites
    check_ssl_certificates
    cleanup_existing
    build_image
    deploy_container
    check_health
    show_deployment_info
}

# Handle script interruption
trap 'print_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"