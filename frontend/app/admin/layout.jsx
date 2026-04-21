"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bed,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = (e) => {
    e.preventDefault();
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Pesanan", icon: ClipboardList, href: "/admin/orders" },
    { name: "Manajemen Kamar", icon: Bed, href: "/admin/rooms" },
    { name: "Pengaturan", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#2d2d2a] text-white p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-lg tracking-widest uppercase text-white/90">CityAdmin</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        fixed md:sticky top-0 left-0 h-screen w-64 bg-[#2d2d2a] text-white/70 
        transition-transform duration-300 ease-in-out z-40 flex flex-col shrink-0
      `}>
        <div className="p-6 md:flex items-center gap-3 hidden">
          <span className="font-serif font-bold text-xl tracking-widest uppercase text-white">CityAdmin</span>
        </div>

        <div className="px-6 py-2 text-[10px] font-bold tracking-widest uppercase text-white/40 mb-2 mt-8 md:mt-4">
          Menu Utama
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-bold tracking-widest uppercase ${
                  isActive
                    ? "bg-[#5A5A40] text-white shadow-md"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-bold tracking-widest uppercase hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Keluar (Log Out)
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
