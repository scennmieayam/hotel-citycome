import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import Image from "next/image";
import { Wifi, Tv, Wind, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default async function RoomDetail({ params }) {
  const resolvedParams = await params;
  const roomId = resolvedParams.id;

  let room = null;
  try {
    const res = await fetch(`${API_URL}/rooms/${roomId}`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success && data.data) {
      room = data.data;
      room.features = typeof room.features === 'string' ? JSON.parse(room.features) : (room.features || []);
      // Mengisi field tambahan yang tidak ada di DB tapi dibutuhkan oleh UI
      room.gallery = [
        "https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/bf7/5d1a16bf71e05223571642.jpg",
        "https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/b21/5d1a16b216a14097469197.jpg",
      ];
      room.size = roomId === 'family' || roomId === 'presidential' ? "50+ m²" : "24-32 m²";
      room.occupancy = roomId === 'family' || roomId === 'presidential' ? "Keluarga/Grup" : "1-2 Dewasa";
      room.image =
        room.image_url ||
        "https://www.ketapangindahhotel.com/storage/app/uploads/public/5d1/a16/bf7/5d1a16bf71e05223571642.jpg";
    }
  } catch (err) {
    console.error("Gagal mengambil detail kamar:", err);
  }

  if (!room) {
    return (
      <div className="flex flex-col min-h-screen text-center py-40">
        <Navbar />
        <h1 className="text-3xl font-bold font-serif mb-4 text-[#2d2d2a]">Kamar Tidak Ditemukan</h1>
        <Link href="/" className="text-[#5A5A40] underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-20">

        {/* Banner Image */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-end">
          <Image
            src={room.image}
            alt={room.name}
            fill
            className="object-cover absolute inset-0 z-0"
            referrerPolicy="no-referrer"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2d2d2a]/80 via-transparent to-transparent z-10"></div>

          <div className="relative z-20 px-4 md:px-8 w-full max-w-7xl mx-auto pb-12">
            <Link href="/" className="inline-flex items-center text-white/80 hover:text-white text-[10px] font-bold tracking-widest uppercase mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Katalog
            </Link>
            <h1 className="font-serif text-5xl md:text-7xl text-white font-bold mb-4">{room.name}</h1>
            <p className="text-white/90 text-sm md:text-base max-w-2xl font-serif italic text-xl">Mulai dari Rp {room.price.toLocaleString('id-ID')} / Malam</p>
          </div>
        </section>

        {/* Details & Booking */}
        <section className="py-16 px-4 md:px-8 bg-[#f5f5f0]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left Content: Info */}
            <div className="lg:col-span-2 flex flex-col gap-12">
              <div>
                <h2 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Tentang Ruangan Ini</h2>
                <p className="text-[#2d2d2a] leading-relaxed text-sm md:text-base">{room.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-black/5">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Ukuran</p>
                  <p className="font-bold text-[#2d2d2a]">{room.size}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Kapasitas</p>
                  <p className="font-bold text-[#2d2d2a]">{room.occupancy}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Ranjang</p>
                  <p className="font-bold text-[#2d2d2a]">{room.features[0]}</p>
                </div>
              </div>

              <div>
                <h2 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-6">Fasilitas Termasuk</h2>
                <div className="grid grid-cols-2 gap-4">
                  {room.features.map((feature) => (
                    <div key={feature} className="flex items-center text-sm text-[#2d2d2a]">
                      <Check className="w-4 h-4 text-[#5A5A40] mr-3" />
                      {feature}
                    </div>
                  ))}
                  <div className="flex items-center text-sm text-[#2d2d2a]">
                    <Check className="w-4 h-4 text-[#5A5A40] mr-3" />
                    Penyejuk Udara (AC)
                  </div>
                  <div className="flex items-center text-sm text-[#2d2d2a]">
                    <Check className="w-4 h-4 text-[#5A5A40] mr-3" />
                    Brankas Eksekutif
                  </div>
                </div>
              </div>

              {/* Gallery Mini */}
              <div className="grid grid-cols-2 gap-4">
                {room.gallery.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content: Sidebar Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <h3 className="font-serif text-2xl font-bold text-[#2d2d2a] mb-6 hidden lg:block">Formulir Pemesanan</h3>
                <BookingForm preselectedRoom={roomId} />
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
