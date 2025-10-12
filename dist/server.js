const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getRandomPetImage, getRandomPetImages } = require('./pet-images-cdn');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

if (!fs.existsSync('public/uploads')) {
  fs.mkdirSync('public/uploads', { recursive: true });
}

if (!fs.existsSync('data')) {
  fs.mkdirSync('data', { recursive: true });
}

const memorialsFile = 'data/memorials.json';
const usersFile = 'data/users.json';
const bannedUsersFile = 'data/banned_users.json';

function getMemorials() {
  if (fs.existsSync(memorialsFile)) {
    const memorials = JSON.parse(fs.readFileSync(memorialsFile, 'utf8'));
    // 过滤已删除的纪念册
    return memorials.filter(memorial => !memorial.deleted);
  }
  return [];
}

function getAllMemorials() {
  if (fs.existsSync(memorialsFile)) {
    return JSON.parse(fs.readFileSync(memorialsFile, 'utf8'));
  }
  return [];
}

function saveMemorials(memorials) {
  fs.writeFileSync(memorialsFile, JSON.stringify(memorials, null, 2));
}

function getUsers() {
  if (fs.existsSync(usersFile)) {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  }
  return [];
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function getBannedUsers() {
  if (fs.existsSync(bannedUsersFile)) {
    return JSON.parse(fs.readFileSync(bannedUsersFile, 'utf8'));
  }
  return [];
}

function saveBannedUsers(bannedUsers) {
  fs.writeFileSync(bannedUsersFile, JSON.stringify(bannedUsers, null, 2));
}

function isUserBanned(ownerName, clientIp) {
  const bannedUsers = getBannedUsers();
  return bannedUsers.some(user => 
    user.ownerName === ownerName || user.ip === clientIp
  );
}

// 简单的管理员验证 (实际项目中应使用更安全的认证)
function isAdmin(req) {
  const adminKey = req.headers['admin-key'] || req.query.adminKey;
  return adminKey === 'lapoflove-admin-2025'; // 在生产环境中应该使用环境变量
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'create.html'));
});

// Memorial detail is now handled by modal in main page

app.get('/api/memorials', (req, res) => {
  res.json(getMemorials());
});

app.get('/api/memorial/:id', (req, res) => {
  const memorials = getMemorials();
  const memorial = memorials.find(m => m.id === req.params.id);
  if (memorial) {
    res.json(memorial);
  } else {
    res.status(404).json({ error: 'Memorial not found' });
  }
});

app.post('/api/memorial', upload.array('photos', 10), (req, res) => {
  const { petName, ownerName, story, birthDate, deathDate, useRandomImage } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  // 检查用户是否被封禁
  if (isUserBanned(ownerName, clientIp)) {
    return res.status(403).json({ 
      error: 'User is banned from creating memorials',
      message: '您的账户已被封禁，无法创建纪念册'
    });
  }

  // 处理图片 - 支持上传图片或使用随机CDN图片
  let photos = [];
  if (req.files && req.files.length > 0) {
    photos = req.files.map(file => `/uploads/${file.filename}`);
  } else if (useRandomImage === 'true') {
    // 使用随机CDN宠物图片
    photos = [getRandomPetImage()];
  }

  const memorial = {
    id: uuidv4(),
    petName,
    ownerName,
    story,
    birthDate,
    deathDate,
    photos,
    candles: [],
    createdAt: new Date().toISOString(),
    clientIp: clientIp, // 记录IP用于管理
    status: 'active' // active, deleted, hidden
  };

  const memorials = getAllMemorials();
  memorials.push(memorial);
  saveMemorials(memorials);

  // 记录用户信息
  const users = getUsers();
  const existingUser = users.find(user => user.ownerName === ownerName);
  if (!existingUser) {
    users.push({
      ownerName,
      firstPostDate: new Date().toISOString(),
      lastPostDate: new Date().toISOString(),
      totalPosts: 1,
      ip: clientIp
    });
  } else {
    existingUser.lastPostDate = new Date().toISOString();
    existingUser.totalPosts = (existingUser.totalPosts || 1) + 1;
  }
  saveUsers(users);

  res.json({ success: true, id: memorial.id });
});

