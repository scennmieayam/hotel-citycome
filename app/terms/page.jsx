import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white p-8 md:p-16 rounded-[32px] border border-black/5 shadow-sm">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#2d2d2a] mb-6">Ketentuan Layanan</h1>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-10 pb-6 border-b border-black/5">Terakhir Diperbarui: 20 April 2026</p>

          <div className="space-y-8 text-[#2d2d2a]/80 leading-relaxed text-sm">
            <section>
              <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-4">1. Reservasi & Pembayaran</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Semua harga kamar yang tertera adalah dalam mata uang Rupiah (IDR) dan dapat berubah tanpa pemberitahuan sebelumnya.</li>
                <li>Reservasi hanya dianggap sah setelah pembayaran penuh atau deposit diterima dan dikonfirmasi melalui sistem WhatsApp kami.</li>
                <li>Ketidakpatuhan dalam membayar batas waktu tagihan akan mengakibatkan pembatalan otomatis (Status: Batal).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-4">2. Check-in & Check-out</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Waktu Check-in:</strong> Mulai pukul 14:00 waktu setempat.</li>
                <li><strong>Waktu Check-out:</strong> Maksimal pukul 12:00 siang waktu setempat.</li>
                <li>Keterlambatan check-out tanpa persetujuan pihak Hotel Citycome dapat dikenakan biaya tambahan harian atau biaya per jam operasional.</li>
                <li>Tamu diwajibkan menunjukkan kartu identitas resmi dan kode booking saat melakukan check-in di resepsionis.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-4">3. Kebijakan Pembatalan (Refund)</h2>
              <p>
                Kami memahami bahwa rencana perjalanan dapat berubah. Pembatalan yang dilakukan paling lambat 72 jam sebelum tanggal check-in
                akan mendapatkan pengembalian dana 100%. Pembatalan dalam kurun waktu 24-72 jam akan mengakibatkan penalti sebesar 50% dari total tagihan.
                Ketidakhadiran <em>(No-show)</em> pada hari H tidak memenuhi syarat untuk pengembalian dana jenis apa pun.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-4">4. Peraturan Hotel Lainnya</h2>
              <p>
                Dilarang membawa hewan peliharaan apa pun ke dalam area kamar maupun public space hotel. Hotel Citycome menetapkan semua kamar
                sebagai <strong>Kawasan Bebas Asap Rokok</strong> (Non-smoking Rooms). Merokok di dalam kamar akan dikenakan denda pembersihan.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
