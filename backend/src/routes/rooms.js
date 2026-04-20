const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/rooms
 * Ambil semua kamar (publik)
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM rooms ORDER BY price ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * GET /api/rooms/:id
 * Ambil detail satu kamar (publik)
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kamar tidak ditemukan.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * POST /api/rooms
 * Tambah kamar baru (admin only)
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { id, name, description, price, image_url, features, available, total } = req.body;
    if (!id || !name || !price) {
      return res.status(400).json({ success: false, message: 'id, name, dan price wajib diisi.' });
    }
    const featuresJson = JSON.stringify(features || []);
    const roomTotal = total !== undefined ? parseInt(total, 10) : 5;
    
    await db.query(
      'INSERT INTO rooms (id, name, description, price, image_url, features, available, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, description, price, image_url, featuresJson, available !== false, roomTotal]
    );
    res.status(201).json({ success: true, message: 'Kamar berhasil ditambahkan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * PUT /api/rooms/:id
 * Update kamar (admin only)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, image_url, features, available, total } = req.body;
    const featuresJson = features ? JSON.stringify(features) : undefined;
    
    await db.query(
      `UPDATE rooms SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        image_url = COALESCE(?, image_url),
        features = COALESCE(?, features),
        available = COALESCE(?, available),
        total = COALESCE(?, total)
      WHERE id = ?`,
      [name, description, price, image_url, featuresJson, available, total, req.params.id]
    );
    res.json({ success: true, message: 'Kamar berhasil diupdate.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * DELETE /api/rooms/:id
 * Hapus kamar (admin only)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Kamar berhasil dihapus.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
