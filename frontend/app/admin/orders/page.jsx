"use client";
import { Search, Filter, CheckCircle, XCircle, Eye, X } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetchApi('/bookings');
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
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
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      alert("Gagal update status: " + err.message);
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-gray-500 text-sm font-bold tracking-widest uppercase">Memuat Pesanan...</div>;
  }

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2d2d2a] mb-2">Kelola Pesanan</h1>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400">Daftar semua reservasi tamu</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-black/5 text-[#2d2d2a] px-4 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm hover:bg-gray-50 transition-colors">
            <Filter size={14} /> Filter
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari ID / Nama..."
              className="bg-white border border-black/5 text-sm rounded-full pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5A5A40] shadow-sm w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f5f0]/50 text-[10px] font-bold tracking-widest uppercase text-gray-400 border-b border-black/5">
                <th className="p-4 pl-6 md:pl-8 font-medium">ID Booking</th>
                <th className="p-4 font-medium">Data Tamu</th>
                <th className="p-4 font-medium">Tipe Kamar</th>
                <th className="p-4 font-medium">Jadwal In - Out</th>
                <th className="p-4 font-medium">Nominal</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 pr-6 md:pr-8 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-black/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 md:pl-8 font-semibold text-[#2d2d2a]">{order.id}</td>
                  <td className="p-4">
                    <div className="text-[#2d2d2a] font-medium">{order.guest_name}</div>
                    <div className="text-[10px] text-gray-500">{order.guest_phone || order.guest_email}</div>
                  </td>
                  <td className="p-4 text-gray-500">{order.room_type}</td>
                  <td className="p-4 text-gray-500 text-xs">
                    <div><span className="font-semibold">In:</span> {new Date(order.check_in).toLocaleDateString('id-ID')}</div>
                    <div><span className="font-semibold">Out:</span> {new Date(order.check_out).toLocaleDateString('id-ID')}</div>
                  </td>
                  <td className="p-4 font-medium text-[#2d2d2a]">Rp {Number(order.total_price).toLocaleString('id-ID')}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase
                      ${order.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'pending' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status === 'paid' && 'LUNAS'}
                      {order.status === 'pending' && 'MENUNGGU BATAS'}
                      {order.status === 'rejected' && 'BATAL'}
                    </span>
                  </td>
                  <td className="p-4 pr-6 md:pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'paid')}
                            title="Tandai Lunas"
                            className="bg-green-50 text-green-600 hover:bg-green-600 hover:text-white p-2 rounded-full transition-colors"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'rejected')}
                            title="Batalkan"
                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-full transition-colors"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        title="Lihat Detail"
                        className="bg-gray-100 text-gray-600 hover:bg-[#5A5A40] hover:text-white p-2 rounded-full transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pesanan */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 md:p-8 border-b border-black/5 flex justify-between items-center bg-[#f5f5f0]">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2d2d2a]">Detail Pesanan</h3>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-red-500 transition-colors bg-white p-2 rounded-full shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Nama Tamu</p>
                  <p className="font-semibold text-[#2d2d2a]">{selectedOrder.guest_name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Kontak WA</p>
                  <p className="font-semibold text-[#2d2d2a]">{selectedOrder.guest_phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Kamar</p>
                  <p className="font-semibold text-[#2d2d2a]">{selectedOrder.room_type}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Total Biaya</p>
                  <p className="font-semibold text-green-600">Rp {Number(selectedOrder.total_price).toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Check In</p>
                  <p className="font-semibold text-[#2d2d2a]">{new Date(selectedOrder.check_in).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Check Out</p>
                  <p className="font-semibold text-[#2d2d2a]">{new Date(selectedOrder.check_out).toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              <div className="bg-[#f5f5f0] p-4 rounded-2xl border border-black/5">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Email / Catatan Tambahan</p>
                <p className="text-sm text-[#2d2d2a] italic">{selectedOrder.guest_email ? `Email: ${selectedOrder.guest_email}` : ''} <br/> {selectedOrder.notes ? `"${selectedOrder.notes}"` : ''}</p>
              </div>

              <div className="border-t border-black/5 pt-6 flex justify-between items-center">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase
                  ${selectedOrder.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                  ${selectedOrder.status === 'pending' ? 'bg-blue-100 text-blue-800' : ''}
                  ${selectedOrder.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  Status: {selectedOrder.status === 'paid' && 'LUNAS'}
                  {selectedOrder.status === 'pending' && 'MENUNGGU BATAS'}
                  {selectedOrder.status === 'rejected' && 'BATAL'}
                </span>

                {selectedOrder.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'rejected')}
                      className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-full transition-colors"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'paid')}
                      className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-white bg-[#5A5A40] hover:bg-black rounded-full transition-colors"
                    >
                      Konfirmasi Bayar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
