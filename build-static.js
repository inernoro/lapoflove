const fs = require('fs');
const path = require('path');

console.log('Building static version for GitHub Pages...');

// 创建 dist 目录（先清空）
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  // 清空 dist 目录
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('✓ Cleaned dist directory');
}
fs.mkdirSync(distDir, { recursive: true });
console.log('✓ Created dist directory');

// 复制静态文件
const filesToCopy = [
  { src: 'public/index-static.html', dest: 'dist/index.html' },
  { src: 'public/create-static.html', dest: 'dist/create.html' },
  { src: 'public/admin.html', dest: 'dist/admin.html' },
  { src: 'public/style.css', dest: 'dist/style.css' },
  { src: 'public/admin.css', dest: 'dist/admin.css' }
];

filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, file.src);
  const destPath = path.join(__dirname, file.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${file.src} to ${file.dest}`);
  } else {
    console.log(`✗ Source file not found: ${file.src}`);
  }
});

// 复制 demo-images 目录
const demoImagesDir = path.join(__dirname, 'public/demo-images');
const destDemoImagesDir = path.join(__dirname, 'dist/demo-images');

if (fs.existsSync(demoImagesDir)) {
  if (!fs.existsSync(destDemoImagesDir)) {
    fs.mkdirSync(destDemoImagesDir, { recursive: true });
  }
  
  const images = fs.readdirSync(demoImagesDir);
  images.forEach(image => {
    const srcPath = path.join(demoImagesDir, image);
    const destPath = path.join(destDemoImagesDir, image);
    fs.copyFileSync(srcPath, destPath);
  });
  console.log(`✓ Copied demo-images directory (${images.length} files)`);
}

// 复制 data 目录（memorials.json）
const dataDir = path.join(__dirname, 'data');
const destDataDir = path.join(__dirname, 'dist/data');

if (fs.existsSync(dataDir)) {
  if (!fs.existsSync(destDataDir)) {
    fs.mkdirSync(destDataDir, { recursive: true });
  }
  
  const dataFiles = fs.readdirSync(dataDir);
  dataFiles.forEach(file => {
    if (file.endsWith('.json')) {
      const srcPath = path.join(dataDir, file);
      const destPath = path.join(destDataDir, file);
      fs.copyFileSync(srcPath, destPath);
    }
  });
  console.log(`✓ Copied data directory (${dataFiles.filter(f => f.endsWith('.json')).length} JSON files)`);
}

// 创建 .nojekyll 文件（GitHub Pages 需要）
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('✓ Created .nojekyll file');

// 创建 404.html（GitHub Pages SPA 支持）
const html404 = fs.readFileSync(path.join(__dirname, 'dist/index.html'), 'utf8');
fs.writeFileSync(path.join(distDir, '404.html'), html404);
console.log('✓ Created 404.html');

console.log('\n✅ Static build completed successfully!');
console.log('📁 Output directory: dist/');
console.log('🚀 Ready to deploy to GitHub Pages');


