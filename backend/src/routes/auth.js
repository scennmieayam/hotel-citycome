const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * POST /api/auth/login
 * Login admin — returns JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
    }

    // Cari admin di database
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Kredensial tidak valid.' });
    }

    const admin = rows[0];

    // Bandingkan password dengan bcrypt hash
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Kredensial tidak valid.' });
    }

    // Buat JWT token (berlaku 8 jam)
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      message: 'Login berhasil.',
      token,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * POST /api/auth/logout
 * Logout (client hanya perlu buang token lokal)
 */
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logout berhasil.' });
});

module.exports = router;
