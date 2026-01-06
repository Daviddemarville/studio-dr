"use client";

import Image from "next/image";
import type { NavSection } from "@/lib/get-active-sections";
import type { SiteSettings } from "@/lib/get-site-settings";
import Navbar from "./Navbar";

interface HeaderProps {
  sections: NavSection[];
  settings: SiteSettings;
}

export default function Header({ sections, settings }: HeaderProps) {
  const { site_name, logo_url } = settings;

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

        <div className="flex items-center">
          {logo_url && logo_url.trim() !== "" ? (
            <Image
              src={logo_url}
              alt="Logo"
              width={120}
              height={40}
              className="h-10 w-auto object-contain select-none"
            />
          ) : site_name ? (
            <span className="text-xl font-semibold text-gray-900 tracking-tight select-none">
              {site_name}
            </span>
          ) : (
            <span className="text-xl font-semibold text-gray-900 tracking-tight select-none">
              Studio DR
            </span>
          )}
        </div>

        {/* NAVBAR */}
        <Navbar sections={sections} />
      </div>
    </header>
  );
}
