import { Instagram, Twitter, Facebook } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#f5f5f0] text-gray-500 pt-16 pb-8 px-4 md:px-8 border-t border-black/5 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          <div className="md:col-span-1">
            <span className="font-serif text-2xl font-bold text-[#2d2d2a] block mb-4">
              Citycome
            </span>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 leading-relaxed mb-6">
              Istirahat lebih tenang, pesan lebih cepat. Solusi menginap modern untuk kenyamanan Anda.
            </p>
          </div>

          <div>
            <h4 className="text-[#2d2d2a] text-[10px] font-bold tracking-widest uppercase mb-4">Jelajahi</h4>
            <ul className="space-y-3 text-xs tracking-wider">
              <li><Link href="/#rooms" className="hover:text-[#5A5A40] transition-colors">Kamar & Suite</Link></li>
              <li><Link href="/#about" className="hover:text-[#5A5A40] transition-colors">Kisah Kami</Link></li>
              <li><Link href="/#gallery" className="hover:text-[#5A5A40] transition-colors">Galeri</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#2d2d2a] text-[10px] font-bold tracking-widest uppercase mb-4">Layanan Tamu</h4>
            <ul className="space-y-3 text-xs tracking-wider">
              <li><Link href="/status" className="hover:text-[#5A5A40] transition-colors">Cek Status Pesanan</Link></li>
              <li><Link href="/contact" className="hover:text-[#5A5A40] transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#2d2d2a] text-[10px] font-bold tracking-widest uppercase mb-4">Terhubung</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#5A5A40] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#5A5A40] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-black/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-gray-400 gap-4 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Hotel Citycome. KennDevelaper.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="hover:text-[#5A5A40] transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-[#5A5A40] transition-colors">Ketentuan Layanan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
