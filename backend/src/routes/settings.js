const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/auth');

// GET settings (publik)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM settings');
    const settingsObj = {};
    rows.forEach(r => { settingsObj[r.setting_key] = r.setting_value; });
    res.json({ success: true, data: settingsObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET admin data info
router.get('/admin-info', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT username FROM admins WHERE username = ?', ['admin']);
        res.json({ success: true, data: { username: rows[0].username, email: 'admin@citycome.com' } });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// UPDATE settings
router.put('/', authenticateToken, async (req, res) => {
  try {
    const updates = Object.entries(req.body);
    for (const [key, value] of updates) {
      if (value !== undefined && value !== null) {
        await db.query(`
          INSERT INTO settings (setting_key, setting_value) 
          VALUES (?, ?) 
          ON DUPLICATE KEY UPDATE setting_value = ?
        `, [key, value.toString(), value.toString()]);
      }
    }
    res.json({ success: true, message: 'Pengaturan berhasil disimpan!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// UPDATE admin password
router.put('/admin-password', authenticateToken, async (req, res) => {
  try {
    const { new_password } = req.body;
    if (!new_password || new_password.trim() === '') {
      return res.status(400).json({ success: false, message: 'Password tidak boleh kosong' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    // Asumsi hanya ada 1 admin (username='admin')
    await db.query('UPDATE admins SET password = ? WHERE username = ?', [hashedPassword, 'admin']);

    res.json({ success: true, message: 'Password admin berhasil diperbarui.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
