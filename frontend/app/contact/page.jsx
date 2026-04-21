import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f0]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Kiri: Informasi Kontak */}
          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#2d2d2a] mb-6">Hubungi Kami</h1>
            <p className="text-gray-500 mb-10 leading-relaxed text-sm md:text-base">
              Kami siap membantu menciptakan pengalaman menginap yang tak terlupakan untuk Anda.
              Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan, permintaan khusus, atau sekadar
              ingin merencanakan kejutan untuk kunjungan Anda berikutnya.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#5A5A40]/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-[#5A5A40] w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Alamat</h3>
                  <p className="text-[#2d2d2a] font-medium leading-relaxed text-sm">
                    Jl. Jenderal Sudirman No. 123<br />
                    Kawasan SCBD, Jakarta Pusat<br />
                    Indonesia 10220
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#5A5A40]/10 flex items-center justify-center shrink-0">
                  <Phone className="text-[#5A5A40] w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Telepon & WhatsApp</h3>
                  <p className="text-[#2d2d2a] font-medium text-sm">+62 811-2222-3333</p>
                  <p className="text-[#2d2d2a] font-medium text-sm">+62 21 555 1234 (Resepsionis)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#5A5A40]/10 flex items-center justify-center shrink-0">
                  <Mail className="text-[#5A5A40] w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Email</h3>
                  <p className="text-[#2d2d2a] font-medium text-sm">hello@citycome.com</p>
                  <p className="text-[#2d2d2a] font-medium text-sm">reservations@citycome.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#5A5A40]/10 flex items-center justify-center shrink-0">
                  <Clock className="text-[#5A5A40] w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Layanan Resepsionis</h3>
                  <p className="text-[#2d2d2a] font-medium text-sm">24 Jam / 7 Hari</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kanan: Form Hubungi Kami */}
          <div className="bg-white p-8 md:p-10 rounded-[32px] border border-black/5 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2a] mb-6">Kirimkan Pesan</h2>
            <form className="space-y-5">
              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider mb-2 text-[#2d2d2a]">Nama Lengkap</label>
                <input type="text" placeholder="Nama Budi" className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a] placeholder-gray-400" />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider mb-2 text-[#2d2d2a]">Alamat Email</label>
                <input type="email" placeholder="budi@email.com" className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a] placeholder-gray-400" />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider mb-2 text-[#2d2d2a]">Subjek</label>
                <input type="text" placeholder="Pertanyaan tentang reservasi..." className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a] placeholder-gray-400" />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider mb-2 text-[#2d2d2a]">Pesan Anda</label>
                <textarea rows={4} placeholder="Silakan tuliskan detail pesan atau keluhan Anda di sini..." className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a] placeholder-gray-400 resize-none"></textarea>
              </div>

              <button type="button" className="w-full bg-[#5A5A40] text-white py-4 mt-2 rounded-full font-bold shadow-md hover:bg-black transition-colors uppercase tracking-widest text-xs flex justify-center items-center">
                Kirim Pesan
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
