# 🚀 快速开始指南

## Windows 用户快速预览（推荐）

只需两步即可在本地预览项目：

### 步骤 1: 安装依赖

打开命令行（CMD 或 PowerShell），进入项目目录：

```bash
npm install
```

### 步骤 2: 启动静态预览服务器

```bash
npm run dev:static
```

浏览器会自动打开 `http://localhost:3000`，显示静态演示版本。

---

## 完整功能版本（需要后端）

如果需要数据存储、文件上传等完整功能：

```bash
# 开发模式（自动重载）
npm run dev

# 生产模式
npm start
```

访问：
- 主页：`http://localhost:3000`
- 管理面板：`http://localhost:3000/admin`
- 管理密钥：`lapoflove-admin-2025`

---

## 部署到 GitHub Pages

### 方法一：自动部署（推荐）

1. 将代码推送到 GitHub 仓库的 `master` 分支
2. 在仓库设置中启用 GitHub Pages
   - 进入 **Settings** > **Pages**
   - **Source** 选择 **"GitHub Actions"**
3. 等待 GitHub Actions 自动构建和部署
4. 访问 `https://你的用户名.github.io/仓库名/`

### 方法二：手动构建

```bash
# 构建静态文件
npm run build

# dist 目录中的文件可以部署到任何静态托管平台
```

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run dev:static` | 启动静态预览（Windows 推荐） |
| `npm run dev` | 启动开发服务器（带热重载） |
| `npm start` | 启动生产服务器 |
| `npm run build` | 构建静态版本（GitHub Pages） |
| `npm run build:server` | 构建服务器版本（VPS 部署） |

---

## 故障排查

### 问题：`npm install` 失败

**解决方案**：
```bash
# 清除缓存重试
npm cache clean --force
npm install
```

### 问题：端口 3000 被占用

**解决方案**：
- 静态版本：编辑 `package.json`，将 `-p 3000` 改为其他端口
- 服务器版本：修改 `server.js` 中的 `PORT` 变量

### 问题：GitHub Pages 部署失败

**检查清单**：
1. ✅ 仓库设置中启用了 GitHub Pages
2. ✅ Source 选择 "GitHub Actions"
3. ✅ 查看 Actions 标签页的构建日志
4. ✅ 确保推送到了 `master` 分支

---

## 项目文件说明

### 静态版本文件
- `public/index-static.html` - 静态主页（带模拟数据）
- `public/create-static.html` - 静态创建页面
- `build-static.js` - 静态构建脚本

### 服务器版本文件
- `public/index.html` - 服务器主页
- `public/create.html` - 服务器创建页面
- `server.js` - Express 服务器
- `build-server.js` - 服务器构建脚本

### 数据文件
- `data/memorials.json` - 纪念数据
- `public/demo-images/` - 演示图片

---

## 下一步

1. ✅ 浏览静态演示版本，了解功能
2. ✅ 尝试创建纪念墓地（演示模式）
3. ✅ 部署到 GitHub Pages 分享给朋友
4. 🔧 根据需求修改样式和内容
5. 🚀 部署完整版本到服务器

---

**需要帮助？** 查看 [README.md](README.md) 获取完整文档


