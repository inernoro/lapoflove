# 📦 部署指南

本文档介绍如何部署宠物纪念网站的两个版本。

## 目录

- [静态版本部署（GitHub Pages）](#静态版本部署github-pages)
- [服务器版本部署（VPS/云服务器）](#服务器版本部署vps云服务器)
- [Docker 部署](#docker-部署)
- [环境配置](#环境配置)

---

## 静态版本部署（GitHub Pages）

### 自动部署（推荐）

本项目已配置 GitHub Actions，推送代码即可自动部署。

#### 步骤：

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin master
   ```

2. **配置 GitHub Pages**
   - 进入仓库的 **Settings** > **Pages**
   - **Source** 选择 **"GitHub Actions"**

3. **等待构建完成**
   - 查看 **Actions** 标签页
   - 等待绿色的 ✅ 标记
   - 部署通常需要 1-2 分钟

4. **访问网站**
   ```
   https://YOUR_USERNAME.github.io/lapoflove/
   ```

### 手动部署

如果你想部署到其他静态托管平台（Netlify、Vercel、Cloudflare Pages 等）：

```bash
# 1. 构建静态文件
npm run build

# 2. dist 目录就是要部署的内容
# 上传 dist/ 目录到任何静态托管平台即可
```

**支持的平台**：
- ✅ GitHub Pages
- ✅ Netlify
- ✅ Vercel
- ✅ Cloudflare Pages
- ✅ 阿里云 OSS
- ✅ 腾讯云 COS
- ✅ 任何支持静态网站的平台

---

## 服务器版本部署（VPS/云服务器）

适合需要数据持久化和文件上传功能的场景。

### 准备工作

**服务器要求**：
- Node.js 18+ 
- 1GB+ RAM
- 10GB+ 磁盘空间
- Ubuntu 20.04+ / CentOS 7+ / 其他 Linux 发行版

### 部署步骤

#### 1. 连接服务器

```bash
ssh user@your-server-ip
```

#### 2. 安装 Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

#### 3. 克隆项目

```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/lapoflove.git
cd lapoflove
```

#### 4. 安装依赖并构建

```bash
npm install --production
```

#### 5. 启动服务器

**方式一：直接启动**
```bash
npm start
```

**方式二：使用 PM2（推荐）**
```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name pet-memorial

# 设置开机自启
pm2 startup
pm2 save

# 常用命令
pm2 list           # 查看运行状态
pm2 logs           # 查看日志
pm2 restart pet-memorial  # 重启
pm2 stop pet-memorial     # 停止
```

**方式三：使用 systemd**

创建服务文件 `/etc/systemd/system/pet-memorial.service`：

```ini
[Unit]
Description=Pet Memorial Website
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/lapoflove
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
sudo systemctl enable pet-memorial
sudo systemctl start pet-memorial
sudo systemctl status pet-memorial
```

#### 6. 配置 Nginx 反向代理

安装 Nginx：
```bash
sudo apt install nginx  # Ubuntu/Debian
sudo yum install nginx  # CentOS/RHEL
```

创建配置文件 `/etc/nginx/sites-available/pet-memorial`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/pet-memorial /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 7. 配置 HTTPS（使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书并自动配置 Nginx
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## Docker 部署

最简单的部署方式，适合所有环境。

### 使用 Docker Compose（推荐）

项目已包含 `docker-compose.yml`：

```bash
# 启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down

# 重启
docker-compose restart
```

### 使用 Dockerfile

```bash
# 构建镜像
docker build -t pet-memorial .

# 运行容器
docker run -d \
  --name pet-memorial \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/public/uploads:/app/public/uploads \
  pet-memorial

# 查看日志
docker logs -f pet-memorial

# 停止容器
docker stop pet-memorial

# 删除容器
docker rm pet-memorial
```

---

## 环境配置

### 环境变量

创建 `.env` 文件：

```bash
# 服务器端口
PORT=3000

# 管理员密钥
ADMIN_KEY=your-secure-admin-key-here

# Node 环境
NODE_ENV=production
```

### 数据备份

定期备份数据目录：

```bash
# 备份数据
tar -czf backup-$(date +%Y%m%d).tar.gz data/ public/uploads/

# 恢复数据
tar -xzf backup-20250101.tar.gz
```

### 自动备份脚本

创建 `/usr/local/bin/backup-pet-memorial.sh`：

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/pet-memorial"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR
cd /var/www/lapoflove
tar -czf $BACKUP_DIR/backup-$DATE.tar.gz data/ public/uploads/

# 只保留最近 7 天的备份
find $BACKUP_DIR -name "backup-*.tar.gz" -mtime +7 -delete
```

添加到 crontab（每天凌晨 2 点备份）：

```bash
0 2 * * * /usr/local/bin/backup-pet-memorial.sh
```

---

## 性能优化

### 1. 启用 Gzip 压缩（Nginx）

在 Nginx 配置中添加：

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### 2. CDN 加速

将静态资源（图片、CSS、JS）上传到 CDN。

### 3. 数据库优化

生产环境建议使用 MySQL/PostgreSQL 替代 JSON 文件存储。

---

## 监控和日志

### PM2 监控

```bash
pm2 monit
```

### 日志查看

```bash
# PM2 日志
pm2 logs pet-memorial

# systemd 日志
journalctl -u pet-memorial -f

# Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 故障排查

### 问题 1：端口被占用

```bash
# 查看端口占用
sudo lsof -i :3000

# 杀死进程
sudo kill -9 PID
```

### 问题 2：权限错误

```bash
# 修改目录权限
sudo chown -R www-data:www-data /var/www/lapoflove
sudo chmod -R 755 /var/www/lapoflove
```

### 问题 3：内存不足

```bash
# 查看内存使用
free -h

# 添加 swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 更新部署

```bash
cd /var/www/lapoflove
git pull origin master
npm install --production
pm2 restart pet-memorial
```

---

## 安全建议

1. ✅ 更改默认管理员密钥
2. ✅ 配置防火墙（ufw/firewalld）
3. ✅ 使用 HTTPS（Let's Encrypt）
4. ✅ 定期更新系统和依赖
5. ✅ 限制文件上传大小
6. ✅ 启用请求速率限制
7. ✅ 定期备份数据
8. ✅ 使用强密码和密钥认证

---

## 技术支持

- 📖 查看 [README.md](README.md) 获取完整文档
- 🚀 查看 [QUICK_START.md](QUICK_START.md) 快速开始
- 🐛 提交 Issue：GitHub Issues
- 💬 讨论交流：GitHub Discussions

---

**祝您部署顺利！** 🎉


