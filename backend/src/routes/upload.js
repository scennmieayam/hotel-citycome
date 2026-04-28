const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '../../public/uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
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

router.post('/', authenticateToken, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Ukuran file terlalu besar. Maksimal 5MB.' });
      }
      return res.status(400).json({ success: false, message: err.message || 'Upload gagal.' });
    }

    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error saat upload.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file gambar yang diunggah.' });
    }

    // Construct protocol independent or static URL route path. Base route will deliver static file.
    // E.g., /uploads/room-123.jpg
    const backendHost = req.protocol + '://' + req.get('host');
    const fileUrl = `${backendHost}/uploads/${req.file.filename}`;

    return res.json({ success: true, image_url: fileUrl, message: 'Gambar berhasil diunggah.' });
  });
});

module.exports = router;
