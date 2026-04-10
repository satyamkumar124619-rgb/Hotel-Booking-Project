const mongoose = require('mongoose');

// GET /api/admin/stats — returns totals for dashboard
exports.getStats = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const [totalBookings, totalRooms, totalCustomers] = await Promise.all([
      db.collection('bookings').countDocuments(),
      db.collection('rooms').countDocuments(),
      db.collection('users').countDocuments(),
    ]);

    // Total revenue from non-cancelled bookings
    const revenueResult = await db.collection('bookings').aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]).toArray();

    const totalRevenue = revenueResult[0]?.total || 0;

    // Recent 5 bookings for activity feed
    const recentBookings = await db.collection('bookings')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    res.json({
      success: true,
      stats: { totalBookings, totalRooms, totalCustomers, totalRevenue },
      recentBookings,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: error.message });
  }
};
