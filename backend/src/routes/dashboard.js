const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/dashboard
 * Ambil statistik utama untuk dashboard admin
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Total pendapatan dari pesanan yang lunas
    const [[revenue]] = await db.query(
      "SELECT COALESCE(SUM(total_price), 0) AS total FROM bookings WHERE status = 'paid'"
    );

    // Jumlah pesanan baru (pending)
    const [[newOrders]] = await db.query(
      "SELECT COUNT(*) AS count FROM bookings WHERE status = 'pending'"
    );

    // Kamar tersedia vs total (menggunakan kolom total di DB)
    const [[roomStats]] = await db.query(
      'SELECT COUNT(*) AS room_count, COALESCE(SUM(total), 5) AS total_stok FROM rooms'
    );

    // Tingkat okupansi
    const [[ocupancy]] = await db.query(
      "SELECT COUNT(*) AS active FROM bookings WHERE status IN ('pending', 'paid') AND check_out >= CURDATE()"
    );

    // 5 pesanan terbaru
    const [recentBookings] = await db.query(
      'SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5'
    );

    const totalRooms = Number(roomStats.total_stok) || 1;
    const activeOccupancy = Number(ocupancy.active) || 0;
    const availableRooms = totalRooms - activeOccupancy; 
    const occupancyRate = Math.round((activeOccupancy / totalRooms) * 100);

    res.json({
      success: true,
      data: {
        total_revenue: Number(revenue.total) || 0,
        new_orders: Number(newOrders.count) || 0,
        rooms_available: availableRooms,
        rooms_total: totalRooms,
        occupancy_rate: occupancyRate > 100 ? 100 : occupancyRate,
        recent_bookings: recentBookings,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
