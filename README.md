# 🐾 Pet Memorial

A heartwarming online memorial platform that allows you to create eternal memorial spaces for your beloved pets.

[![Deploy to GitHub Pages](https://github.com/inernoro/lapoflove/actions/workflows/deploy.yml/badge.svg)](https://github.com/inernoro/lapoflove/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018-brightgreen)](https://nodejs.org/)

## 🌟 Live Demo

**🚀 [Visit Live Demo](https://inernoro.github.io/lapoflove/)**

**👨‍💼 [Admin Panel Demo](https://inernoro.github.io/lapoflove/admin.html)**

> **Demo Credentials:**
> - Username: `admin`
> - Password: `lapoflove2025`

## ✨ Features

- 🐾 **Memorial Creation** - Create personalized memorial pages for your pets
- 📸 **Photo Gallery** - Upload multiple photos to preserve precious memories  
- 📝 **Memorial Stories** - Share heartwarming stories about your pets
- 🕯️ **Memorial Candles** - Allow visitors to light candles and leave messages
- 🔍 **Search Functionality** - Search memorials by pet name or owner name
- 📱 **Responsive Design** - Perfect display on mobile, tablet, and desktop
- 🎨 **Beautiful UI** - Modern gradient design with glassmorphism effects
- 👨‍💼 **Admin Panel** - Comprehensive management system for content and users

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **File Upload**: Multer
- **Data Storage**: JSON files
- **UI Design**: CSS gradients + glassmorphism effects
- **Deployment**: GitHub Pages / Docker / VPS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/inernoro/lapoflove.git
cd lapoflove

# Install dependencies
npm install
```

### Development

#### Option 1: Static Preview Mode (Recommended for Demo)

Perfect for quick previews without backend setup:

```bash
# Start static preview server (auto-opens browser)
npm run dev:static

# Visit http://localhost:3000
```

This mode serves `index-static.html` with mock data, no backend required.

#### Option 2: Full Server Mode

Full-featured version with real data persistence:

```bash
# Start development server (with hot reload)
npm run dev

# Or start production server
npm start

# Visit http://localhost:3000
```

## 📦 Build & Deployment

### Static Build (for GitHub Pages)

```bash
# Build static pages to dist directory
npm run build

# The dist directory can be deployed to any static hosting platform
```

### Server Build (for VPS / Docker)

```bash
# Build complete version to dist directory
npm run build:server

# Deploy to server
cd dist
npm install --production
npm start
```

### GitHub Pages Auto-Deployment

This project includes GitHub Actions that automatically:
1. Build static version
2. Deploy to GitHub Pages  
3. Access via `https://YOUR_USERNAME.github.io/lapoflove/`

**Setup Steps**:
1. Go to repository Settings > Pages
2. Set Source to "GitHub Actions" 
3. Push to master branch to auto-deploy

## 📁 Project Structure

```
lapoflove/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment config
├── public/                     # Static files
│   ├── index.html             # Homepage (server version)
│   ├── index-static.html      # Homepage (static version)
│   ├── create.html            # Create page (server version)
│   ├── create-static.html     # Create page (static version)
│   ├── admin.html             # Admin panel
│   ├── style.css              # Stylesheet
│   ├── demo-images/           # Demo images
│   └── uploads/               # User uploaded images
├── data/                       # Data storage (server version)
│   ├── memorials.json         # Memorial data
│   ├── users.json             # User data
│   └── banned_users.json      # Banned users data
├── dist/                       # Build output directory
├── docker/                     # Docker configuration files
├── server.js                   # Express server
├── pet-images-cdn.js          # CDN image pool
├── build-static.js            # Static build script
├── build-server.js            # Server build script
├── package.json               # Project configuration
└── README.md                  # Project documentation
```

## 🔌 API Reference (Server Version Only)

### Public Endpoints

#### Get All Memorials
```http
GET /api/memorials
```

#### Get Specific Memorial  
```http
GET /api/memorial/:id
```

#### Create Memorial
```http
POST /api/memorial
Content-Type: multipart/form-data

Parameters:
- petName: Pet name (required)
- ownerName: Owner name (required)  
- story: Memorial story (required)
- birthDate: Birth date (optional)
- deathDate: Death date (optional)
- photos: Photo files (optional, multiple supported)
- useRandomImage: Use random CDN image (optional, true/false)
```

#### Light Memorial Candle
```http
POST /api/memorial/:id/candle
Content-Type: application/json

{
  "message": "Memorial message",
  "senderName": "Sender name"
}
```

### Admin Endpoints

Requires `admin-key: lapoflove-admin-2025` header:

```http
GET /api/admin/memorials          # Get all memorials (including deleted)
GET /api/admin/users               # Get all users  
DELETE /api/admin/memorial/:id     # Delete memorial
PUT /api/admin/memorial/:id/restore # Restore memorial
POST /api/admin/ban-user           # Ban user
DELETE /api/admin/ban-user/:id     # Unban user
POST /api/admin/generate-demo-data # Generate demo data
```

**Admin Panel**: `http://localhost:3000/admin`

## 🎨 Design Features

- **Gradient Background**: Purple gradient creating a warm atmosphere
- **Glassmorphism Effects**: Modern visual design with frosted glass aesthetics
- **Smooth Animations**: Fluid fade-in animations and hover effects
- **Responsive Layout**: Adaptable to all device screen sizes
- **Emotional Design**: Focused on memorial and remembrance emotional expression

## 📖 Usage Guide

### For Users

1. **Browse Homepage** - View all memorial pages
2. **Search Memorials** - Search by pet name or owner name
3. **View Details** - Click memorial cards to view complete stories
4. **Light Candles** - Leave messages and light memorial candles for pets
5. **Create Memorial** - Click "Create a memorial" button
   - Fill in pet information
   - Upload photos or use demo images
   - Write memorial story
   - Submit creation

### For Administrators

1. Access admin panel: `/admin`
2. Enter admin key: `lapoflove-admin-2025`
3. Available actions:
   - View all memorials (including deleted ones)
   - Delete/restore memorials
   - Manage users and bans
   - Generate demo data

## ⚙️ Environment Configuration (Optional)

Server version supports configuration via environment variables:

```bash
PORT=3000                          # Server port
ADMIN_KEY=lapoflove-admin-2025    # Admin key
```

## ⚠️ Important Notes

### Static Version
- ✅ No backend required, can be opened directly in browser
- ✅ Uses mock data, resets after page refresh  
- ✅ Perfect for demos and previews
- ❌ Cannot persist real data

### Server Version
- ✅ Supports real data persistence
- ✅ Supports file uploads
- ✅ Supports admin functionality
- ⚠️ Images saved in `public/uploads/` directory
- ⚠️ Data saved in JSON files in `data/` directory
- ⚠️ Automatically creates necessary directories on first run
- ⚠️ Production environments should use databases instead of JSON files

## 🐳 Docker Deployment

The project includes Docker configuration for quick deployment:

```bash
# Using Docker Compose
docker-compose up -d

# Or using standalone Dockerfile
docker build -t pet-memorial .
docker run -p 3000:3000 pet-memorial
```

## 🎯 Roadmap

- [x] Basic memorial wall functionality
- [x] Create memorial pages
- [x] Light candles feature
- [x] Search functionality
- [x] Admin panel
- [x] Static preview version
- [x] GitHub Pages auto-deployment
- [x] CDN image support
- [ ] User registration and login
- [ ] Database support (MySQL/PostgreSQL)
- [ ] Cloud image storage (OSS/S3)
- [ ] Social sharing features
- [ ] Multi-language support
- [ ] Mobile app

## 🛠️ Troubleshooting

### Q: How to quickly preview on Windows?
A: Run `npm run dev:static` and it will automatically open the browser with the static preview version.

### Q: What's the difference between static and server versions?
A: Static version uses mock data without backend, perfect for demos; server version supports real data persistence.

### Q: GitHub Pages deployment failed?
A: 
1. Ensure GitHub Pages is enabled in repository settings
2. Check Settings > Pages, set Source to "GitHub Actions"
3. Review build logs in the Actions tab

### Q: How to change the admin key?
A: Modify `lapoflove-admin-2025` in `server.js` or set `ADMIN_KEY` environment variable.

### Q: Which browsers are supported?
A: All modern browsers (Chrome, Firefox, Safari, Edge). IE is not supported.

## 🤝 Contributing

We welcome Issues and Pull Requests to improve this project!

### Local Development

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/lapoflove.git
cd lapoflove

# Install dependencies
npm install

# Start development server
npm run dev

# Or start static preview
npm run dev:static
```

### Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🙏 Acknowledgments

Thanks to all developers and users who contribute to the Pet Memorial platform.

---

**Remembering every furry friend with love** 🐾