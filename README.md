# 🐾 宠物纪念墓地网站

一个温馨的在线纪念平台，让您为心爱的宠物创建永恒的纪念空间。

## 🌟 在线预览

**👉 [点击这里访问在线演示](https://inernoro.github.io/lapoflove/)**

**👨‍💼 [管理后台演示](https://inernoro.github.io/lapoflove/admin.html)**

> 注：这是GitHub Pages上的静态演示版本，展示所有功能和真实数据
> 
> 管理后台登录信息：
> - 用户名：`admin`
> - 密码：`lapoflove2025`
 

静态演示版本特点：
- ✅ 无需后端服务器，纯静态页面
- ✅ 包含完整的 UI 和交互
- ✅ 显示真实的纪念数据（从data/memorials.json加载）
- ✅ 可以测试表单提交流程（静态版本不会真实保存）
- ✅ 完整展示localhost:3000的效果

## 📦 两种部署方式

### 1. 静态版本（GitHub Pages / 任何静态托管）
适合快速预览和演示，无需数据库

### 2. 完整版本（带后端服务器）
需要 Node.js 环境，支持真实的数据存储和文件上传

## 功能特点

- 🐾 **创建纪念墓地** - 为您的宠物创建个性化的纪念页面
- 📸 **照片展示** - 上传多张照片记录美好时光
- 📝 **纪念故事** - 分享关于宠物的温馨回忆
- 🕯️ **纪念蜡烛** - 其他人可以为您的宠物点亮蜡烛留言
- 🔍 **搜索功能** - 按宠物名字或主人姓名搜索纪念墓地
- 📱 **响应式设计** - 在手机、平板和电脑上都能完美显示
- 🎨 **精美UI** - 渐变色彩 + 毛玻璃效果
- 👨‍💼 **管理面板** - 管理纪念内容和用户

## 技术栈

- **后端**: Node.js + Express
- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **文件上传**: Multer
- **数据存储**: JSON文件
- **UI设计**: 渐变色彩 + 毛玻璃效果
- **部署**: GitHub Pages / Docker / VPS

## 🚀 快速开始

### 方式一：静态预览版本（推荐用于演示）

适合 Windows 用户快速预览，无需配置后端：

```bash
# 1. 安装依赖
npm install

# 2. 启动静态预览服务器（自动打开浏览器）
npm run dev:static

# 访问 http://localhost:3000
```

这个模式会打开 `index-static.html`，使用内置的模拟数据，无需后端服务器。

### 方式二：完整服务器版本

需要 Node.js 后端支持，支持真实的数据存储：

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（带热重载）
npm run dev

# 或者启动生产服务器
npm start

# 访问 http://localhost:3000
```

## 📦 构建与部署

### 构建静态版本（用于 GitHub Pages）

```bash
# 构建静态页面到 dist 目录
npm run build

# dist 目录可以直接部署到任何静态托管平台
```

### 构建服务器版本（用于 VPS / Docker）

```bash
# 构建完整版本到 dist 目录
npm run build:server

# 然后可以打包部署到服务器
cd dist
npm install --production
npm start
```

### GitHub Pages 自动部署

本项目已配置 GitHub Actions，推送到 master 分支会自动：
1. 构建静态版本
2. 部署到 GitHub Pages
3. 通过 `https://YOUR_USERNAME.github.io/lapoflove/` 访问

**配置步骤**：
1. 进入仓库的 Settings > Pages
2. Source 选择 "GitHub Actions"
3. 推送代码到 master 分支即可自动部署

## 📁 项目结构

```
lapoflove/
├── .github/
│   └── workflows/
│       └── build.yml           # GitHub Actions 自动部署配置
├── public/                     # 静态文件
│   ├── index.html             # 主页（服务器版本）
│   ├── index-static.html      # 主页（静态版本）
│   ├── create.html            # 创建页面（服务器版本）
│   ├── create-static.html     # 创建页面（静态版本）
│   ├── admin.html             # 管理面板
│   ├── style.css              # 样式文件
│   ├── demo-images/           # 演示图片
│   └── uploads/               # 用户上传的图片
├── data/                       # 数据存储（服务器版本）
│   ├── memorials.json         # 纪念墓地数据
│   ├── users.json             # 用户数据
│   └── banned_users.json      # 封禁用户数据
├── dist/                       # 构建输出目录
├── docker/                     # Docker 配置文件
├── server.js                   # Express 服务器
├── pet-images-cdn.js          # CDN 图片池
├── build-static.js            # 静态版本构建脚本
├── build-server.js            # 服务器版本构建脚本
├── package.json               # 项目配置
└── README.md                  # 项目说明
```

## 🔌 API 接口（仅服务器版本）

### 公开接口

#### 获取所有纪念墓地
```http
GET /api/memorials
```

#### 获取特定纪念墓地
```http
GET /api/memorial/:id
```

#### 创建纪念墓地
```http
POST /api/memorial
Content-Type: multipart/form-data

参数:
- petName: 宠物姓名 (必填)
- ownerName: 主人姓名 (必填)
- story: 纪念故事 (必填)
- birthDate: 出生日期 (可选)
- deathDate: 离开日期 (可选)
- photos: 照片文件 (可选，支持多张)
- useRandomImage: 使用随机CDN图片 (可选，true/false)
```

#### 点亮纪念蜡烛
```http
POST /api/memorial/:id/candle
Content-Type: application/json

{
  "message": "纪念留言",
  "senderName": "留言者姓名"
}
```

### 管理员接口

需要在请求头中添加 `admin-key: lapoflove-admin-2025`

```http
GET /api/admin/memorials          # 获取所有纪念册（包括已删除）
GET /api/admin/users               # 获取所有用户
DELETE /api/admin/memorial/:id     # 删除纪念册
PUT /api/admin/memorial/:id/restore # 恢复纪念册
POST /api/admin/ban-user           # 封禁用户
DELETE /api/admin/ban-user/:id     # 解封用户
POST /api/admin/generate-demo-data # 生成演示数据
```

访问管理面板：`http://localhost:3000/admin`

**静态演示版本管理面板**：[https://inernoro.github.io/lapoflove/admin.html](https://inernoro.github.io/lapoflove/admin.html)
- 用户名：`admin`  
- 密码：`lapoflove2025`

## 特色设计

- **渐变背景**: 使用紫色渐变营造温馨氛围
- **毛玻璃效果**: 现代化的视觉设计
- **动画效果**: 流畅的淡入动画和悬停效果
- **响应式布局**: 适配各种设备屏幕
- **情感化设计**: 专注于纪念和怀念的情感表达

## 📖 使用说明

### 普通用户

1. **访问首页** - 查看所有纪念墓地
2. **搜索纪念** - 通过宠物名或主人名搜索
3. **查看详情** - 点击纪念卡片查看完整故事
4. **点亮蜡烛** - 为宠物留言和点亮纪念蜡烛
5. **创建纪念** - 点击"Create a memorial"按钮
   - 填写宠物信息
   - 上传照片或使用演示图片
   - 写下纪念故事
   - 提交创建

### 管理员

1. 访问管理面板：`/admin`
2. 输入管理密钥：`lapoflove-admin-2025`
3. 可以：
   - 查看所有纪念册（包括已删除的）
   - 删除/恢复纪念册
   - 管理用户和封禁
   - 生成演示数据

## ⚙️ 环境变量配置（可选）

服务器版本支持通过环境变量配置：

```bash
PORT=3000                          # 服务器端口
ADMIN_KEY=lapoflove-admin-2025    # 管理员密钥
```

## ⚠️ 注意事项

### 静态版本
- ✅ 无需后端，可直接在浏览器中打开
- ✅ 数据是模拟的，刷新页面后恢复
- ✅ 适合演示和预览
- ❌ 无法真实保存数据

### 服务器版本
- ✅ 支持真实的数据存储
- ✅ 支持文件上传
- ✅ 支持管理功能
- ⚠️ 图片保存在 `public/uploads/` 目录
- ⚠️ 数据保存在 `data/` 目录的 JSON 文件中
- ⚠️ 首次运行会自动创建必要的目录
- ⚠️ 生产环境建议使用数据库而非 JSON 文件

### Docker 部署

项目包含 Docker 配置文件，可以快速部署：

```bash
# 使用 Docker Compose
docker-compose up -d

# 或使用单独的 Dockerfile
docker build -t pet-memorial .
docker run -p 3000:3000 pet-memorial
```

## 🎯 功能路线图

- [x] 基础纪念墙功能
- [x] 创建纪念页面
- [x] 点亮蜡烛功能
- [x] 搜索功能
- [x] 管理面板
- [x] 静态预览版本
- [x] GitHub Pages 自动部署
- [x] CDN 图片支持
- [ ] 用户注册登录
- [ ] 数据库支持（MySQL/PostgreSQL）
- [ ] 图片云存储（OSS/S3）
- [ ] 社交分享功能
- [ ] 多语言支持
- [ ] 移动端 APP

## 🛠️ 常见问题

### Q: 如何在 Windows 上快速预览？
A: 运行 `npm run dev:static` 即可，会自动打开浏览器显示静态预览版本。

### Q: 静态版本和服务器版本有什么区别？
A: 静态版本使用模拟数据，无需后端，适合演示；服务器版本支持真实数据存储。

### Q: GitHub Pages 部署失败怎么办？
A: 
1. 确保仓库设置中启用了 GitHub Pages
2. 检查 Settings > Pages，Source 选择 "GitHub Actions"
3. 查看 Actions 标签页的构建日志

### Q: 如何更改管理员密钥？
A: 修改 `server.js` 中的 `lapoflove-admin-2025` 或设置环境变量 `ADMIN_KEY`。

### Q: 支持哪些浏览器？
A: 支持所有现代浏览器（Chrome, Firefox, Safari, Edge），IE 不支持。

## 🤝 开发与贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/lapoflove.git
cd lapoflove

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或启动静态预览
npm run dev:static
```

### 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

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

## 💖 致谢

感谢所有为宠物纪念平台贡献的开发者和用户。

---

**用爱纪念每一个毛孩子** 🐾