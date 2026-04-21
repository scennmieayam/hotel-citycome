export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#f5f5f0] flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center justify-center">
        {/* Lingkaran Luar Berputar */}
        <div className="w-24 h-24 border-4 border-black/5 border-t-[#5A5A40] rounded-full animate-spin"></div>
        
        {/* Initial C berdenyut di tengah */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-3xl font-bold text-[#5A5A40] animate-pulse">C</span>
        </div>
      </div>
      
      <p className="mt-6 text-[10px] font-bold tracking-widest uppercase text-gray-400 animate-pulse">
        Menyiapkan Kamar Anda...
      </p>
    </div>
  );
}
