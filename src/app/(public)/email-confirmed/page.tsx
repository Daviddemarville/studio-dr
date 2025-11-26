// import Link from "next/link";
// import { createClient } from "@/lib/supabase-server";
// import FormCard from "../components/ui/FormCard";

// export default async function EmailConfirmedPage({
//   searchParams,
// }: {
//   searchParams: { pending?: string };
// }) {
//   const supabase = await createClient();

//   // Récupération dynamique du nom du site
//   const { data } = await supabase.from("settings").select("site_name").single();

//   const siteName = data?.site_name || "Votre espace";
//   const isPending = searchParams.pending === "true";

//   return (
//     <FormCard title={isPending ? "Compte en attente" : "Email confirmé"}>
//       {isPending ? (
//         <p className="text-gray-300 mb-4 text-center leading-relaxed">
//           Votre compte a été créé avec succès.
//           <br />
//           <span className="font-semibold text-yellow-400">
//             ⏳ En attente de validation
//           </span>
//           <br />
//           <br />
//           Un administrateur doit approuver votre compte avant que vous puissiez
//           accéder à <strong>{siteName}</strong>.
//           <br />
//           Vous recevrez un email dès que votre compte sera validé.
//         </p>
//       ) : (
//         <>
//           <p className="text-gray-300 mb-4 text-center leading-relaxed">
//             Votre adresse email a bien été confirmée.
//             <br />
//             <span className="font-semibold text-white">
//               Bienvenue sur {siteName} !
//             </span>
//             <br />
//             <br />
//             Vous pouvez maintenant vous connecter à votre compte.
//           </p>

//           <Link
//             href="/signIn"
//             className="block w-full text-center bg-blue-600 hover:bg-blue-700 py-2 rounded-lg mt-4"
//           >
//             Se connecter
//           </Link>
//         </>
//       )}

//       <Link
//         href="/"
//         className="block w-full text-center bg-blue-600 hover:bg-blue-700 py-2 rounded-lg mt-4"
//       >
//         Retour à l’accueil
//       </Link>
//     </FormCard>
//   );
// }
