"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import Navbar from "./Navbar";

export default function Header() {
  const supabase = supabaseBrowser();

  const [siteName, setSiteName] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Chargement dynamique des settings
  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("settings")
        .select("site_name, logo_url")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setSiteName(data.site_name ?? null);
        setLogoUrl(data.logo_url ?? null);
      }
    }

    loadSettings();
  }, [supabase]);

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
          {/*showLogo || title || fallback*/}
          {logoUrl && logoUrl.trim() !== "" ? (
            <Image
              src={logoUrl}
              alt="Logo"
              width={120}
              height={40}
              className="h-10 w-auto object-contain select-none"
            />
          ) : siteName ? (
            <span className="text-xl font-semibold text-gray-900 tracking-tight select-none">
              {siteName}
            </span>
          ) : (
            <span className="text-xl font-semibold text-gray-900 tracking-tight select-none">
              Studio DR
            </span>
          )}
        </div>

        {/* NAVBAR */}
        <Navbar />
      </div>
    </header>
  );
}
