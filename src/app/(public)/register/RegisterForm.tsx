// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import { registerSchema } from "@/lib/zod/registerSchema";
// import PasswordField from "../components/ui/PasswordField";

// export default function RegisterForm() {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: zodResolver(registerSchema),
//   });

//   const onSubmit = async (data: any) => {
//     const res = await fetch("/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });

//     const json = await res.json();

//     if (!res.ok) {
//       toast.error(json.error || "Erreur lors de l’inscription.");
//       return;
//     }

//     toast.success("Compte créé ! Vérifiez vos emails.");
//     reset(); // remet le formulaire à zéro

//     setTimeout(() => {
//       router.push("/");
//     }, 1200);
//   }; // <-- ICI manquait ta fermeture de fonction !!!

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-white">
//       {/* PRÉNOM + NOM */}
//       {/* PRENOM */}
//       <div className="flex gap-4">
//         <div className="w-full space-y-1">
//           <label htmlFor="firstname" className="text-sm text-gray-300">
//             Prénom
//           </label>
//           <input
//             id="firstname"
//             {...register("firstname")}
//             className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
//             placeholder="Jean"
//           />
//           {errors.firstname && (
//             <p className="text-red-400 text-xs">{errors.firstname.message}</p>
//           )}
//         </div>

//         {/* NOM */}
//         <div className="w-full space-y-1">
//           <label htmlFor="lastname" className="text-sm text-gray-300">
//             Nom
//           </label>
//           <input
//             id="lastname"
//             {...register("lastname")}
//             className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
//             placeholder="Dupont"
//           />
//           {errors.lastname && (
//             <p className="text-red-400 text-xs">{errors.lastname.message}</p>
//           )}
//         </div>
//       </div>

//       {/* PSEUDO */}
//       <div className="space-y-1">
//         <label htmlFor="pseudo" className="text-sm text-gray-300">
//           Pseudo (optionnel)
//         </label>
//         <input
//           id="pseudo"
//           {...register("pseudo")}
//           className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
//           placeholder="jdupont"
//         />
//         {errors.pseudo && (
//           <p className="text-red-400 text-xs">{errors.pseudo.message}</p>
//         )}
//       </div>

//       {/* EMAIL */}
//       <div className="space-y-1">
//         <label htmlFor="email" className="text-sm text-gray-300">
//           Adresse email
//         </label>
//         <input
//           id="email"
//           {...register("email")}
//           type="email"
//           className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
//           placeholder="jean.dupont@example.com"
//         />
//         {errors.email && (
//           <p className="text-red-400 text-xs">{errors.email.message}</p>
//         )}
//       </div>

//       {/* PASSWORD */}
//       <div className="space-y-1">
//         <PasswordField
//           label="Mot de passe"
//           register={register("password")}
//           error={errors.password?.message}
//         />
//       </div>

//       {/* CONFIRM PASSWORD */}
//       <div className="space-y-1">
//         <PasswordField
//           label="Confirmer le mot de passe"
//           register={register("confirm")}
//           error={errors.confirm?.message}
//         />
//       </div>

//       {/* SUBMIT */}
//       <button
//         type="submit"
//         className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg text-white transition"
//       >
//         Créer le compte
//       </button>

//       {/* FOOTER */}
//       <p className="text-sm text-center text-gray-400">
//         Déjà un compte ?{" "}
//         <a href="/login" className="text-blue-400 hover:underline">
//           Se connecter
//         </a>
//       </p>
//     </form>
//   );
// }
