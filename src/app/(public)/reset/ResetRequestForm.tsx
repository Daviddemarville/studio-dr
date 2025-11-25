"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { resetRequestSchema } from "@/lib/zod/resetSchema";

export default function ResetRequestForm() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetRequestSchema),
  });

  const onSubmit = async (data: any) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-confirm`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
      );
      reset();

      setTimeout(() => {
        router.push("/");
      }, 1200);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-white">
      {/* EMAIL */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm text-gray-300">
          Adresse email
        </label>

        <input
          id="email"
          {...register("email")}
          type="email"
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          placeholder="exemple@domaine.fr"
        />

        {errors.email && (
          <p className="text-red-400 text-xs">{errors.email.message}</p>
        )}
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-white transition"
      >
        Envoyer le lien
      </button>
    </form>
  );
}
