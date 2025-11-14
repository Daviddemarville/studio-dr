'use client';

import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SocialLogin() {
  const supabase = supabaseBrowser();

  const loginWith = async (provider: "google" | "github" | "discord") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="space-y-2 pt-4 border-t">
      <button
        onClick={() => loginWith("google")}
        className="w-full bg-red-600 text-white py-2 rounded"
      >
        Continuer avec Google
      </button>

      <button
        onClick={() => loginWith("github")}
        className="w-full bg-gray-900 text-white py-2 rounded"
      >
        Continuer avec GitHub
      </button>

      <button
        onClick={() => loginWith("discord")}
        className="w-full bg-indigo-600 text-white py-2 rounded"
      >
        Continuer avec Discord
      </button>
    </div>
  );
}
