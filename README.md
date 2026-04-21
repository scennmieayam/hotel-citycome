# Hotel Citycome

Project ini sekarang menggunakan struktur monorepo sederhana:

- `frontend/` -> Next.js app (deploy ke Vercel)
- `backend/` -> Express API (deploy ke Railway)

## Jalankan di Linux (local)

Prasyarat:
- Node.js 18+
- npm
- MySQL berjalan di local atau server

### 1) Jalankan backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2) Jalankan frontend

Buka terminal baru:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend biasanya jalan di `http://localhost:3000`.

## Deploy (recommended)

- Frontend: Vercel (root directory: `frontend`)
- Backend: Railway (root directory: `backend`)

Pastikan URL API di frontend diarahkan ke domain backend production.
