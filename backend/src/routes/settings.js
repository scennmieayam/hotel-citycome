const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Setting = require('../models/Setting');
const Admin = require('../models/Admin');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/settings — publik
 */
router.get('/', async (_req, res) => {
  try {
    const rows = await Setting.find();
    const settingsObj = {};
    rows.forEach((r) => { settingsObj[r.setting_key] = r.setting_value; });
    res.json({ success: true, data: settingsObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/settings/admin-info — admin only
 */
router.get('/admin-info', authenticateToken, async (_req, res) => {
  try {
    const admin = await Admin.findOne({ username: 'admin' });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin tidak ditemukan.' });
    }
    res.json({ success: true, data: { username: admin.username, email: 'admin@citycome.com' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * PUT /api/settings — admin only (upsert semua key/value)
 */
router.put('/', authenticateToken, async (req, res) => {
  try {
    const updates = Object.entries(req.body || {});
    for (const [key, value] of updates) {
      if (value === undefined || value === null) continue;
      await Setting.findOneAndUpdate(
        { setting_key: key },
        { $set: { setting_value: String(value) } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    res.json({ success: true, message: 'Pengaturan berhasil disimpan!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * PUT /api/settings/admin-password — admin only
 */
router.put('/admin-password', authenticateToken, async (req, res) => {
  try {
    const { new_password } = req.body;
    if (!new_password || new_password.trim() === '') {
      return res.status(400).json({ success: false, message: 'Password tidak boleh kosong' });
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    const result = await Admin.updateOne({ username: 'admin' }, { $set: { password: hashedPassword } });
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Admin tidak ditemukan.' });
    }
    res.json({ success: true, message: 'Password admin berhasil diperbarui.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
