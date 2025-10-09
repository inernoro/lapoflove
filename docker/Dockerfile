# Build stage for Node.js backend
FROM node:18-alpine AS backend

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY server.js ./
COPY data/ ./data/

# Frontend build stage
FROM nginx:alpine AS frontend

# Copy static files
COPY public/ /usr/share/nginx/html/

# Copy custom nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Create directories for SSL certificates
RUN mkdir -p /etc/nginx/ssl

# Create data directory for uploads
RUN mkdir -p /usr/share/nginx/html/uploads

# Set permissions
RUN chmod -R 755 /usr/share/nginx/html

# Final stage combining both
FROM node:18-alpine

# Install nginx
RUN apk add --no-cache nginx

# Copy backend files
WORKDIR /app
COPY --from=backend /app ./

# Copy frontend files
COPY --from=frontend /usr/share/nginx/html /usr/share/nginx/html
COPY --from=frontend /etc/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Create directories
RUN mkdir -p /etc/nginx/ssl
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/run
RUN mkdir -p /usr/share/nginx/html/uploads

# Expose ports
EXPOSE 80 443

# Start both services
CMD ["/start.sh"]