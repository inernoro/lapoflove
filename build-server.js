const fs = require('fs');
const path = require('path');

console.log('Building server version...');

// 创建 dist 目录
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 复制服务器文件
const filesToCopy = [
  'server.js',
  'pet-images-cdn.js',
  'package.json',
  'package-lock.json'
];

filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${file}`);
  }
});

// 复制 public 目录
const publicDir = path.join(__dirname, 'public');
const destPublicDir = path.join(distDir, 'public');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(publicDir, destPublicDir);
console.log('✓ Copied public directory');

// 复制 data 目录
const dataDir = path.join(__dirname, 'data');
const destDataDir = path.join(distDir, 'data');

if (fs.existsSync(dataDir)) {
  copyDir(dataDir, destDataDir);
  console.log('✓ Copied data directory');
} else {
  fs.mkdirSync(destDataDir, { recursive: true });
  fs.writeFileSync(path.join(destDataDir, 'memorials.json'), '[]');
  console.log('✓ Created empty data directory');
}

console.log('\n✅ Server build completed successfully!');
console.log('📁 Output directory: dist/');
console.log('🚀 Ready to deploy with Node.js');


