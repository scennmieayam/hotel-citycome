"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      if (res.success) {
        // Simpan token JWT di cookie (berlaku di seluruh situs /)
        document.cookie = `admin_token=${res.token}; path=/; max-age=28800;`; // 8 jam
        router.push("/admin");
      }
    } catch (err) {
      setError(err.message || 'Gagal login. Kredensial tidak valid.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-[32px] p-8 md:p-10 shadow-xl border border-black/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#5A5A40]"></div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#5A5A40] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-serif text-3xl font-bold">C</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#2d2d2a] mb-2">CityAdmin</h1>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400">Silakan masuk ke panel kontrol</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#2d2d2a]">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#f5f5f0] border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a]"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#2d2d2a]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f5f5f0] border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#2d2d2a]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium text-center border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5A5A40] text-white py-4 rounded-full font-bold shadow-md hover:bg-black transition-colors uppercase tracking-widest text-xs mt-4 disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? "Memverifikasi..." : "Masuk Sistem"}
          </button>
        </form>
      </div>
    </div>
  );
}
