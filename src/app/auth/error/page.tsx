import FormCard from "@/app/(public)/components/ui/FormCard";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <FormCard title="Lien invalide ou expiré">
      <p className="text-gray-300 mb-4 text-center leading-relaxed">
        Le lien que vous avez utilisé n’est plus valide.
        <br />
        Il peut avoir expiré, déjà été utilisé, ou être incomplet.
      </p>

      <Link
        href="/register"
        className="block w-full text-center bg-blue-600 hover:bg-blue-700 py-2 rounded-lg mt-4"
      >
        Créer un compte
      </Link>

      <Link
        href="/login"
        className="block w-full text-center bg-gray-700 hover:bg-gray-600 py-2 rounded-lg mt-3"
      >
        Se connecter
      </Link>

      <Link
        href="/"
        className="block w-full text-center text-gray-300 hover:underline mt-3"
      >
        Retour à l’accueil
      </Link>
    </FormCard>
  );
}
