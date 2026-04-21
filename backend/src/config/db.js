const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  const uri = (process.env.MONGODB_URI || '').trim();
  if (!uri) {
    throw new Error('MONGODB_URI belum di-set di .env');
  }
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error('Format MONGODB_URI tidak valid (harus mongodb:// atau mongodb+srv://)');
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (err) {
    const isAuthError = err?.message?.toLowerCase().includes('bad auth');
    const isTimeout = err?.name === 'MongooseServerSelectionError';
    if (isAuthError) {
      throw new Error('Autentikasi MongoDB gagal. Cek username/password pada MONGODB_URI');
    }
    if (isTimeout) {
      throw new Error('Koneksi ke cluster MongoDB timeout. Cek IP access list Atlas dan jaringan internet');
    }
    throw err;
  }

  console.log('✅ MongoDB terhubung:', mongoose.connection.name);
}

module.exports = { connectDB, mongoose };
