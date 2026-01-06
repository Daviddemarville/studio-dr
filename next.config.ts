import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase storage (tous les projets)
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },

      // OAuth / avatars
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "media.discordapp.net" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "rahmoundif.dev" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },

      // Domaines clients / partenaires (ajout progressif)
      { protocol: "https", hostname: "www.daviddm.fr" },
      { protocol: "https", hostname: "rahmoundif.dev" },
    ],
  },
};

export default nextConfig;
