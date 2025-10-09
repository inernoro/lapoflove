const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

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

function getMemorials() {
  if (fs.existsSync(memorialsFile)) {
    return JSON.parse(fs.readFileSync(memorialsFile, 'utf8'));
  }
  return [];
}

function saveMemorials(memorials) {
  fs.writeFileSync(memorialsFile, JSON.stringify(memorials, null, 2));
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
  const { petName, ownerName, story, birthDate, deathDate } = req.body;

  const photos = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  const memorial = {
    id: uuidv4(),
    petName,
    ownerName,
    story,
    birthDate,
    deathDate,
    photos,
    candles: [],
    createdAt: new Date().toISOString()
  };

  const memorials = getMemorials();
  memorials.push(memorial);
  saveMemorials(memorials);

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});