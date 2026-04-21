const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/dashboard
 */
router.get('/', authenticateToken, async (_req, res) => {
  try {
    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total_price' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const newOrders = await Booking.countDocuments({ status: 'pending' });

    const roomTotals = await Room.aggregate([
      { $group: { _id: null, room_count: { $sum: 1 }, total_stok: { $sum: '$total' } } },
    ]);
    const totalRooms = Number(roomTotals[0]?.total_stok) || 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeOccupancy = await Booking.countDocuments({
      status: { $in: ['pending', 'paid'] },
      check_out: { $gte: today },
    });

    const recentBookings = await Booking.find().sort({ created_at: -1 }).limit(5);

    const availableRooms = totalRooms - activeOccupancy;
    const occupancyRate = Math.round((activeOccupancy / totalRooms) * 100);

    res.json({
      success: true,
      data: {
        total_revenue: totalRevenue,
        new_orders: newOrders,
        rooms_available: availableRooms,
        rooms_total: totalRooms,
        occupancy_rate: occupancyRate > 100 ? 100 : occupancyRate,
        recent_bookings: recentBookings.map((b) => b.toJSON()),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
