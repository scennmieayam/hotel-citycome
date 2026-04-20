"use client";
import { useState, useEffect } from "react";
import { DollarSign, Users, CalendarCheck, BedDouble, ArrowUpRight, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_revenue: 0,
    new_orders: 0,
    rooms_available: 0,
    rooms_total: 0,
    occupancy_rate: 0,
    recent_bookings: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetchApi('/dashboard');
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Gagal memuat dashboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetchApi(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.success) {
        fetchDashboard();
      }
    } catch (err) {
      alert("Gagal memperbarui status: " + err.message);
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-gray-500 text-sm font-bold tracking-widest uppercase">Memuat Dashboard...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2d2d2a] mb-2">Overview Dashboard</h1>
        <p className="text-xs font-bold tracking-widest uppercase text-gray-400">Ringkasan Performa Hotel Hari Ini</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#5A5A40]/10 rounded-2xl">
              <DollarSign className="w-5 h-5 text-[#5A5A40]" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12% <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Total Pendapatan</p>
          <h3 className="font-serif text-2xl font-bold text-[#2d2d2a]">Rp {Number(stats.total_revenue).toLocaleString('id-ID')}</h3>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#2d2d2a]/10 rounded-2xl">
              <CalendarCheck className="w-5 h-5 text-[#2d2d2a]" />
            </div>
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Pesanan Baru</p>
          <h3 className="font-serif text-2xl font-bold text-[#2d2d2a]">{stats.new_orders} <span className="text-sm font-sans text-gray-400 font-normal">pesanan</span></h3>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <BedDouble className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Kamar Tersedia</p>
          <h3 className="font-serif text-2xl font-bold text-[#2d2d2a]">{stats.rooms_available} <span className="text-sm font-sans text-gray-400 font-normal">dari {stats.rooms_total}</span></h3>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Tingkat Okupansi</p>
          <h3 className="font-serif text-2xl font-bold text-[#2d2d2a]">{stats.occupancy_rate}%</h3>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex justify-between items-center border-b border-black/5">
          <h2 className="font-serif text-2xl font-bold text-[#2d2d2a]">Pesanan Terbaru</h2>
          <Link href="/admin/orders" className="text-[10px] font-bold tracking-widest uppercase text-[#5A5A40] hover:bg-[#5A5A40]/10 px-4 py-2 rounded-full transition-colors">
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f5f0]/50 text-[10px] font-bold tracking-widest uppercase text-gray-400">
                <th className="p-4 pl-6 md:pl-8 font-medium">ID Booking</th>
                <th className="p-4 font-medium">Nama Tamu</th>
                <th className="p-4 font-medium">Tipe Kamar</th>
                <th className="p-4 font-medium">Tgl Check-in</th>
                <th className="p-4 font-medium">Total Harga</th>
                <th className="p-4 pr-6 md:pr-8 font-medium">Status</th>
                <th className="p-4 pr-6 md:pr-8 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-black/5">
              {stats.recent_bookings.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 md:pl-8 font-semibold text-[#2d2d2a]">{order.id}</td>
                  <td className="p-4 text-[#2d2d2a]">{order.guest_name}</td>
                  <td className="p-4 text-gray-500">{order.room_type}</td>
                  <td className="p-4 text-gray-500">{new Date(order.check_in).toLocaleDateString('id-ID')}</td>
                  <td className="p-4 font-medium text-[#2d2d2a]">Rp {Number(order.total_price).toLocaleString('id-ID')}</td>
                  <td className="p-4 pr-6 md:pr-8">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase
                      ${order.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'pending' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                      ${order.status === 'request_cancel' ? 'bg-orange-100 text-orange-800' : ''}
                    `}>
                      {order.status === 'paid' && 'LUNAS'}
                      {order.status === 'pending' && 'MENUNGGU DP'}
                      {order.status === 'rejected' && 'BATAL'}
                      {order.status === 'request_cancel' && 'MINTA REFUND'}
                    </span>
                  </td>
                  <td className="p-4 pr-6 md:pr-8 text-right">
                    {order.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'paid')}
                          className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-600 hover:text-white transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" /> Setuju
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'rejected')}
                          className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <XCircle className="w-3 h-3" /> Tolak
                        </button>
                      </div>
                    ) : order.status === 'request_cancel' ? (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'rejected')}
                        className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-600 hover:text-white transition-colors ml-auto"
                      >
                        <CheckCircle className="w-3 h-3" /> Setujui Refund
                      </button>
                    ) : (
                      <Link href="/admin/orders" className="text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-[#5A5A40] transition-colors underline underline-offset-4">
                        Lihat Detail
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
              {stats.recent_bookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">Belum ada pesanan terbaru.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
