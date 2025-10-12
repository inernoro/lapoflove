const fs = require('fs');
const path = require('path');

console.log('Building static version for GitHub Pages...');

// 创建 dist 目录
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 复制静态文件
const filesToCopy = [
  { src: 'public/index-static.html', dest: 'dist/index.html' },
  { src: 'public/create-static.html', dest: 'dist/create.html' },
  { src: 'public/style.css', dest: 'dist/style.css' }
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


