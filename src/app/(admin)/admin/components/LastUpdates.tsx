import { supabaseServer } from "@/lib/supabase-server";

export default async function LastUpdates() {
  const supabase = await supabaseServer();

  // 1) Dernières modifications
  const { data: changes } = await supabase
    .from("content_changes")
    .select("id, section_slug, action, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  // 2) Sections → titres lisibles
  const { data: siteSections } = await supabase
    .from("site_sections")
    .select("slug, title");

  const titleMap: Record<string, string> = {};
  if (siteSections) {
    for (const s of siteSections) {
      titleMap[s.slug] = s.title;
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (!changes || changes.length === 0) {
    return (
      <div
        className="
          bg-gray-800/60 backdrop-blur-sm border border-gray-700/40 
        p-5 rounded-xl shadow-xl 
        hover:shadow-2xl hover:border-blue-400/40
        transition-all duration-300
        "
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-100">
          Dernières modifications
        </h2>
        <p className="text-gray-400 text-sm">
          Aucune modification récente n’a été enregistrée.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        w-full bg-gray-800/60 backdrop-blur-sm border border-gray-700/40 
        p-5 rounded-xl shadow-xl 
        hover:shadow-2xl hover:border-blue-400/40
        transition-all duration-300
      "
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-100">
        Dernières modifications
      </h2>

      <ul className="space-y-3">
        {changes.map((entry) => (
          <li
            key={entry.id}
            className="
              p-4 rounded-lg border border-gray-700/40 bg-gray-900/60
              transition-all duration-300
              hover:-translate-y-0.5 
              hover:shadow-xl hover:border-blue-400/40
            "
          >
            <div className="text-gray-200 font-semibold">
              {titleMap[entry.section_slug] ?? entry.section_slug}
            </div>

            <div className="text-gray-400 text-sm">
              {entry.action === "update" && "Mise à jour"}
              {entry.action === "create" && "Création"}
              {entry.action === "delete" && "Suppression"}
            </div>

            <div className="text-gray-500 text-xs mt-1">
              {formatDate(entry.created_at)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
