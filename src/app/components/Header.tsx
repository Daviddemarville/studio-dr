'use client';

import Navbar from './Navbar';

export default function Header() {
  return (
    <header
      className="
        sticky top-0 z-50
        backdrop-blur-md bg-white/80 
        border-b border-gray-200
        supports-backdrop-filter:bg-white/70

      "
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO / NOM DU SITE */}
        <div className="text-xl font-semibold text-gray-900 tracking-tight select-none">
          Studio DR
        </div>

        {/* NAVBAR */}
        <Navbar />
      </div>
    </header>
  );
}
