const db = require('./src/config/db');

async function migrate() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT NOT NULL
      )
    `);

    const defaults = [
      ['hotel_name', 'Hotel Citycome'],
      ['contact_email', 'hello@citycome.com'],
      ['contact_phone', '+62 811-2222-3333'],
      ['address', 'Jl. Jenderal Sudirman No. 123, Jakarta Pusat, Indonesia'],
      ['wa_template', 'Halo [NAMA_TAMU]!\nTerima kasih telah melakukan pemesanan di Hotel Citycome. ID Booking Anda adalah [BOOKING_ID].\n\nUntuk menyelesaikan pemesanan, silakan transfer sebesar [TOTAL_HARGA] ke rekening BCA 123456789 a.n Hotel Citycome.']
    ];

    for (const [k, v] of defaults) {
      await db.query('INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)', [k, v]);
    }
    console.log("Migration settings table done.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
