"use client";
import { Save, X, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

const FALLBACKS = {
  landing_hero_image_url: "https://picsum.photos/seed/hotelhero/1920/1080?blur=2",
  landing_hero_title: "Simfoni Kenyamanan",
  landing_hero_description:
    "Rasakan kemuliaan dan ketenangan yang tak tertandingi di Hotel Citycome. Liburan sempurna Anda dimulai di sini.",
  landing_hero_cta_primary_text: "Pesan Kamar",
  landing_hero_cta_secondary_text: "Jelajahi Kamar",
  landing_gallery_title: "Galeri Kami",
  landing_gallery_subtitle:
    "Intip sekilas keindahan dan kenyamanan yang menanti Anda di Hotel Citycome.",
  landing_gallery_images: JSON.stringify([
    "https://picsum.photos/seed/gallery1/800/800",
    "https://picsum.photos/seed/gallery2/400/400",
    "https://picsum.photos/seed/gallery3/400/400",
    "https://picsum.photos/seed/gallery4/400/400",
    "https://picsum.photos/seed/gallery5/400/400",
  ]),
};

const GALLERY_MAX = 5;

export default function AdminLanding() {
  const [form, setForm] = useState({
    landing_hero_image_url: "",
    landing_hero_title: "",
    landing_hero_description: "",
    landing_hero_cta_primary_text: "",
    landing_hero_cta_secondary_text: "",
    landing_gallery_title: "",
    landing_gallery_subtitle: "",
  });
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryInput, setGalleryInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const loadSettings = async () => {
    try {
      const res = await fetchApi("/settings");
      if (res.success) {
        const d = res.data;
        setForm({
          landing_hero_image_url:
            d.landing_hero_image_url || FALLBACKS.landing_hero_image_url,
          landing_hero_title: d.landing_hero_title || FALLBACKS.landing_hero_title,
          landing_hero_description:
            d.landing_hero_description || FALLBACKS.landing_hero_description,
          landing_hero_cta_primary_text:
            d.landing_hero_cta_primary_text ||
            FALLBACKS.landing_hero_cta_primary_text,
          landing_hero_cta_secondary_text:
            d.landing_hero_cta_secondary_text ||
            FALLBACKS.landing_hero_cta_secondary_text,
          landing_gallery_title:
            d.landing_gallery_title || FALLBACKS.landing_gallery_title,
          landing_gallery_subtitle:
            d.landing_gallery_subtitle || FALLBACKS.landing_gallery_subtitle,
        });
        try {
          const raw = d.landing_gallery_images || FALLBACKS.landing_gallery_images;
          const parsed = JSON.parse(raw);
          setGalleryImages(Array.isArray(parsed) ? parsed : []);
        } catch {
          setGalleryImages([]);
        }
      }
    } catch (err) {
      console.error("Gagal memuat settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const uploadFile = async (file) => {
    const formUpload = new FormData();
    formUpload.append("image", file);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_token="))
      ?.split("=")[1];
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${apiUrl}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formUpload,
    });
    return res.json();
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingHero(true);
    try {
      const data = await uploadFile(file);
      if (data.success) {
        setForm((prev) => ({ ...prev, landing_hero_image_url: data.image_url }));
      } else {
        alert(data.message || "Gagal upload foto hero.");
      }
    } catch {
      alert("Error upload foto hero.");
    } finally {
      setIsUploadingHero(false);
      e.target.value = "";
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = GALLERY_MAX - galleryImages.length;
    if (remaining <= 0) {
      alert(`Maksimal ${GALLERY_MAX} foto galeri.`);
      return;
    }
    setIsUploadingGallery(true);
    try {
      const toUpload = files.slice(0, remaining);
      const uploaded = [];
      for (const file of toUpload) {
        const data = await uploadFile(file);
        if (data.success) uploaded.push(data.image_url);
        else alert(data.message || "Gagal upload salah satu foto.");
      }
      if (uploaded.length > 0) {
        setGalleryImages((prev) => [...prev, ...uploaded]);
      }
    } catch {
      alert("Error upload galeri.");
    } finally {
      setIsUploadingGallery(false);
      e.target.value = "";
    }
  };

  const addGalleryUrl = () => {
    const url = galleryInput.trim();
    if (!url) return;
    if (galleryImages.length >= GALLERY_MAX) {
      alert(`Maksimal ${GALLERY_MAX} foto galeri.`);
      return;
    }
    setGalleryImages((prev) => [...prev, url]);
    setGalleryInput("");
  };

  const removeGallery = (idx) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        landing_gallery_images: JSON.stringify(galleryImages),
      };
      const res = await fetchApi("/settings", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (res.success) alert("Konten landing berhasil disimpan!");
      else alert(res.message || "Gagal menyimpan.");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="py-20 text-center text-gray-500 text-sm font-bold tracking-widest uppercase">
        Memuat Konten...
      </div>
    );

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2d2d2a] mb-2">
            Konten Landing Page
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400">
            Kelola teks dan foto pada halaman utama publik
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#5A5A40] text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md hover:bg-black transition-colors disabled:opacity-50 w-full md:w-auto justify-center"
        >
          <Save size={16} />
          {isSaving ? "Menyimpan..." : "Simpan Semua"}
        </button>
      </div>

      {/* HERO SECTION */}
      <section className="bg-white rounded-[32px] border border-black/5 shadow-sm p-8">
        <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-6 pb-4 border-b border-black/5">
          Hero (Banner Utama)
        </h2>

        {/* Preview */}
        {form.landing_hero_image_url && (
          <div className="relative w-full aspect-[16/5] rounded-2xl overflow-hidden mb-6 bg-[#f5f5f0]">
            <Image
              src={form.landing_hero_image_url}
              alt="Preview Hero"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <p className="font-serif text-white text-2xl font-bold drop-shadow">
                {form.landing_hero_title || "—"}
              </p>
              <p className="text-white/80 text-xs mt-2 max-w-sm">
                {form.landing_hero_description || "—"}
              </p>
              <div className="flex gap-3 mt-3">
                <span className="bg-white text-[#5A5A40] text-[10px] font-bold px-4 py-1.5 rounded-full">
                  {form.landing_hero_cta_primary_text || "—"}
                </span>
                <span className="border border-white/60 text-white text-[10px] font-bold px-4 py-1.5 rounded-full">
                  {form.landing_hero_cta_secondary_text || "—"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {/* Hero image */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2 block">
              Foto Hero (URL atau Upload)
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={form.landing_hero_image_url}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    landing_hero_image_url: e.target.value,
                  }))
                }
                className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none"
                placeholder="https://..."
              />
              <div className="flex items-center gap-4 bg-gray-50 border border-dashed border-gray-300 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">
                  Atau Upload:
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroUpload}
                  disabled={isUploadingHero}
                  className="flex-1 text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:uppercase file:font-bold file:tracking-widest file:bg-[#5A5A40] file:text-white hover:file:bg-black transition-colors"
                />
                {isUploadingHero && (
                  <span className="text-[10px] uppercase font-bold text-[#5A5A40] pr-2">
                    Loading...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">
              Judul Hero
            </label>
            <input
              type="text"
              value={form.landing_hero_title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, landing_hero_title: e.target.value }))
              }
              className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none"
              placeholder="Simfoni Kenyamanan"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">
              Deskripsi / Tagline
            </label>
            <textarea
              rows={3}
              value={form.landing_hero_description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  landing_hero_description: e.target.value,
                }))
              }
              className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none resize-none"
              placeholder="Rasakan kemuliaan dan ketenangan..."
            />
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">
                Teks Tombol Utama
              </label>
              <input
                type="text"
                value={form.landing_hero_cta_primary_text}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    landing_hero_cta_primary_text: e.target.value,
                  }))
                }
                className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none"
                placeholder="Pesan Kamar"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">
                Teks Tombol Kedua
              </label>
              <input
                type="text"
                value={form.landing_hero_cta_secondary_text}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    landing_hero_cta_secondary_text: e.target.value,
                  }))
                }
                className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none"
                placeholder="Jelajahi Kamar"
              />
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="bg-white rounded-[32px] border border-black/5 shadow-sm p-8">
        <h2 className="font-serif text-xl font-bold text-[#2d2d2a] mb-6 pb-4 border-b border-black/5">
          Galeri Landing Page
        </h2>

        <div className="flex flex-col gap-5">
          {/* Gallery title + subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">
                Judul Galeri
              </label>
              <input
                type="text"
                value={form.landing_gallery_title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    landing_gallery_title: e.target.value,
                  }))
                }
                className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none"
                placeholder="Galeri Kami"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1 block">
                Subtitle Galeri
              </label>
              <input
                type="text"
                value={form.landing_gallery_subtitle}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    landing_gallery_subtitle: e.target.value,
                  }))
                }
                className="w-full bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none"
                placeholder="Intip sekilas keindahan..."
              />
            </div>
          </div>

          {/* Gallery images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Foto Galeri ({galleryImages.length}/{GALLERY_MAX})
              </label>
              <span className="text-[10px] text-gray-400">
                Posisi: 1=besar kiri, 2-5=kecil kanan
              </span>
            </div>

            {/* Thumbnails preview */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-3">
                {galleryImages.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="relative aspect-square rounded-xl overflow-hidden bg-[#f5f5f0] group"
                  >
                    <Image
                      src={url}
                      alt={`Galeri ${idx + 1}`}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-bold text-center py-0.5">
                      {idx + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGallery(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Hapus foto"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add URL */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addGalleryUrl();
                  }
                }}
                className="flex-1 bg-[#f5f5f0] border-transparent rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5A5A40] outline-none"
                placeholder="https://url-foto.jpg"
                disabled={galleryImages.length >= GALLERY_MAX}
              />
              <button
                type="button"
                onClick={addGalleryUrl}
                disabled={galleryImages.length >= GALLERY_MAX}
                className="bg-[#5A5A40] text-white px-4 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-colors flex items-center gap-1 disabled:opacity-40"
              >
                <Plus size={14} /> Tambah
              </button>
            </div>

            {/* Upload */}
            <div className="flex items-center gap-4 bg-gray-50 border border-dashed border-gray-300 p-2 rounded-xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">
                Atau Upload:
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                disabled={
                  isUploadingGallery || galleryImages.length >= GALLERY_MAX
                }
                className="flex-1 text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:uppercase file:font-bold file:tracking-widest file:bg-[#5A5A40] file:text-white hover:file:bg-black transition-colors"
              />
              {isUploadingGallery && (
                <span className="text-[10px] uppercase font-bold text-[#5A5A40] pr-2">
                  Loading...
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              Maksimal {GALLERY_MAX} foto. Foto ke-1 tampil besar di kiri, foto
              ke-2 s/d ke-5 tampil kecil di kanan.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Save */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#5A5A40] text-white px-8 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md hover:bg-black transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? "Menyimpan..." : "Simpan Semua"}
        </button>
      </div>
    </div>
  );
}
