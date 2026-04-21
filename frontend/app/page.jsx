import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wifi, Coffee, MapPin, Wind } from "lucide-react";
import { API_URL } from "@/lib/api";

export default async function Home() {
  let rooms = [];
  try {
    const res = await fetch(`${API_URL}/rooms`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success) {
      // Pastikan data features dalam format JSON array yang diparse dengan benar
      rooms = data.data.map(room => ({
        ...room,
        features: typeof room.features === 'string' ? JSON.parse(room.features) : (room.features || [])
      }));
    }
  } catch (err) {
    console.error("Gagal mengambil data kamar:", err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative h-screen flex items-center justify-center pt-20 px-4 md:px-8 pb-4">
          <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-sm border border-black/5 flex items-end justify-center pb-24 md:pb-32">
            <Image
              src="https://picsum.photos/seed/hotelhero/1920/1080?blur=2"
              alt="Hotel Citycome Hero"
              fill
              className="object-cover absolute inset-0 z-0"
              referrerPolicy="no-referrer"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>

            <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-16">
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold leading-tight mb-6">
                Simfoni <br className="hidden md:block" /> Kenyamanan
              </h1>
              <p className="text-sm md:text-base text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Rasakan kemuliaan dan ketenangan yang tak tertandingi di Hotel Citycome. Liburan sempurna Anda dimulai di sini.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#book"
                  className="bg-white text-[#5A5A40] px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-lg"
                >
                  Pesan Kamar
                </Link>
                <Link
                  href="#rooms"
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white/20 transition-colors"
                >
                  Jelajahi Kamar
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* AMENITIES SUMMARY */}
        <section className="py-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-[32px] p-8 md:p-12 border border-black/5 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-gray-200">
              <div className="flex flex-col items-center text-center px-4">
                <Wifi className="w-6 h-6 text-[#5A5A40] mb-3" strokeWidth={1.5} />
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#2d2d2a]">Wi-Fi Kecepatan Tinggi</h3>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <Coffee className="w-6 h-6 text-[#5A5A40] mb-3" strokeWidth={1.5} />
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#2d2d2a]">Sarapan Harian</h3>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <Wind className="w-6 h-6 text-[#5A5A40] mb-3" strokeWidth={1.5} />
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#2d2d2a]">Spa & Kebugaran</h3>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <MapPin className="w-6 h-6 text-[#5A5A40] mb-3" strokeWidth={1.5} />
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#2d2d2a]">Lokasi Strategis</h3>
              </div>
            </div>
          </div>
        </section>

        {/* ROOMS PREVIEW */}
        <section id="rooms" className="py-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2d2d2a] mb-4">Akomodasi Kami</h2>
              <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                Dirancang untuk kenyamanan maksimal Anda. Pilih dari kamar dan suite kami yang ditata secara elegan.
              </p>
            </div>

            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar pl-4 md:pl-0 pr-4">
              {rooms.map((room) => (
                <div key={room.id} className={`shrink-0 w-[85vw] md:w-[320px] lg:w-[280px] snap-center group bg-white p-4 md:p-5 rounded-[32px] border border-black/5 shadow-sm flex flex-col transition-all duration-300 relative ${room.available ? 'hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(90,90,64,0.1)]' : 'opacity-70 grayscale-[40%]'}`}>
                  {!room.available && (
                    <div className="absolute top-8 right-8 bg-[#2d2d2a] text-white px-3 py-1 rounded-full text-[10px] font-bold z-10 shadow-lg tracking-widest uppercase">
                      Habis Terpesan
                    </div>
                  )}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4 bg-gray-100">
                    <Image
                      src={room.image_url || `https://picsum.photos/seed/${room.id}/800/600`}
                      alt={room.name}
                      fill
                      className={`object-cover transition-transform duration-700 ${room.available ? 'group-hover:scale-105' : ''}`}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col mb-2">
                    <h3 className="font-serif text-xl font-bold text-[#2d2d2a] mb-1">{room.name}</h3>
                    <p className="text-[10px] text-gray-500 block mb-3">Mulai dari Rp {room.price.toLocaleString("id-ID")} / malam</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-6 flex-grow leading-relaxed">{room.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.features.map((f) => (
                      <span key={f} className={`text-[10px] font-bold uppercase tracking-widest ${room.available ? 'text-[#5A5A40] bg-[#f5f5f0]' : 'text-gray-500 bg-gray-100'} px-3 py-1.5 rounded-full`}>
                        {f}
                      </span>
                    ))}
                  </div>

                  {room.available ? (
                    <Link
                      href={`/rooms/${room.id}`}
                      className="inline-flex items-center justify-between text-xs font-bold tracking-widest uppercase text-[#2d2d2a] group-hover:text-[#5A5A40] transition-colors w-full border-t border-black/5 pt-4"
                    >
                      Pilih Kamar <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center justify-between text-xs font-bold tracking-widest uppercase text-gray-400 w-full border-t border-black/5 pt-4 cursor-not-allowed">
                      Kamar Penuh <span className="text-[10px]">&times;</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-20 px-4 md:px-8 border-t border-black/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 relative aspect-square md:aspect-[4/5] rounded-[32px] overflow-hidden">
              <Image
                src="https://picsum.photos/seed/about/1000/1200"
                alt="Hotel Citycome Exterior"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2d2d2a] mb-6">Cerita Kami</h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Didirikan pada tahun 2012, Hotel Citycome lahir dari visi sederhana: untuk menyediakan lebih dari sekadar tempat tidur, tetapi serangkaian pengalaman yang mengesankan. Kami percaya setiap sentuhan, dari pelukan seprai yang baru kami rapikan, aroma kopi segar setiap pagi, dan senyuman sapaan staf kami bernilai penting untuk membuat Anda merasa di rumah.
              </p>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Di era di mana segala sesuatu terasa instan dan impersonal, hotel butik kami sengaja mengambil jalan memutar. Sebuah jalan yang lebih pelan, memikat, dan terlampau asri untuk dilupakan.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-black/5">
                <div>
                  <h4 className="font-serif text-3xl font-bold text-[#5A5A40] mb-2">10+</h4>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Tahun Pengalaman</p>
                </div>
                <div>
                  <h4 className="font-serif text-3xl font-bold text-[#5A5A40] mb-2">12rb</h4>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Tamu Tiba</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section id="gallery" className="py-20 px-4 md:px-8 border-t border-black/5 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2d2d2a] mb-4">Galeri Kami</h2>
              <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                Intip sekilas keindahan dan kenyamanan yang menanti Anda di Hotel Citycome.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 md:row-span-2 relative aspect-square md:aspect-auto rounded-3xl overflow-hidden group">
                <Image src="https://picsum.photos/seed/gallery1/800/800" alt="Lobby Hotel" fill className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden group">
                <Image src="https://picsum.photos/seed/gallery2/400/400" alt="Restaurant" fill className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden group">
                <Image src="https://picsum.photos/seed/gallery3/400/400" alt="Spa" fill className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden group">
                <Image src="https://picsum.photos/seed/gallery4/400/400" alt="Pool" fill className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden group">
                <Image src="https://picsum.photos/seed/gallery5/400/400" alt="Room View" fill className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </section>

        {/* BOOKING FORM */}
        <BookingForm />

      </main>

      <Footer />
    </div>
  );
}
