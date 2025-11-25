import { Layers, Mail, Users } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";
import DashboardCard from "./components/DashboardCard";
import LastUpdates from "./components/LastUpdates";
import PreviewSite from "./components/PreviewSite";
import UserDisplayName from "./components/UserDisplayName";
import OpenPreviewButton from "./components/ui/OpenPreviewButton";
import { formatDashboardDate } from "./dashboard-utils";

export default async function AdminDashboard() {
  const supabase = await supabaseServer();

  // ---- FETCH DATA ----
  const { count: rawSectionsCount } = await supabase
    .from("site_sections")
    .select("*", { count: "exact", head: true });
  const sectionsCount = rawSectionsCount ?? 0;

  const { count } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const usersCount = count ?? 0;

  const { data: pendingUsers } = await supabase
    .from("users")
    .select("id")
    .eq("is_approved", false);

  const { count: messagesCount } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true });

  const { date, time } = formatDashboardDate();

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white">
          Bienvenue <UserDisplayName /> dans votre panneau de contrôle.
        </h1>
        <p className="text-gray-400">
          {date} — {time}
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          icon={Layers}
          title="Sections du site"
          value={sectionsCount ?? 0}
          sub="Contenu éditorial publié"
        />

        <DashboardCard
          icon={Users}
          title="Utilisateurs"
          value={`${usersCount ?? 0} utilisateur${usersCount > 1 ? "s" : ""} actifs`}
          sub={`${pendingUsers?.length ?? 0} en attente d'approbation`}
        />

        <DashboardCard
          icon={Mail}
          title="Messages reçus"
          value={messagesCount ?? 0}
          sub="Messages du formulaire"
        />
      </div>

      {/* LAST UPDATES */}
      <div className="mt-10">
        <LastUpdates />
      </div>

      {/* PREVIEW EXISTANTE */}
      <div className="mt-12 hidden md:block">
        <PreviewSite />
      </div>
      <div className="mt-4 flex justify-end">
        <h2 className="sr-only md:hidden">Ouvrir l'aperçu du site</h2>
        <OpenPreviewButton href="/" />
      </div>
    </div>
  );
}
