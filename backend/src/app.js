require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const roomsRoutes = require('./routes/rooms');
const bookingsRoutes = require('./routes/bookings');
const dashboardRoutes = require('./routes/dashboard');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// MIDDLEWARE
// =====================
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    /\.vercel\.app$/, // izinkan semua subdomain vercel
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (Images)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// =====================
// ROUTES
// =====================
app.get('/', (req, res) => {
  res.json({
    message: '🏨 Hotel Citycome API - v1.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth/login',
      rooms: '/api/rooms',
      bookings: '/api/bookings',
      dashboard: '/api/dashboard',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// =====================
// 404 HANDLER
// =====================
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

// =====================
// ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
  console.log(`🚀 Hotel Citycome Backend running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
