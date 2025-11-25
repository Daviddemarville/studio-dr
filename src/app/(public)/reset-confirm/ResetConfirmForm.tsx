"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { resetConfirmSchema } from "@/lib/zod/resetSchema";
import PasswordField from "../components/ui/PasswordField";

export default function ResetConfirmForm() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetConfirmSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Mot de passe mis à jour !");
    reset();

    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-white">
      {/* NOUVEAU MOT DE PASSE */}
      <PasswordField
        label="Nouveau mot de passe"
        placeholder="Créer un nouveau mot de passe"
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
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white transition ${
          loading
            ? "bg-blue-800 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Mise à jour..." : "Mettre à jour"}
      </button>
    </form>
  );
}
