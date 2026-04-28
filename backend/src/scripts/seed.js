require('dotenv').config();
const bcrypt = require('bcryptjs');

const { connectDB, mongoose } = require('../config/db');
const Admin = require('../models/Admin');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Setting = require('../models/Setting');

const ROOMS = [
  {
    _id: 'standard',
    name: 'Kamar Standar',
    description: 'Nyaman dan asri, sempurna untuk pelancong solo atau perjalanan bisnis singkat.',
    price: 450000,
    image_url: 'https://picsum.photos/seed/standard/800/600',
    features: ['Tempat Tidur Queen', 'Wi-Fi Gratis', 'Pemandangan Kota', 'TV Layar Datar 42 Inch'],
    gallery_urls: [
      'https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/bf7/5d1a16bf71e05223571642.jpg',
      'https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/b21/5d1a16b216a14097469197.jpg',
    ],
    available: true, total: 10, booked: 3,
  },
  {
    _id: 'deluxe',
    name: 'Kamar Deluxe',
    description: 'Kamar luas dengan fasilitas modern dan pemandangan cakrawala kota yang indah.',
    price: 650000,
    image_url: 'https://picsum.photos/seed/deluxe/800/600',
    features: ['Tempat Tidur King', 'Mini Bar', 'Pemandangan Kota', 'Mesin Kopi'],
    gallery_urls: [
      'https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/bf7/5d1a16bf71e05223571642.jpg',
      'https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/b21/5d1a16b216a14097469197.jpg',
    ],
    available: true, total: 8, booked: 5,
  },
  {
    _id: 'executive',
    name: 'Suite Eksekutif',
    description: 'Kenyamanan premium dengan ruang tamu terpisah dan akses lounge eksklusif.',
    price: 1200000,
    image_url: 'https://picsum.photos/seed/executive/800/600',
    features: ['Tempat Tidur King', 'Ruang Tamu', 'Akses Lounge'],
    gallery_urls: [
      'https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/bf7/5d1a16bf71e05223571642.jpg',
      'https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/b21/5d1a16b216a14097469197.jpg',
    ],
    available: false, total: 4, booked: 4,
  },
  {
    _id: 'family',
    name: 'Suite Keluarga',
    description: 'Dua kamar terhubung yang dirancang untuk keluarga, menawarkan ruang yang leluasa.',
    price: 1500000,
    image_url: 'https://picsum.photos/seed/family/800/600',
    features: ['2 Tempat Tidur Queen', 'Ruang Makan', 'Bathtub'],
    gallery_urls: [
      'https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/bf7/5d1a16bf71e05223571642.jpg',
      'https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/b21/5d1a16b216a14097469197.jpg',
    ],
    available: true, total: 2, booked: 0,
  },
  {
    _id: 'presidential',
    name: 'Suite Presidensial',
    description: 'Pengalaman terbaik dengan fasilitas eksklusif dan pemandangan terbaik kota.',
    price: 3500000,
    image_url: 'https://picsum.photos/seed/presidential/800/600',
    features: ['Tempat Tidur King', 'Jacuzzi', 'Butler Service', 'Ruang VIP'],
    gallery_urls: [
      'https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/bf7/5d1a16bf71e05223571642.jpg',
      'https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/b21/5d1a16b216a14097469197.jpg',
    ],
    available: false, total: 1, booked: 0,
  },
];

const BOOKINGS = [
  {
    _id: 'BK-1001', guest_name: 'Budi Santoso', guest_email: 'budi@email.com', guest_phone: '+62 812-1111-2222',
    room_id: 'executive', room_type: 'Suite Eksekutif',
    check_in: '2026-04-24', check_out: '2026-04-26',
    total_price: 2400000, status: 'pending', notes: 'Minta tambahan bantal',
  },
  {
    _id: 'BK-1002', guest_name: 'Sarah Wijaya', guest_email: 'sarah@email.com', guest_phone: '+62 813-2222-3333',
    room_id: 'deluxe', room_type: 'Kamar Deluxe',
    check_in: '2026-04-25', check_out: '2026-04-27',
    total_price: 1300000, status: 'paid', notes: '-',
  },
  {
    _id: 'BK-1003', guest_name: 'Andi Pratama', guest_email: 'andi@email.com', guest_phone: '+62 814-3333-4444',
    room_id: 'standard', room_type: 'Kamar Standar',
    check_in: '2026-04-26', check_out: '2026-04-28',
    total_price: 900000, status: 'paid', notes: 'Check-in malam jam 21:00',
  },
];

const SETTINGS = [
  { setting_key: 'hotel_name', setting_value: 'Hotel Citycome' },
  { setting_key: 'hotel_phone', setting_value: '+62 000-0000-0000' },
  { setting_key: 'hotel_email', setting_value: 'info@citycome.com' },
  { setting_key: 'hotel_address', setting_value: 'Jakarta, Indonesia' },
  { setting_key: 'landing_hero_image_url', setting_value: 'https://picsum.photos/seed/hotelhero/1920/1080?blur=2' },
  { setting_key: 'landing_hero_title', setting_value: 'Simfoni Kenyamanan' },
  { setting_key: 'landing_hero_description', setting_value: 'Rasakan kemuliaan dan ketenangan yang tak tertandingi di Hotel Citycome. Liburan sempurna Anda dimulai di sini.' },
  { setting_key: 'landing_hero_cta_primary_text', setting_value: 'Pesan Kamar' },
  { setting_key: 'landing_hero_cta_secondary_text', setting_value: 'Jelajahi Kamar' },
  { setting_key: 'landing_gallery_title', setting_value: 'Galeri Kami' },
  { setting_key: 'landing_gallery_subtitle', setting_value: 'Intip sekilas keindahan dan kenyamanan yang menanti Anda di Hotel Citycome.' },
  {
    setting_key: 'landing_gallery_images',
    setting_value: JSON.stringify([
      'https://picsum.photos/seed/gallery1/800/800',
      'https://picsum.photos/seed/gallery2/400/400',
      'https://picsum.photos/seed/gallery3/400/400',
      'https://picsum.photos/seed/gallery4/400/400',
      'https://picsum.photos/seed/gallery5/400/400',
    ]),
  },
];

async function main() {
  await connectDB();

  console.log('→ Seeding admin ...');
  const passwordHash = await bcrypt.hash('admin123', 10);
  await Admin.updateOne(
    { username: 'admin' },
    { $set: { username: 'admin', password: passwordHash } },
    { upsert: true }
  );

  console.log('→ Seeding rooms ...');
  for (const r of ROOMS) {
    await Room.findByIdAndUpdate(r._id, r, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  console.log('→ Seeding bookings ...');
  for (const b of BOOKINGS) {
    await Booking.findByIdAndUpdate(
      b._id,
      { ...b, check_in: new Date(b.check_in), check_out: new Date(b.check_out) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log('→ Seeding settings ...');
  for (const s of SETTINGS) {
    await Setting.findOneAndUpdate(
      { setting_key: s.setting_key },
      { $set: s },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log('✅ Seed selesai.');
  console.log('   Login admin: username=admin, password=admin123');
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('❌ Seed gagal:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
