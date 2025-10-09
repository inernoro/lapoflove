# 宠物纪念墓地网站

一个温馨的在线纪念平台，让您为心爱的宠物创建永恒的纪念空间。

## 功能特点

- 🐾 **创建纪念墓地** - 为您的宠物创建个性化的纪念页面
- 📸 **照片展示** - 上传多张照片记录美好时光
- 📝 **纪念故事** - 分享关于宠物的温馨回忆
- 🕯️ **纪念蜡烛** - 其他人可以为您的宠物点亮蜡烛留言
- 🔍 **搜索功能** - 按宠物名字或主人姓名搜索纪念墓地
- 📱 **响应式设计** - 在手机、平板和电脑上都能完美显示

## 技术栈

- **后端**: Node.js + Express
- **前端**: HTML5 + CSS3 + JavaScript
- **文件上传**: Multer
- **数据存储**: JSON文件
- **UI设计**: 渐变色彩 + 毛玻璃效果

## 安装运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

或者启动生产服务器：

```bash
npm start
```

### 3. 访问网站

打开浏览器访问 `http://localhost:3000`

## 项目结构

```
lapoflove/
├── public/                 # 静态文件
│   ├── index.html         # 主页
│   ├── create.html        # 创建纪念墓地页面
│   ├── memorial.html      # 纪念墓地详情页面
│   ├── style.css          # 样式文件
│   └── uploads/           # 上传的图片存储目录
├── data/                  # 数据存储
│   └── memorials.json     # 纪念墓地数据
├── server.js              # 服务器主文件
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## API 接口

### 获取所有纪念墓地
```
GET /api/memorials
```

### 获取特定纪念墓地
```
GET /api/memorial/:id
```

### 创建纪念墓地
```
POST /api/memorial
Content-Type: multipart/form-data

参数:
- petName: 宠物姓名
- ownerName: 主人姓名
- story: 纪念故事
- birthDate: 出生日期 (可选)
- deathDate: 离开日期 (可选)
- photos: 照片文件 (可选，支持多张)
```

### 点亮纪念蜡烛
```
POST /api/memorial/:id/candle
Content-Type: application/json

{
  "message": "纪念留言",
  "senderName": "留言者姓名"
}
```

## 特色设计

- **渐变背景**: 使用紫色渐变营造温馨氛围
- **毛玻璃效果**: 现代化的视觉设计
- **动画效果**: 流畅的淡入动画和悬停效果
- **响应式布局**: 适配各种设备屏幕
- **情感化设计**: 专注于纪念和怀念的情感表达

## 使用说明

1. **访问首页** - 查看所有纪念墓地
2. **创建纪念墓地** - 点击"为您的宠物创建纪念墓地"按钮
3. **填写信息** - 输入宠物信息、上传照片、写下纪念故事
4. **查看详情** - 点击纪念卡片查看完整的纪念页面
5. **点亮蜡烛** - 在纪念页面为宠物留言和点亮蜡烛

## 注意事项

- 图片文件会保存在 `public/uploads/` 目录
- 纪念数据保存在 `data/memorials.json` 文件中
- 首次运行时会自动创建必要的目录
- 支持的图片格式：JPG, PNG, GIF 等常见格式

## 开发与贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License