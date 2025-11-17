import FormCard from "../components/ui/FormCard";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

export default async function EmailConfirmedPage() {
  const supabase = await supabaseServer();

  // Récupération dynamique du nom du site
  const { data } = await supabase
    .from("settings")
    .select("site_name")
    .single();

  const siteName = data?.site_name || "Votre espace";

  return (
    <FormCard title="Email confirmé">
      <p className="text-gray-300 mb-4 text-center leading-relaxed">
        Votre adresse email a bien été confirmée.
        <br />
        <span className="font-semibold text-white">
          Bienvenue sur {siteName} !
        </span>
        <br /><br />
        Vous pouvez maintenant vous connecter à votre compte.
      </p>

      <Link
        href="/login"
        className="block w-full text-center bg-blue-600 hover:bg-blue-700 py-2 rounded-lg mt-4"
      >
        Se connecter
      </Link>

      <Link
        href="/"
        className="block w-full text-center bg-blue-600 hover:bg-blue-700 py-2 rounded-lg mt-4"
      >
        Retour à l’accueil
      </Link>

    </FormCard>
  );
}
