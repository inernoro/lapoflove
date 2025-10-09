# Pet Memorial Website - Deployment Guide

## 🚀 Quick Start (Recommended)

### 1. Prepare SSL Certificates

Place your SSL certificates in the `key/` directory with these exact names:
```
key/
├── cert.pem    # SSL certificate
└── key.pem     # Private key
```

### 2. Run One-Command Deployment

```bash
chmod +x quick-deploy.sh
./quick-deploy.sh
```

That's it! Your website will be available at `https://pet.xiudoule.com`

## 📋 Detailed Setup

### Prerequisites

- Docker installed and running
- SSL certificates for `pet.xiudoule.com`
- Ports 80 and 443 available
- Domain DNS pointing to your server

### Manual Deployment Steps

1. **Prepare certificates:**
   ```bash
   mkdir -p key
   # Copy your certificates to:
   # key/cert.pem (SSL certificate)
   # key/key.pem (Private key)
   ```

2. **Build and deploy:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### SSL Certificate Setup

#### Option 1: Using Let's Encrypt (Recommended for production)
```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d pet.xiudoule.com

# Copy certificates
sudo cp /etc/letsencrypt/live/pet.xiudoule.com/fullchain.pem key/cert.pem
sudo cp /etc/letsencrypt/live/pet.xiudoule.com/privkey.pem key/key.pem
```

#### Option 2: Using existing certificates
```bash
# Copy your certificates to the key directory
cp /path/to/your/certificate.pem key/cert.pem
cp /path/to/your/private-key.pem key/key.pem
```

#### Option 3: Self-signed (for testing only)
The script will automatically generate self-signed certificates if none are found.

## 🐳 Docker Container Management

### View logs
```bash
docker logs pet-memorial -f
```

### Stop container
```bash
docker stop pet-memorial
```

### Start container
```bash
docker start pet-memorial
```

### Restart container
```bash
docker restart pet-memorial
```

### Remove container
```bash
docker stop pet-memorial
docker rm pet-memorial
```

### Update deployment
```bash
./quick-deploy.sh
```

## 📁 Directory Structure

```
lapoflove/
├── key/                    # SSL certificates
│   ├── cert.pem           # SSL certificate
│   └── key.pem            # Private key
├── docker/                # Docker configuration
│   ├── nginx/
│   │   └── nginx.conf     # Nginx configuration
│   ├── Dockerfile         # Docker image definition
│   └── start.sh           # Container startup script
├── uploads/               # User uploaded files
├── data/                  # Application data
├── public/                # Static website files
├── deploy.sh              # Full deployment script
├── quick-deploy.sh        # Quick deployment script
└── server.js              # Node.js backend
```

## 🔧 Configuration

### Nginx Configuration
- Location: `docker/nginx/nginx.conf`
- Handles HTTPS termination
- Proxies API calls to Node.js backend
- Serves static files
- HTTP to HTTPS redirect

### Docker Configuration
- Location: `docker/Dockerfile`
- Multi-stage build combining Node.js and Nginx
- Location: `docker/start.sh`
- Starts both Node.js backend and Nginx

## 🔍 Troubleshooting

### Container won't start
```bash
# Check logs
docker logs pet-memorial

# Check if ports are in use
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

### SSL issues
```bash
# Verify certificate files
ls -la key/
openssl x509 -in key/cert.pem -text -noout
```

### API not working
```bash
# Check if Node.js backend is running inside container
docker exec pet-memorial ps aux | grep node
```

### Website not accessible
1. Check DNS: `nslookup pet.xiudoule.com`
2. Check firewall: `sudo ufw status`
3. Check container: `docker ps | grep pet-memorial`

## 🔄 Updates

To update the website:

1. Stop the current container:
   ```bash
   docker stop pet-memorial
   docker rm pet-memorial
   ```

2. Pull latest code and rebuild:
   ```bash
   git pull
   ./quick-deploy.sh
   ```

## 🛡️ Security Notes

- Always use real SSL certificates in production
- Keep Docker updated
- Regular backup of `data/` directory
- Monitor logs for suspicious activity
- Use strong passwords for any admin features

## 📞 Support

If you encounter issues:

1. Check the logs: `docker logs pet-memorial -f`
2. Verify all files are in correct locations
3. Ensure Docker has sufficient resources
4. Check network connectivity and DNS resolution