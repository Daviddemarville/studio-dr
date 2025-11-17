"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/zod/registerSchema";
import PasswordField from "../components/ui/PasswordField";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      toast.error(json.error || "Erreur lors de l’inscription.");
      return;
    }

    toast.success("Compte créé ! Vérifiez vos emails.");
    reset(); // remet le formulaire à zéro

    setTimeout(() => {
      router.push("/");
    }, 1200);
  }; // <-- ICI manquait ta fermeture de fonction !!!

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-white">

      {/* PRÉNOM + NOM */}
      <div className="flex gap-4">
        <div className="w-full space-y-1">
          <label className="text-sm text-gray-300">Prénom</label>
          <input
            {...register("firstname")}
            className={`w-full p-3 rounded-lg bg-[#111317] border 
              ${errors.firstname ? "border-red-500" : "border-gray-700"} 
              focus:border-blue-500 transition`}
            placeholder="Votre prénom"
          />
          {errors.firstname && (
            <p className="text-sm text-red-400">
              {errors.firstname.message as string}
            </p>
          )}
        </div>

        <div className="w-full space-y-1">
          <label className="text-sm text-gray-300">Nom</label>
          <input
            {...register("lastname")}
            className={`w-full p-3 rounded-lg bg-[#111317] border 
              ${errors.lastname ? "border-red-500" : "border-gray-700"} 
              focus:border-blue-500 transition`}
            placeholder="Votre nom"
          />
          {errors.lastname && (
            <p className="text-sm text-red-400">
              {errors.lastname.message as string}
            </p>
          )}
        </div>
      </div>

      {/* PSEUDO */}
      <div className="space-y-1">
        <label className="text-sm text-gray-300">Pseudo (optionnel)</label>
        <input
          {...register("pseudo")}
          className={`w-full p-3 rounded-lg bg-[#111317] border 
            ${errors.pseudo ? "border-red-500" : "border-gray-700"} 
            focus:border-blue-500 transition`}
          placeholder="Votre pseudo"
        />
        {errors.pseudo && (
          <p className="text-sm text-red-400">
            {errors.pseudo.message as string}
          </p>
        )}
      </div>

      {/* EMAIL */}
      <div className="space-y-1">
        <label className="text-sm text-gray-300">Adresse email</label>
        <input
          {...register("email")}
          className={`w-full p-3 rounded-lg bg-[#111317] border 
            ${errors.email ? "border-red-500" : "border-gray-700"} 
            focus:border-blue-500 transition`}
          placeholder="exemple@domaine.fr"
        />
        {errors.email && (
          <p className="text-sm text-red-400">
            {errors.email.message as string}
          </p>
        )}
      </div>

      {/* MOT DE PASSE */}
      <PasswordField
        label="Mot de passe"
        placeholder="Créer un mot de passe"
        register={register("password")}
        error={errors.password?.message as string}
      />

      {/* CONFIRMATION */}
      <PasswordField
        label="Confirmer le mot de passe"
        placeholder="Retapez le mot de passe"
        register={register("confirm")}
        error={errors.confirm?.message as string}
      />

      {/* SUBMIT */}
      <button className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg text-white transition">
        Créer le compte
      </button>

      {/* FOOTER */}
      <p className="text-sm text-center text-gray-400">
        Déjà un compte ?{" "}
        <a href="/login" className="text-blue-400 hover:underline">
          Se connecter
        </a>
      </p>
    </form>
  );
}
