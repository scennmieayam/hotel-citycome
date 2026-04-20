-- =====================================================
-- DATABASE SETUP: Hotel Citycome
-- Jalankan script ini di MySQL sebelum memulai backend
-- =====================================================

CREATE DATABASE IF NOT EXISTS hotel_citycome
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hotel_citycome;

-- =====================
-- TABEL: admins
-- =====================
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- TABEL: rooms
-- =====================
CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price INT NOT NULL,
  image_url VARCHAR(500),
  features JSON,
  available BOOLEAN DEFAULT true,
  total INT DEFAULT 1 COMMENT 'Total unit kamar tipe ini',
  booked INT DEFAULT 0 COMMENT 'Jumlah yang sedang dipesan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================
-- TABEL: bookings
-- =====================
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(20) PRIMARY KEY COMMENT 'Format: BK-XXXXX',
  guest_name VARCHAR(100) NOT NULL,
  guest_email VARCHAR(100),
  guest_phone VARCHAR(30),
  room_id VARCHAR(50),
  room_type VARCHAR(100),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price BIGINT DEFAULT 0,
  status ENUM('pending', 'paid', 'rejected', 'request_cancel') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- =====================
-- DATA AWAL: Rooms
-- =====================
INSERT IGNORE INTO rooms (id, name, description, price, image_url, features, available, total, booked)
VALUES
  ('standard', 'Kamar Standar',
   'Nyaman dan asri, sempurna untuk pelancong solo atau perjalanan bisnis singkat.',
   450000,
   'https://picsum.photos/seed/standard/800/600',
   '["Tempat Tidur Queen", "Wi-Fi Gratis", "Pemandangan Kota", "TV Layar Datar 42 Inch"]',
   true, 10, 3),

  ('deluxe', 'Kamar Deluxe',
   'Kamar luas dengan fasilitas modern dan pemandangan cakrawala kota yang indah.',
   650000,
   'https://picsum.photos/seed/deluxe/800/600',
   '["Tempat Tidur King", "Mini Bar", "Pemandangan Kota", "Mesin Kopi"]',
   true, 8, 5),

  ('executive', 'Suite Eksekutif',
   'Kenyamanan premium dengan ruang tamu terpisah dan akses lounge eksklusif.',
   1200000,
   'https://picsum.photos/seed/executive/800/600',
   '["Tempat Tidur King", "Ruang Tamu", "Akses Lounge"]',
   false, 4, 4),

  ('family', 'Suite Keluarga',
   'Dua kamar terhubung yang dirancang untuk keluarga, menawarkan ruang yang leluasa.',
   1500000,
   'https://picsum.photos/seed/family/800/600',
   '["2 Tempat Tidur Queen", "Ruang Makan", "Bathtub"]',
   true, 2, 0),

  ('presidential', 'Suite Presidensial',
   'Pengalaman terbaik dengan fasilitas eksklusif dan pemandangan terbaik kota.',
   3500000,
   'https://picsum.photos/seed/presidential/800/600',
   '["Tempat Tidur King", "Jacuzzi", "Butler Service", "Ruang VIP"]',
   false, 1, 0);

-- =====================
-- DATA AWAL: Admin
-- Password: admin123 (bcrypt hash)
-- Ganti hash ini setelah deploy menggunakan: node -e "require('bcryptjs').hash('password_baru',10).then(console.log)"
-- =====================
INSERT IGNORE INTO admins (username, password)
VALUES ('admin', '$2a$10$0wbTJrsux8d6iGK01/WfouLf/XGuQMpTGUYmd6U3OsUDUUfC5EQui');
-- password di atas adalah hash bcrypt dari: admin123
-- Untuk mengubah password: node -e "require('bcryptjs').hash('password_baru',10).then(console.log)"

-- =====================
-- CONTOH DATA BOOKING
-- =====================
INSERT IGNORE INTO bookings (id, guest_name, guest_email, guest_phone, room_id, room_type, check_in, check_out, total_price, status, notes)
VALUES
  ('BK-1001', 'Budi Santoso', 'budi@email.com', '+62 812-1111-2222', 'executive', 'Suite Eksekutif', '2026-04-24', '2026-04-26', 2400000, 'pending', 'Minta tambahan bantal'),
  ('BK-1002', 'Sarah Wijaya', 'sarah@email.com', '+62 813-2222-3333', 'deluxe', 'Kamar Deluxe', '2026-04-25', '2026-04-27', 1300000, 'paid', '-'),
  ('BK-1003', 'Andi Pratama', 'andi@email.com', '+62 814-3333-4444', 'standard', 'Kamar Standar', '2026-04-26', '2026-04-28', 900000, 'paid', 'Check-in malam jam 21:00');
