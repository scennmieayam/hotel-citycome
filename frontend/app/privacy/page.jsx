import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white p-8 md:p-16 rounded-[32px] border border-black/5 shadow-sm">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#2d2d2a] mb-6">Kebijakan Privasi</h1>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-10 pb-6 border-b border-black/5">Terakhir Diperbarui: 20 April 2026</p>

          <div className="space-y-8 text-[#2d2d2a]/80 leading-relaxed text-sm">
            <section>
              <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-4">1. Pengumpulan Informasi</h2>
              <p>
                Kami di Hotel Citycome mengumpulkan informasi pribadi yang secara sukarela Anda berikan kepada kami saat mendaftar
                di situs web, mengekspresikan minat dalam memperoleh informasi tentang kami atau produk dan layanan kami, atau saat melakukan reservasi.
                Informasi ini mencakup nama, alamat email, nomor telepon (WhatsApp), dan detail permintaan kamar.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-4">2. Penggunaan Informasi</h2>
              <p className="mb-2">Informasi yang kami kumpulkan digunakan untuk berbagai tujuan, termasuk:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Memfasilitasi dan mengelola pesanan kamar Anda.</li>
                <li>Menghubungi Anda terkait konfirmasi pembayaran dan kedatangan.</li>
                <li>Mengirimkan informasi pemasaran atau penawaran promosi khusus (jika Anda berlangganan).</li>
                <li>Meningkatkan pengalaman pengguna di situs web kami.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-4">3. Perlindungan Data</h2>
              <p>
                Kami telah menerapkan langkah-langkah keamanan teknis dan organisasi yang dirancang untuk melindungi
                keamanan setiap informasi pribadi yang kami proses. Meskipun demikian, perlu diingat bahwa tidak ada
                transmisi elektronik melalui internet yang dapat dijamin 100% aman, sehingga kami tidak dapat menjanjikan
                atau menjamin keamanan mutlak data Anda.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-4">4. Kebijakan Berbagi Pihak Ketiga</h2>
              <p>
                Kami <strong>tidak pernah menjual</strong>, memperdagangkan, atau menyewakan informasi identitas pribadi Anda
                kepada pihak lain. Kami mungkin membagikan informasi dengan mitra layanan terpercaya (seperti gateway pembayaran)
                hanya sedalam yang diperlukan untuk melayani transaksi Anda.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
