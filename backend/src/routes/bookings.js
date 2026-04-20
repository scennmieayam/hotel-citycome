const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

/**
 * POST /api/bookings
 * Buat pesanan baru (publik — dari form booking tamu)
 */
router.post('/', async (req, res) => {
  try {
    const { guest_name, guest_email, guest_phone, room_id, room_type, check_in, check_out, total_price, notes } = req.body;

    if (!guest_name || !guest_phone || !room_id || !check_in || !check_out) {
      return res.status(400).json({ success: false, message: 'Data pemesanan tidak lengkap.' });
    }

    // Generate booking ID: BK-XXXXX
    const bookingId = 'BK-' + Math.floor(10000 + Math.random() * 90000);

    await db.query(
      `INSERT INTO bookings (id, guest_name, guest_email, guest_phone, room_id, room_type, check_in, check_out, total_price, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [bookingId, guest_name, guest_email, guest_phone, room_id, room_type, check_in, check_out, total_price, notes]
    );

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat.',
      data: { booking_id: bookingId },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * GET /api/bookings/check
 * Cek status pesanan berdasarkan ID dan nomor WA (publik)
 */
router.get('/check', async (req, res) => {
  try {
    const { booking_id, whatsapp } = req.query;

    if (!booking_id || !whatsapp) {
      return res.status(400).json({ success: false, message: 'booking_id dan whatsapp wajib diisi.' });
    }

    const [rows] = await db.query(
      'SELECT * FROM bookings WHERE id = ? AND guest_phone LIKE ?',
      [booking_id.toUpperCase(), `%${whatsapp.replace(/\D/g, '').slice(-8)}%`]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * POST /api/bookings/cancel_request
 * Meminta pembatalan pesanan dari sisi tamu (publik)
 */
router.post('/cancel_request', async (req, res) => {
  try {
    const { booking_id, whatsapp } = req.body;
    if (!booking_id || !whatsapp) {
      return res.status(400).json({ success: false, message: 'ID Booking dan WhatsApp wajib diisi.' });
    }

    const [rows] = await db.query(
      'SELECT * FROM bookings WHERE id = ? AND guest_phone LIKE ?',
      [booking_id.toUpperCase(), `%${whatsapp.replace(/\D/g, '').slice(-8)}%`]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data validasi tidak cocok atau pesanan tidak ditemukan.' });
    }

    // Jika sudah lunas atau ditolak tidak bisa di minta batal secara langsung
    if (rows[0].status === 'rejected') {
      return res.status(400).json({ success: false, message: 'Pesanan sudah dibatalkan sebelumnya.' });
    }

    await db.query('UPDATE bookings SET status = ? WHERE id = ?', ['request_cancel', booking_id.toUpperCase()]);
    res.json({ success: true, message: 'Permintaan pembatalan berhasil diajukan ke admin.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * GET /api/bookings
 * Ambil semua pesanan (admin only)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * GET /api/bookings/:id
 * Ambil detail pesanan (admin only)
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * PATCH /api/bookings/:id/status
 * Update status pesanan: pending | paid | rejected | request_cancel (admin only)
 */
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'rejected', 'request_cancel'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid. Gunakan: pending, paid, rejected, request_cancel.' });
    }

    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: `Status pesanan berhasil diubah ke "${status}".` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * DELETE /api/bookings/:id
 * Hapus pesanan (admin only)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Pesanan berhasil dihapus.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
