"use client";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, AlertCircle } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function StatusPage() {
  const [bookingId, setBookingId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [statusResult, setStatusResult] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bookingId || !whatsapp) return;
    
    setStatusResult('loading');
    try {
      const res = await fetchApi(`/bookings/check?booking_id=${encodeURIComponent(bookingId)}&whatsapp=${encodeURIComponent(whatsapp)}`);
      if (res.success && res.data) {
        setBookingData(res.data);
        setStatusResult('found');
        setShowCancelModal(false);
      } else {
        setStatusResult('not_found');
      }
    } catch (err) {
      console.error(err);
      setStatusResult('not_found');
    }
  };

  const handleConfirmCancel = async () => {
    try {
      const res = await fetchApi('/bookings/cancel_request', {
        method: 'POST',
        body: JSON.stringify({ booking_id: bookingData.id, whatsapp: whatsapp })
      });
      if (res.success) {
        setStatusResult('canceled');
        setShowCancelModal(false);
      } else {
        alert("Gagal membatalkan: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan sistem saat membatalkan.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white p-8 md:p-12 rounded-[32px] border border-black/5 shadow-sm max-w-2xl mx-auto flex flex-col gap-6">
          <div className="text-center mb-2">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2d2d2a] mb-2">Pencarian Kamar</h1>
            <p className="text-xs text-gray-500">
              Masukkan ID Pesanan (Booking ID) dan nomor WhatsApp Anda untuk melihat detail reservasi.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#2d2d2a]">Booking ID</label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="Contoh: BK-1001"
                className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a] placeholder-gray-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#2d2d2a]">Nomor WhatsApp</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Contoh: 08112222333"
                className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a] placeholder-gray-400"
                required
              />
            </div>

            <button type="submit" disabled={statusResult === 'loading'} className="w-full bg-[#5A5A40] text-white py-4 mt-2 rounded-full font-bold shadow-md hover:bg-black transition-colors uppercase tracking-widest text-xs flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {statusResult === 'loading' ? 'Mencari...' : <><Search className="w-4 h-4" /> Cari Pesanan</>}
            </button>
          </form>

          {statusResult === 'not_found' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-bold mb-1">Pesanan tidak ditemukan</p>
                <p className="text-xs">Kami tidak dapat menemukan reservasi yang cocok dengan detail tersebut. Harap periksa ID Pesanan dan nomor WhatsApp Anda, lalu coba lagi.</p>
              </div>
            </div>
          )}

          {statusResult === 'found' && bookingData && (
            <div className="mt-4 bg-[#f5f5f0] p-6 rounded-3xl border border-black/5">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-black/5">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#2d2d2a] mb-1">{bookingData.room_type}</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Booking ID: <span className="font-bold">{bookingData.id}</span></p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${bookingData.status === 'paid' ? 'bg-green-100 text-green-800' : bookingData.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                  {bookingData.status === 'paid' ? 'LUNAS' : bookingData.status === 'rejected' ? 'BATAL' : 'MENUNGGU BATAS'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Cek Masuk</p>
                  <p className="font-medium text-[#2d2d2a]">{new Date(bookingData.check_in).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Cek Keluar</p>
                  <p className="font-medium text-[#2d2d2a]">{new Date(bookingData.check_out).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Tamu</p>
                  <p className="font-medium text-[#2d2d2a]">{bookingData.guest_name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Total Biaya</p>
                  <p className="font-medium text-[#2d2d2a]">Rp {Number(bookingData.total_price).toLocaleString('id-ID')}</p>
                </div>
              </div>

              {bookingData.status !== 'rejected' && (
                <div className="mt-8 pt-6 border-t border-black/5 flex justify-center">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="text-[10px] uppercase tracking-widest font-bold text-red-600 hover:text-red-800 transition-colors underline underline-offset-4"
                  >
                    Minta Pembatalan Pesanan
                  </button>
                </div>
              )}
            </div>
          )}

          {statusResult === 'canceled' && (
            <div className="mt-4 bg-gray-50 p-6 md:p-8 rounded-3xl border border-black/5 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2d2d2a] mb-2">Pesanan Dibatalkan</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Permintaan pembatalan dengan ID <span className="font-bold">{bookingData?.id || bookingId}</span> sedang diproses. Admin kami akan segera menghubungi Anda.
              </p>

              <div className="bg-white p-4 md:p-6 rounded-2xl border border-black/5 mb-6 text-left shadow-sm">
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#5A5A40] mb-2">Informasi Pengembalian Dana (Refund)</h4>
                <p className="text-sm text-[#2d2d2a]/80 leading-relaxed mb-4">
                  Sesuai dengan <a href="/terms" className="text-[#5A5A40] font-semibold underline underline-offset-2">Syarat & Ketentuan</a> yang berlaku, Anda mungkin memenuhi syarat untuk mendapatkan pengembalian dana <i>(refund)</i> sebagian atau penuh tergantung pada waktu pembatalan.
                </p>
                <div className="flex items-start gap-3 bg-[#f5f5f0] p-4 rounded-xl">
                  <div className="shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#2d2d2a] mb-1">Hubungi WhatsApp Resmi Kami:</p>
                    <a href="https://wa.me/6281122223333" target="_blank" rel="noreferrer" className="text-sm font-bold text-green-600 hover:text-green-700">
                      +62 811-2222-3333
                    </a>
                    <p className="text-[10px] text-gray-500 mt-1">Sertakan ID Booking ({bookingData?.id || bookingId}) Anda saat menghubungi admin.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setStatusResult(null); setBookingId(""); setWhatsapp(""); }}
                className="text-[10px] uppercase tracking-widest font-bold text-[#5A5A40] hover:text-black transition-colors"
              >
                &larr; Kembali ke Pencarian
              </button>
            </div>
          )}
        </div>
      </main>

      {/* CANCELLATION MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-black/5 relative">
            <h3 className="font-serif text-2xl font-bold text-[#2d2d2a] mb-2">Minta Pembatalan</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Apakah Anda yakin ingin membatalkan pesanan ini? Notifikasi akan diteruskan ke Admin untuk diulas.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmCancel}
                className="w-full bg-red-600 text-white py-3 rounded-full font-bold shadow-md hover:bg-red-700 transition-colors uppercase tracking-widest text-xs"
              >
                Ya, Batalkan Pesanan
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full bg-gray-100 text-[#2d2d2a] py-3 rounded-full font-bold hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs"
              >
                Tidak, Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
