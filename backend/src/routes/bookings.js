const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { authenticateToken } = require('../middleware/auth');

function last8Digits(str = '') {
  return String(str).replace(/\D/g, '').slice(-8);
}

/**
 * POST /api/bookings — publik
 */
router.post('/', async (req, res) => {
  try {
    const {
      guest_name, guest_email, guest_phone,
      room_id, room_type, check_in, check_out,
      total_price, notes,
    } = req.body;

    if (!guest_name || !guest_phone || !room_id || !check_in || !check_out) {
      return res.status(400).json({ success: false, message: 'Data pemesanan tidak lengkap.' });
    }

    let bookingId;
    for (let i = 0; i < 5; i++) {
      const candidate = 'BK-' + Math.floor(10000 + Math.random() * 90000);
      const exists = await Booking.exists({ _id: candidate });
      if (!exists) { bookingId = candidate; break; }
    }
    if (!bookingId) {
      return res.status(500).json({ success: false, message: 'Gagal generate booking ID.' });
    }

    const booking = await Booking.create({
      _id: bookingId,
      guest_name,
      guest_email: guest_email || '',
      guest_phone,
      room_id,
      room_type: room_type || '',
      check_in: new Date(check_in),
      check_out: new Date(check_out),
      total_price: Number(total_price) || 0,
      notes: notes || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat.',
      data: { booking_id: booking._id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * GET /api/bookings/check — publik
 */
router.get('/check', async (req, res) => {
  try {
    const { booking_id, whatsapp } = req.query;
    if (!booking_id || !whatsapp) {
      return res.status(400).json({ success: false, message: 'booking_id dan whatsapp wajib diisi.' });
    }

    const digits = last8Digits(whatsapp);
    const booking = await Booking.findOne({
      _id: booking_id.toUpperCase(),
      guest_phone: { $regex: digits, $options: 'i' },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }
    res.json({ success: true, data: booking.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * POST /api/bookings/cancel_request — publik
 */
router.post('/cancel_request', async (req, res) => {
  try {
    const { booking_id, whatsapp } = req.body;
    if (!booking_id || !whatsapp) {
      return res.status(400).json({ success: false, message: 'ID Booking dan WhatsApp wajib diisi.' });
    }

    const digits = last8Digits(whatsapp);
    const booking = await Booking.findOne({
      _id: booking_id.toUpperCase(),
      guest_phone: { $regex: digits, $options: 'i' },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Data validasi tidak cocok atau pesanan tidak ditemukan.' });
    }
    if (booking.status === 'rejected') {
      return res.status(400).json({ success: false, message: 'Pesanan sudah dibatalkan sebelumnya.' });
    }

    booking.status = 'request_cancel';
    await booking.save();
    res.json({ success: true, message: 'Permintaan pembatalan berhasil diajukan ke admin.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * GET /api/bookings — admin only
 */
router.get('/', authenticateToken, async (_req, res) => {
  try {
    const bookings = await Booking.find().sort({ created_at: -1 });
    res.json({ success: true, data: bookings.map((b) => b.toJSON()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * GET /api/bookings/:id — admin only
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }
    res.json({ success: true, data: booking.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * PATCH /api/bookings/:id/status — admin only
 */
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'rejected', 'request_cancel'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }
    res.json({ success: true, message: `Status pesanan berhasil diubah ke "${status}".` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * DELETE /api/bookings/:id — admin only
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }
    res.json({ success: true, message: 'Pesanan berhasil dihapus.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
