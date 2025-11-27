"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      setMessage("Votre mot de passe a été mis à jour avec succès.");

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/auth/signIn");
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <main>
          <section>
            <h1 className="text-2xl">Réinitialiser le mot de passe</h1>
            <p>Entrez votre nouveau mot de passe ci-dessous.</p>
          </section>
          <section>
            <form
              onSubmit={handleUpdatePassword}
              className="flex flex-col gap-4"
            >
              {message && <p className="text-sm text-green-600">{message}</p>}
              {error && <p className="text-sm text-destructive">{error}</p>}

              <label className="flex flex-col gap-1">
                <span className="text-sm">Nouveau mot de passe</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border bg-input px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Confirmer le mot de passe</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-md border bg-input px-3 py-2"
                />
              </label>

              <button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
