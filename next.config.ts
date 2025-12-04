import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.daviddm.fr",
      },
      { protocol:"https", hostname:"cdn.discordapp.com"},
      { protocol:"https", hostname:"media.discordapp.net"},
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
