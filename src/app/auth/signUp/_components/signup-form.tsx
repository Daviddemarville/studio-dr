"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export function SignUpForm() {
  const router = useRouter();

  const [errors, setErrors] = useState<string[]>([]); // erreurs de validation / signup
  const [message, _setMessage] = useState<string | null>(null); // message de succès
  const [isLoading, setIsLoading] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // --- Signup avec email / mot de passe ---
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors: string[] = [];

    // fullname vraiment optionnel
    if (!email.trim()) {
      validationErrors.push("L'email est requis");
    }

    if (password.length < 6) {
      validationErrors.push(
        "Le mot de passe doit contenir au moins 6 caractères",
      );
    }

    if (password !== passwordConfirm) {
      validationErrors.push("Les mots de passe ne correspondent pas");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstname: firstname || null,
            lastname: lastname || null,
          },
          // Si besoin d'une page callback:
          // emailRedirectTo: `${SITE_URL}/auth/callback`,
        },
      });

      if (signupError) {
        if (signupError.message.includes("User already registered")) {
          setErrors(["Un compte existe déjà avec cet email."]);
        } else {
          setErrors([signupError.message]);
        }
        return;
      }

      // If there was no signup error, consider signup successful.
      // Supabase may return either a `user` or a `session` depending on confirmation
      // settings, so redirecting based on the presence of `data` is more reliable
      // for sending users to the pending/confirmation page so the resend flow works.
      if (data) {
        // create a profile row when a user object is available
        const user = (data as { user?: { id?: string } }).user;
        if (user) {
          try {
            await supabase.from("users").insert([
              {
                id: user.id,
                email,
                firstname: firstname || null,
                lastname: lastname || null,
                is_approved: false,
              },
            ]);
          } catch (err) {
            console.error("Could not create profile", err);
          }
        }
        router.push(
          `/auth/pending?id=${user?.id}&email=${encodeURIComponent(
            email,
          )}&source=signup`,
        );
      }
    } catch {
      setErrors(["Une erreur inattendue s'est produite"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <main>
          <section>
            <h1 className="text-2xl">Créer un compte</h1>
            <p>Inscris-toi pour commencer à utiliser ton compte</p>
          </section>
          <section>
            <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
              {errors && <p className="text-sm text-destructive">{errors}</p>}

              {errors.length > 0 && (
                <ul className="space-y-1 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                  {errors.map((errMsg) => (
                    <li key={errMsg}>{errMsg}</li>
                  ))}
                </ul>
              )}

              {message && <p className="text-sm text-green-600">{message}</p>}

              <label className="flex flex-col gap-1">
                <span className="text-sm">Prenom</span>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full rounded-md border bg-input px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Nom de famille</span>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full rounded-md border bg-input px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border bg-input px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Mot de passe</span>
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
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  className="w-full rounded-md border bg-input px-3 py-2"
                />
              </label>

              <button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création…" : "Créer un compte"}
              </button>

              <div className="border-t pt-3" />

              <div className="mt-4 text-center text-sm">
                Déjà un compte ?{" "}
                <Link
                  href="/auth/signIn"
                  className="underline underline-offset-4"
                >
                  Se connecter
                </Link>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
