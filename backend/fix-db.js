const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hotel_citycome'
    });

    console.log('Connected to DB.');
    await connection.query("ALTER TABLE bookings MODIFY status ENUM('pending', 'paid', 'rejected', 'request_cancel') DEFAULT 'pending'");
    console.log('Enum updated successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

fixDb();
