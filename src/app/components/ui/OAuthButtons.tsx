"use client";

import { supabaseBrowser } from "@/lib/supabase-browser";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { useState } from "react";

export default function OAuthButtons() {
  const supabase = supabaseBrowser();
  const [loading, setLoading] = useState<string | null>(null);

  const loginWith = async (provider: "google" | "github" | "discord") => {
    if (loading) return; // Empêche double clic
    setLoading(provider);

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    // Pas besoin de reset, redirection immédiate
  };

  return (
    <div className="space-y-2">

      {/* GOOGLE */}
      <button
        type="button"
        disabled={loading === "google"}
        onClick={() => loginWith("google")}
        className="w-full bg-white text-black py-2 rounded-lg flex justify-center items-center gap-2 
                   hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FcGoogle size={20} />
        {loading === "google" ? "Redirection..." : "Continuer avec Google"}
      </button>

      {/* GITHUB */}
      <button
        type="button"
        disabled={loading === "github"}
        onClick={() => loginWith("github")}
        className="w-full bg-[#0D1117] text-white py-2 rounded-lg flex justify-center items-center gap-2 
                   hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaGithub size={18} />
        {loading === "github" ? "Redirection..." : "Continuer avec GitHub"}
      </button>

      {/* DISCORD */}
      <button
        type="button"
        disabled={loading === "discord"}
        onClick={() => loginWith("discord")}
        className="w-full bg-[#5865F2] text-white py-2 rounded-lg flex justify-center items-center gap-2 
                   hover:bg-[#4752c4] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaDiscord size={18} />
        {loading === "discord" ? "Redirection..." : "Continuer avec Discord"}
      </button>
    </div>
  );
}
