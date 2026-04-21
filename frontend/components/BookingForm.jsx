"use client";
import { useState, useEffect } from "react";
import { CheckCircle, MessageCircle, ArrowRight, QrCode, ArrowLeft } from "lucide-react";
import { fetchApi } from "@/lib/api";

export function BookingForm({ preselectedRoom = "standard" }) {
  const [formData, setFormData] = useState({
    roomType: preselectedRoom,
    name: "",
    whatsapp: "",
    email: "",
    checkIn: "",
    checkOut: "",
  });

  const [step, setStep] = useState(1); // 1 = Form, 2 = QRIS, 3 = Success
  const [bookingCode, setBookingCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchApi('/rooms')
      .then(res => { if (res.success) setRooms(res.data); })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Temukan nama kamar yang dipilih
    const roomInfo = rooms.find(r => r.id === formData.roomType);
    const roomName = roomInfo ? roomInfo.name : formData.roomType;

    try {
      const res = await fetchApi('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          guest_name: formData.name,
          guest_email: formData.email,
          guest_phone: formData.whatsapp,
          room_id: formData.roomType,
          room_type: roomName,
          check_in: formData.checkIn,
          check_out: formData.checkOut,
          total_price: total,
          notes: ''
        })
      });
      
      if (res.success) {
        setBookingCode(res.data.booking_id);
        setStep(2); // Lanjut ke halaman bayar
      }
    } catch (err) {
      alert("Kesalahan saat memesan kamar: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 1500);
  };

  const calculateDays = () => {
    if (!formData.checkIn || !formData.checkOut) return 1;
    const inDate = new Date(formData.checkIn);
    const outDate = new Date(formData.checkOut);
    const diffTime = outDate.getTime() - inDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();
  const selectedRoom = rooms.find(r => r.id === formData.roomType);
  const pricePerNight = selectedRoom ? selectedRoom.price : 450000;
  const total = pricePerNight * days;

  if (step === 2) {
    return (
      <section id="book" className="py-16 px-4 md:px-8 bg-[#f5f5f0]">
        <div className="max-w-xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-[32px] border border-black/5 shadow-sm flex flex-col items-center text-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#5A5A40]"></div>

            <div>
              <h2 className="font-serif text-3xl font-bold text-[#2d2d2a] mb-2">Pindai kode QRIS</h2>
              <p className="text-xs text-gray-500">
                Selesaikan pembayaran untuk mengamankan pesanan Anda.
              </p>
            </div>

            <div className="w-full bg-[#f5f5f0] p-8 rounded-3xl border border-black/5 flex flex-col items-center gap-4 justify-center">
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-black/5 relative">
                <QrCode size={200} strokeWidth={1} className="text-[#2d2d2a]" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2d2a] text-2xl md:text-3xl mt-1">Rp {total.toLocaleString('id-ID')}</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#5A5A40] mt-2">HOTEL CITYCOME (DUMMY QRIS)</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full mt-4">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-[#5A5A40] text-white py-4 px-8 rounded-full font-bold shadow-md hover:bg-black transition-colors uppercase tracking-widest text-xs flex justify-center disabled:opacity-50"
              >
                {isProcessing ? 'Memproses...' : 'Saya Sudah Membayar'}
              </button>
              <button
                onClick={() => setStep(1)}
                disabled={isProcessing}
                className="w-full flex justify-center items-center gap-2 py-4 px-8 rounded-full text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-[#2d2d2a] transition-colors"
              >
                <ArrowLeft size={16} /> Kembali ke Form
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (step === 3) {
    const waText = `Halo Citycome, saya telah melakukan pembayaran kamar via QRIS.\n\n*ID Booking*: ${bookingCode}\n*Nama*: ${formData.name}\n*Tipe*: ${formData.roomType}\n*Jadwal*: ${formData.checkIn} s/d ${formData.checkOut}\n*Total*: Rp ${total.toLocaleString('id-ID')}\n\nBersama ini saya lampirkan bukti tangkapan layar pembayaran saya.`;
    const waUrl = `https://wa.me/6281122223333?text=${encodeURIComponent(waText)}`;

    return (
      <section id="book" className="py-16 px-4 md:px-8 bg-[#f5f5f0]">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-[32px] border border-black/5 shadow-sm flex flex-col items-center text-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#5A5A40]"></div>

            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle size={32} />
            </div>

            <div>
              <h2 className="font-serif text-3xl font-bold text-[#2d2d2a] mb-2">Ruangan Berhasil Dipesan!</h2>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                Pembayaran Anda tercatat, dan kami segera memverifikasinya. Mohon kirimkan bukti transfer Anda melalui WhatsApp.
              </p>
            </div>

            <div className="w-full bg-[#f5f5f0] p-6 rounded-2xl border border-black/5 flex flex-col gap-4 text-left mt-2">
              <div className="flex justify-between items-center border-b border-black/5 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Kode Booking</span>
                <span className="font-mono font-bold text-lg text-[#2d2d2a]">{bookingCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total Pembayaran ({days} Malam)</span>
                <span className="font-bold text-[#2d2d2a]">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 text-white flex items-center justify-center gap-3 py-4 px-8 rounded-full font-bold shadow-md hover:bg-green-600 transition-colors uppercase tracking-widest text-xs mt-4"
            >
              <MessageCircle size={18} /> Kirim Bukti ke WA
            </a>

            <button
              onClick={() => {
                setStep(1);
                setFormData({ ...formData, name: "", whatsapp: "", email: "" });
              }}
              className="text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-[#5A5A40] transition-colors underline underline-offset-4 mt-2"
            >
              Buat Pesanan Baru
            </button>
          </div>
        </div>
      </section>
    );
  }

  // DEFAULT FORM STEP = 1
  return (
    <section id="book" className="py-16 px-4 md:px-8 bg-[#f5f5f0]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 md:p-12 rounded-[32px] border border-black/5 shadow-sm flex flex-col gap-6">
          <div className="text-center mb-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2d2d2a] mb-2">Pesan Kamar Anda</h2>
            <p className="text-xs text-gray-500 max-w-xl mx-auto">
              Selesaikan pemesanan kamar, kode QRIS untuk pembayaran akan muncul di langkah selanjutnya.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#2d2d2a]">Tipe Kamar</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a]"
                  required
                >
                  {rooms.length > 0 ? rooms.map(room => (
                    <option key={room.id} value={room.id} disabled={!room.available}>
                      {room.name} {!room.available && "(Penuh)"}
                    </option>
                  )) : (
                    <option value="standard">Kamar Standar</option>
                  )}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#2d2d2a]">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a] placeholder-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#2d2d2a]">Nomor WhatsApp</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+62 812-3456-7890"
                  className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a] placeholder-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#2d2d2a]">Alamat Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a] placeholder-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#2d2d2a]">Tanggal Check-in</label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a]"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#2d2d2a]">Tanggal Check-out</label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a]"
                  required
                />
              </div>
            </div>

            <div className="mt-8 text-center w-full">
              <button
                type="submit"
                className="w-full md:w-auto bg-[#5A5A40] text-white py-4 px-12 rounded-full font-bold shadow-md hover:bg-black transition-colors uppercase tracking-widest text-xs flex items-center justify-center mx-auto gap-2"
              >
                Lanjut ke Pembayaran <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