app.post('/api/memorial/:id/candle', (req, res) => {
  const { message, senderName } = req.body;
  const memorials = getMemorials();
  const memorial = memorials.find(m => m.id === req.params.id);

  if (memorial) {
    const candle = {
      id: uuidv4(),
      message,
      senderName,
      createdAt: new Date().toISOString()
    };
    memorial.candles.push(candle);
    saveMemorials(memorials);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Memorial not found' });
  }
});

// ========== 管理员API接口 ==========

// 获取所有纪念册（包括已删除的）
app.get('/api/admin/memorials', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const memorials = getAllMemorials();
  res.json(memorials);
});

// 获取所有用户
app.get('/api/admin/users', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const users = getUsers();
  const bannedUsers = getBannedUsers();
  res.json({ users, bannedUsers });
});

// 删除纪念册
app.delete('/api/admin/memorial/:id', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const memorials = getAllMemorials();
  const memorial = memorials.find(m => m.id === req.params.id);
  
  if (memorial) {
    memorial.deleted = true;
    memorial.deletedAt = new Date().toISOString();
    memorial.deletedBy = 'admin';
    saveMemorials(memorials);
    res.json({ success: true, message: 'Memorial deleted successfully' });
  } else {
    res.status(404).json({ error: 'Memorial not found' });
  }
});

// 恢复纪念册
app.put('/api/admin/memorial/:id/restore', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const memorials = getAllMemorials();
  const memorial = memorials.find(m => m.id === req.params.id);
  
  if (memorial) {
    memorial.deleted = false;
    delete memorial.deletedAt;
    delete memorial.deletedBy;
    saveMemorials(memorials);
    res.json({ success: true, message: 'Memorial restored successfully' });
  } else {
    res.status(404).json({ error: 'Memorial not found' });
  }
});

// 封禁用户
app.post('/api/admin/ban-user', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { ownerName, reason, ip } = req.body;
  const bannedUsers = getBannedUsers();
  
  const banRecord = {
    id: uuidv4(),
    ownerName,
    ip,
    reason: reason || 'Inappropriate content',
    bannedAt: new Date().toISOString(),
    bannedBy: 'admin'
  };
  
  bannedUsers.push(banRecord);
  saveBannedUsers(bannedUsers);
  
  res.json({ success: true, message: 'User banned successfully' });
});

// 解封用户
app.delete('/api/admin/ban-user/:id', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const bannedUsers = getBannedUsers();
  const filteredUsers = bannedUsers.filter(user => user.id !== req.params.id);
  
  if (filteredUsers.length < bannedUsers.length) {
    saveBannedUsers(filteredUsers);
    res.json({ success: true, message: 'User unbanned successfully' });
  } else {
    res.status(404).json({ error: 'Ban record not found' });
  }
});

// 批量生成demo数据（使用随机CDN图片）
app.post('/api/admin/generate-demo-data', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { count = 10 } = req.body;
  const memorials = getAllMemorials();
  
  const petNames = ['Max', 'Bella', 'Charlie', 'Lucy', 'Cooper', 'Luna', 'Rocky', 'Molly', 'Buddy', 'Daisy', 'Jack', 'Lola', 'Oliver', 'Sophie', 'Tucker'];
  const ownerNames = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', 'Alice', 'Bob', 'Carol', 'David', 'Emma', 'Frank', 'Grace'];
  const stories = [
    '我最亲爱的伙伴，感谢你陪伴我度过了那么多美好的时光。',
    '你永远是我心中最特别的小天使，愿你在彩虹桥的那边快乐。',
    '谢谢你教会我什么是无条件的爱，我会永远想念你。',
    '虽然你离开了，但你在我心中的位置永远不会改变。',
    '愿你在天堂里有无尽的玩具和零食，我的小宝贝。'
  ];
  
  for (let i = 0; i < count; i++) {
    const memorial = {
      id: uuidv4(),
      petName: petNames[Math.floor(Math.random() * petNames.length)],
      ownerName: ownerNames[Math.floor(Math.random() * ownerNames.length)],
      story: stories[Math.floor(Math.random() * stories.length)],
      birthDate: new Date(2010 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      deathDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      photos: [getRandomPetImage()],
      candles: [],
      createdAt: new Date().toISOString(),
      clientIp: '127.0.0.1',
      status: 'active'
    };
    
    memorials.push(memorial);
  }
  
  saveMemorials(memorials);
  res.json({ success: true, message: `Generated ${count} demo memorials with random pet images` });
});

// 管理面板页面
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
  console.log(`Admin key: lapoflove-admin-2025`);
});