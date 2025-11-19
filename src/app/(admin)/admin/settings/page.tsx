import { supabaseServer } from "@/lib/supabase-server";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
  const supabase = await supabaseServer();

  // Charger les settings actuelles
  const { data: settings, error } = await supabase
    .from("settings")
    .select("*")
    .single();

  if (error) {
    console.error("Erreur chargement settings:", error);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres du site</h1>

      <SettingsForm initialValues={settings} />
    </div>
  );
}
