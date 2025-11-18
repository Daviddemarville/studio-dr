"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/zod/loginSchema";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { toast } from "react-toastify";
import OAuthButtons from "../components/ui/OAuthButtons";
import PasswordField from "../components/ui/PasswordField";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    const { data: auth, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) return toast.error(error.message);
    if (!auth.user) return toast.error("Erreur interne.");

    // Vérifier approval
    const { data: userData } = await supabase
      .from("users")
      .select("is_approved, firstname, lastname, pseudo")
      .eq("id", auth.user.id)
      .single();

    if (!userData?.is_approved) {
      await supabase.auth.signOut();
      return toast.warning("Votre compte est en attente de validation.");
    }

    toast.success("Connexion réussie !");
    router.push("/admin");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* OAuth */}
      <OAuthButtons />

      <div className="flex items-center gap-4 my-4">
        <div className="h-px bg-gray-700 w-full" />
        <span className="text-xs text-gray-400">ou</span>
        <div className="h-px bg-gray-700 w-full" />
      </div>

      {/* EMAIL */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm text-gray-300">Adresse email</label>
        <input
          {...register("email")}
          id="email"
          type="email"
          placeholder="exemple@domaine.fr"
          className={`w-full p-3 rounded-lg bg-[#111317] border 
          ${errors.email ? "border-red-500" : "border-gray-700"} 
          focus:border-blue-500 transition`}
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message as string}</p>
        )}
      </div>

      {/* PASSWORD */}
      <PasswordField
        label="Mot de passe"
        placeholder="Votre mot de passe"
        register={register("password")}
        error={errors.password?.message as string}
      />

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
      >
        Se connecter
      </button>

      {/* FOOTER LINKS */}
      <div className="flex justify-between text-sm mt-3">
        <a href="/reset" className="text-blue-400 hover:underline">
          Mot de passe oublié ?
        </a>
        <a href="/register" className="text-gray-400 hover:underline">
          Créer un compte
        </a>
      </div>
    </form>
  );
}
