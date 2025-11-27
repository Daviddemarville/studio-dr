"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { createClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import { SignInButton } from "./../../_components/_buttons/signIn";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading } = useSupabaseUser();
  const supabase = createClient();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <main>
        <section>
          <h1 className="text-2xl">Bienvenue</h1>
          <p>Connectez-vous à votre compte pour continuer.</p>
        </section>
        <section>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (!email) return;
              setIsLoading(true);
              setError(null);
              try {
                const { data, error } = await supabase.auth.signInWithPassword({
                  email: email.trim(),
                  password,
                });

                if (error) {
                  console.error(error);
                  if (error.message.includes("Invalid login credentials")) {
                    setError("Email ou mot de passe incorrect.");
                  } else {
                    setError(error.message ?? "Une erreur est survenue");
                  }
                } else if (data?.user) {
                  // After successful sign in, ensure the user's profile is approved
                  try {
                    const userId = data.user.id;
                    const { data: profile, error: profileError } =
                      await supabase
                        .from("users")
                        .select("is_approved")
                        .eq("id", userId)
                        .maybeSingle();

                    if (profileError) {
                      console.error(profileError);
                      router.push("/");
                      // If we can't read the profile, fallback to admin but surface a message
                      setError(
                        "Impossible de vérifier l'état du compte. Réessayez plus tard.",
                      );
                    } else if (!profile?.is_approved) {
                      // Not approved -> send to pending page
                      router.push(
                        `/auth/pending?id=${data.user.id}&email=${encodeURIComponent(
                          email,
                        )}`,
                      );
                    } else {
                      // Approved -> proceed to admin
                      router.push("/admin");
                    }
                  } catch (innerErr) {
                    console.error(innerErr);
                    setError("Erreur lors de la vérification du profil");
                  }
                } else {
                  // Unexpected response

                  setError(
                    "Impossible de se connecter. Veuillez vérifier vos identifiants.",
                  );
                }
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : String(err));
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {error && <p className="text-sm text-destructive-500">{error}</p>}
            <div>
              <label htmlFor="email" className="flex flex-col gap-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Votre Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-[#111317] border 
          focus:border-blue-500 transition"
              />
              {/* {errors.email && (
          <p className="text-sm text-red-400">
            {errors.email.message as string}
          </p>
        )} */}
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm">Mot de passe</span>
              <input
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className=" w-full rounded-md border px-3 py-2 my-2 bg-input"
              />
            </label>

            <div className="text-sm text-right">
              <Link
                href="/auth/forgot-password"
                className="text-primary hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              className=" cursor-pointer w-full"
              disabled={isLoading}
            >
              {isLoading ? "Connexion…" : "Se connecter"}
            </button>

            <div className="flex justify-between text-sm mt-3">
              Vous n'avez pas de compte ?{" "}
              <Link
                href="/auth/signUp"
                className="text-blue-400 hover:underline"
              >
                Créer un compte
              </Link>
            </div>

            <div className="border-t pt-3" />

            <SignInButton
              provider="google"
              className="bg-gray-500 border border-black"
            />

            <SignInButton
              provider="discord"
              className="bg-purple-900 border border-black"
            />

            <SignInButton provider="github" className="border border-black" />

            <div className="mt-4 text-sm text-gray-600">
              {loading ? "En cours..." : user ? "Connecté" : "Déconnecté"}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
