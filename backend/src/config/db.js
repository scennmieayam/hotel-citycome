const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotel_citycome',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

// Test koneksi
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL terhubung ke database:', process.env.DB_NAME);
    conn.release();
  })
  .catch(err => {
    console.error('❌ Gagal koneksi MySQL:', err.message);
  });

module.exports = pool;
