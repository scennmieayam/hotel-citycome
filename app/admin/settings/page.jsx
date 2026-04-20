"use client";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    hotel_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    wa_template: ""
  });
  
  const [adminInfo, setAdminInfo] = useState({
    username: "",
    email: ""
  });
  
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resSettings, resAdmin] = await Promise.all([
        fetchApi('/settings'),
        fetchApi('/settings/admin-info')
      ]);
      
      if (resSettings.success) setSettings(resSettings.data);
      if (resAdmin.success) setAdminInfo(resAdmin.data);
    } catch (err) {
      console.error("Gagal mendapatkan pengaturan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetchApi('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      
      if (password.trim() !== '') {
        await fetchApi('/settings/admin-password', {
          method: 'PUT',
          body: JSON.stringify({ new_password: password })
        });
        setPassword("");
      }
      
      if (res.success) alert("Pengaturan berhasil disimpan!");
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if(isLoading) return <div className="py-20 text-center text-gray-500 font-bold tracking-widest uppercase text-sm">Memuat Pengaturan...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2d2d2a] mb-2">Pengaturan Sistem</h1>
        <p className="text-xs font-bold tracking-widest uppercase text-gray-400">Konfigurasi info hotel dan akun admin</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Info Hotel */}
        <section className="bg-white p-6 md:p-8 rounded-[32px] border border-black/5 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-6 pb-4 border-b border-black/5">Informasi Hotel</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col lg:col-span-2">
              <label className="text-[10px] uppercase font-bold tracking-wider mb-2 text-[#2d2d2a]">Nama Hotel</label>
              <input type="text" value={settings.hotel_name || ''} onChange={e => setSettings({...settings, hotel_name: e.target.value})} className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a]" />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold tracking-wider mb-2 text-[#2d2d2a]">Email Kontak</label>
              <input type="email" value={settings.contact_email || ''} onChange={e => setSettings({...settings, contact_email: e.target.value})} className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a]" />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold tracking-wider mb-2 text-[#2d2d2a]">Nomor Telepon / WhatsApp</label>
              <input type="tel" value={settings.contact_phone || ''} onChange={e => setSettings({...settings, contact_phone: e.target.value})} className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a]" />
            </div>
            <div className="flex flex-col lg:col-span-2">
              <label className="text-[10px] uppercase font-bold tracking-wider mb-2 text-[#2d2d2a]">Alamat Lengkap</label>
              <textarea rows={3} value={settings.address || ''} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a] resize-none"></textarea>
            </div>
          </div>
        </section>

        {/* Pesan WA Otomatis */}
        <section className="bg-white p-6 md:p-8 rounded-[32px] border border-black/5 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-6 pb-4 border-b border-black/5">Pengaturan Pembayaran & Notifikasi</h2>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold tracking-wider mb-2 text-[#2d2d2a]">Pesan WhatsApp Otomatis (Saat Booking)</label>
              <textarea rows={6} value={settings.wa_template || ''} onChange={e => setSettings({...settings, wa_template: e.target.value})} className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a] resize-none"></textarea>
              <p className="text-[10px] text-gray-500 mt-2">Gunakan kurung siku untuk variabel otomatis: [NAMA_TAMU], [BOOKING_ID], [TOTAL_HARGA].</p>
            </div>
          </div>
        </section>

        {/* Keamanan Akun */}
        <section className="bg-white p-6 md:p-8 rounded-[32px] border border-black/5 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-6 pb-4 border-b border-black/5">Keamanan Akun Admin</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold tracking-wider mb-2 text-[#2d2d2a]">Username Admin</label>
              <input type="text" value={adminInfo.username || ''} className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a] cursor-not-allowed" disabled />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold tracking-wider mb-2 text-[#2d2d2a]">Password Baru</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Ketik password baru untuk mengubah" className="w-full bg-[#f5f5f0] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a]" />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end mt-4">
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-[#5A5A40] text-white py-3 px-8 rounded-full font-bold shadow-md hover:bg-black transition-colors uppercase tracking-widest text-[10px] disabled:opacity-50">
            <Save size={16} /> {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </div>
    </div>
  );
}
