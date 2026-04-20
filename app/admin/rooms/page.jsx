"use client";
import { Plus, Edit2, Power, X, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    id: "", name: "", description: "", price: 0, image_url: "", features: "", total: 5
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetchApi('/rooms');
      if (res.success) setRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (room) => {
    try {
      const res = await fetchApi(`/rooms/${room.id}`, {
        method: 'PUT',
        body: JSON.stringify({ available: room.available ? 0 : 1 })
      });
      if (res.success) fetchRooms();
    } catch (err) {
      alert("Gagal merubah status: " + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        total: Number(formData.total),
        features: formData.features ? formData.features.split(',').map(s=>s.trim()) : []
      };
      
      const url = isEditing ? `/rooms/${formData.id}` : '/rooms';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetchApi(url, { method, body: JSON.stringify(payload) });
      if (res.success) {
        setShowModal(false);
        fetchRooms();
      }
    } catch(err) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('Anda yakin ingin menghapus kamar ini beserta riwayatnya?')) return;
    try {
      const res = await fetchApi(`/rooms/${id}`, { method: 'DELETE' });
      if(res.success) {
        setShowModal(false);
        fetchRooms();
      }
    } catch(err) {
       alert("Error penghapusan: " + err.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formUpload = new FormData();
    formUpload.append('image', file);

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('admin_token=')).split('=')[1];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formUpload
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, image_url: data.image_url });
      } else {
        alert(data.message || 'Gagal upload foto.');
      }
    } catch (err) {
      console.error(err);
      alert('Error upload sistem.');
    } finally {
      setIsUploading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ id: "", name: "", description: "", price: 0, image_url: "", features: "", total: 5 });
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setIsEditing(true);
    let parsedFeatures = "";
    try {
      const f = typeof room.features === 'string' ? JSON.parse(room.features) : room.features;
      parsedFeatures = Array.isArray(f) ? f.join(', ') : "";
    } catch(e){}
    
    setFormData({
      id: room.id,
      name: room.name || "",
      description: room.description || "",
      price: room.price || 0,
      image_url: room.image_url || "",
      features: parsedFeatures,
      total: room.total || 5
    });
    setShowModal(true);
  };

  if (isLoading) {
    return <div className="py-20 text-center text-gray-500 text-sm font-bold tracking-widest uppercase">Memuat Kamar...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2d2d2a] mb-2">Manajemen Kamar</h1>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400">Atur ketersediaan dan tipe kamar</p>
        </div>
        <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-[#5A5A40] text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md hover:bg-black transition-colors w-full md:w-auto">
          <Plus size={16} /> Tambah Tipe Kamar
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const isFull = room.booked >= room.total;

          return (
            <div key={room.id} className={`bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden flex flex-col transition-all ${!room.available ? 'opacity-60 grayscale-[50%]' : ''}`}>
              <div className="relative aspect-[4/3] w-full bg-[#f5f5f0]">
                <Image src={room.image_url || `https://picsum.photos/seed/${room.id}/800/600`} alt={room.name} fill className="object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {!room.available ? (
                    <span className="bg-[#2d2d2a] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md">Nonaktif</span>
                  ) : isFull ? (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md">Penuh (Sold Out)</span>
                  ) : (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md">Tersedia</span>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl font-bold text-[#2d2d2a] leading-tight">{room.name}</h3>
                </div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#5A5A40] mb-4">
                  Rp {room.price.toLocaleString('id-ID')} / MALAM
                </p>

                <div className="bg-[#f5f5f0] rounded-xl p-3 mb-6 mt-auto">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Terpesan</span>
                    <span className="font-bold text-[#2d2d2a]">{room.booked} / {room.total} Kamar</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-[#5A5A40]'}`}
                      style={{ width: `${(room.booked / room.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-black/5 pt-4">
                  <button onClick={() => openEditModal(room)} className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#2d2d2a] bg-gray-50 hover:bg-gray-100 py-2.5 rounded-xl transition-colors">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => toggleStatus(room)}
                    className={`flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase py-2.5 rounded-xl transition-colors ${room.available ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                  >
                    <Power size={14} /> {room.available ? 'Matikan' : 'Aktifkan'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
              <X size={24} />
            </button>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2a] mb-6">{isEditing ? 'Edit Tipe Kamar' : 'Tambah Opsi Kamar Baru'}</h2>
            
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">ID Kamar Khusus (Huruf Kecil, Contoh: standard, deluxe)</label>
                <input required disabled={isEditing} value={formData.id} onChange={e=>setFormData({...formData, id: e.target.value.toLowerCase().replace(/\s+/g,'-')})} className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">Nama Kamar Publik</label>
                <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">Harga Sewa / Malam</label>
                  <input type="number" required value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">Total Stok Kamar</label>
                  <input type="number" required value={formData.total} onChange={e=>setFormData({...formData, total: e.target.value})} className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">Foto Kamar (Bisa Upload atau Masukkan Link Bebas)</label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <input type="text" value={formData.image_url} onChange={e=>setFormData({...formData, image_url: e.target.value})} className="flex-1 bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none" placeholder="https://raw.githubusercontent.com/..." />
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 border border-dashed border-gray-300 p-2 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Atau Upload:</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="flex-1 text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:uppercase file:font-bold file:tracking-widest file:bg-[#5A5A40] file:text-white hover:file:bg-black transition-colors" disabled={isUploading} />
                    {isUploading && <span className="text-[10px] uppercase font-bold text-[#5A5A40] pr-2">Loading...</span>}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">Fasilitas (pisahkan dengan koma)</label>
                <input value={formData.features} onChange={e=>setFormData({...formData, features: e.target.value})} className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none" placeholder="TV Pintar, AC, WiFi, Bathtube" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">Deskripsi Detail</label>
                <textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none resize-none" rows="3"></textarea>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-black/5">
                {isEditing ? (
                  <button type="button" onClick={() => handleDelete(formData.id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-widest flex gap-2 items-center">
                    <Trash2 size={14} /> Hapus Kamar
                  </button>
                ) : <div></div>}
                <button type="submit" className="bg-[#5A5A40] text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md hover:bg-black transition-colors">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
