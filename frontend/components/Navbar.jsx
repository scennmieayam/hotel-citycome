"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const sections = ["rooms", "about", "gallery", "book"];
      let current = "";
      const offset = 250;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom >= offset) {
            current = section;
          }
        }
      }

      if (window.scrollY < 100) {
        current = "";
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const navLinks = [
    { name: "Beranda", href: "/", hash: "" },
    { name: "Kamar & Suite", href: "/#rooms", hash: "rooms" },
    { name: "Tentang", href: "/#about", hash: "about" },
    { name: "Galeri", href: "/#gallery", hash: "gallery" },
    { name: "Cek Status", href: "/status", hash: "status" },
  ];

  const checkActive = (link) => {
    if (pathname !== "/" && pathname !== "") {
      return pathname.startsWith(link.href) && link.href !== "/";
    }
    return activeSection === link.hash;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f5f5f0]/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="font-serif text-2xl font-bold leading-tight text-[#2d2d2a] group-hover:text-[#5A5A40] transition-colors">
                Citycome
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = checkActive(link);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm tracking-widest uppercase transition-all font-semibold relative flex justify-center ${
                    isActive
                      ? "text-[#5A5A40]"
                      : "text-[#2d2d2a]/70 hover:text-[#5A5A40]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="desktop-nav-indicator"
                      className="absolute -bottom-2 w-4 h-[2px] bg-[#5A5A40] rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            <Link
              href="/#book"
              className="inline-flex items-center justify-center border border-[#5A5A40] text-[#5A5A40] px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#5A5A40] hover:text-white transition-all tracking-widest uppercase"
            >
              Pesan Sekarang
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#2d2d2a] hover:text-[#5A5A40] focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#f5f5f0] border-b border-black/5">
          <div className="px-4 pt-2 pb-6 flex flex-col space-y-4">
            {navLinks.map((link) => {
              const isActive = checkActive(link);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm tracking-widest uppercase px-2 py-2 font-semibold relative w-fit ${
                    isActive
                      ? "text-[#5A5A40]"
                      : "text-[#2d2d2a]/70 hover:text-[#5A5A40]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="mobile-nav-indicator"
                      className="absolute bottom-2 left-2 w-4 h-[2px] bg-[#5A5A40] rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            <Link
              href="/#book"
              className="inline-flex items-center justify-center bg-[#5A5A40] text-white px-6 py-3 rounded-full text-sm font-semibold tracking-widest uppercase"
              onClick={() => setIsOpen(false)}
            >
              Pesan Sekarang
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
