const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/rooms — publik
 */
router.get('/', async (_req, res) => {
  try {
    const rooms = await Room.find().sort({ price: 1 });
    res.json({ success: true, data: rooms.map((r) => r.toJSON()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * GET /api/rooms/:id — publik
 */
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Kamar tidak ditemukan.' });
    }
    res.json({ success: true, data: room.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * POST /api/rooms — admin only
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { id, name, description, price, image_url, features, available, total } = req.body;
    if (!id || !name || price === undefined) {
      return res.status(400).json({ success: false, message: 'id, name, dan price wajib diisi.' });
    }

    const exists = await Room.findById(id);
    if (exists) {
      return res.status(409).json({ success: false, message: 'ID kamar sudah dipakai.' });
    }

    const room = await Room.create({
      _id: id,
      name,
      description: description || '',
      price: Number(price),
      image_url: image_url || '',
      features: Array.isArray(features) ? features : [],
      available: available !== false,
      total: total !== undefined ? Number(total) : 5,
      booked: 0,
    });

    res.status(201).json({ success: true, message: 'Kamar berhasil ditambahkan.', data: room.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * PUT /api/rooms/:id — admin only
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, image_url, features, available, total } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = Number(price);
    if (image_url !== undefined) update.image_url = image_url;
    if (features !== undefined) update.features = Array.isArray(features) ? features : [];
    if (available !== undefined) update.available = Boolean(Number(available));
    if (total !== undefined) update.total = Number(total);

    const room = await Room.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Kamar tidak ditemukan.' });
    }
    res.json({ success: true, message: 'Kamar berhasil diupdate.', data: room.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * DELETE /api/rooms/:id — admin only
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Kamar tidak ditemukan.' });
    }
    res.json({ success: true, message: 'Kamar berhasil dihapus.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
