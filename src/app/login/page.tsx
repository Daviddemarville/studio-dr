"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  /* ---------------- Connexion email/password ---------------- */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return setMessage(error.message);

    // Vérification admin
    const { data: userData } = await supabase
      .from("users")
      .select("is_approved")
      .eq("id", data.user.id)
      .single();

    if (!userData?.is_approved) {
      await supabase.auth.signOut();
      return setMessage("Compte en attente de validation administrateur.");
    }

    router.push("/admin");
  };

  /* ---------------- Inscription ---------------- */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setMessage(
      error
        ? error.message
        : "Vérifiez vos emails pour confirmer votre inscription."
    );
  };

  /* ---------------- Reset password ---------------- */
  const handleReset = async () => {
    if (!email) return setMessage("Veuillez entrer votre email.");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setMessage(
      error
        ? error.message
        : "Si le compte existe, un email de réinitialisation a été envoyé."
    );
  };

  /* ---------------- OAuth Providers ---------------- */
  const loginWith = async (provider: "google" | "github" | "discord") => {
    setMessage("");
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-xl shadow bg-white space-y-4">
      <h2 className="text-xl font-semibold text-center mb-2">
        Connexion / Inscription
      </h2>

      {/* Email */}
      <input
        className="border p-2 w-full rounded"
        placeholder="Adresse email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password */}
      <input
        className="border p-2 w-full rounded"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Boutons login/register */}
      <div className="flex gap-2">
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-3 py-2 rounded w-full"
        >
          Connexion
        </button>
        <button
          onClick={handleRegister}
          className="bg-green-600 text-white px-3 py-2 rounded w-full"
        >
          Créer un compte
        </button>
      </div>

      {/* Reset password */}
      <button
        onClick={handleReset}
        className="text-xs text-gray-600 mt-1 underline"
      >
        Mot de passe oublié ?
      </button>

      {/* Message */}
      {message && (
        <p className="text-sm text-center mt-2 text-gray-700">{message}</p>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs text-gray-400">ou</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* OAuth */}
      <div className="space-y-2">
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
    </div>
  );
}
