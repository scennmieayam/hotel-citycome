const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'room-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file gambar yang diunggah.' });
    }
    
    // Construct protocol independent or static URL route path. Base route will deliver static file.
    // E.g., /uploads/room-123.jpg
    const backendHost = req.protocol + '://' + req.get('host');
    const fileUrl = `${backendHost}/uploads/${req.file.filename}`;

    res.json({ success: true, image_url: fileUrl, message: 'Gambar berhasil diunggah.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error saat upload.' });
  }
});

module.exports = router;
