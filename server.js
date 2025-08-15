const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  const { name } = req.body;
  const file = req.file;

  if (!file) return res.status(400).send('No image uploaded');

  const outputPath = path.join(__dirname, 'public', 'output.jpg');

  try {
    await sharp(file.buffer)
      .resize(400, 500)
      .composite([
        {
          input: Buffer.from(`<svg>
            <text x="50%" y="90%" font-size="24" fill="white" text-anchor="middle">${name}</text>
          </svg>`),
          top: 0,
          left: 0
        }
      ])
      .toFile(outputPath);

    res.send({ message: 'Image processed', url: '/output.jpg' });
  } catch (err) {
    res.status(500).send('Error processing image');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
