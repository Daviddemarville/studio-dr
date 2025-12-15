import { createClient } from "@/lib/supabase-server";
import { getTemplate } from "@/templates/sections/loader.server";
import type { PublicDBRow } from "@/types/public";
import SectionContact from "./components/SectionContact";
import SectionRenderer from "./components/SectionRenderer";
import BackToTop from "./components/ui/BackToTop";

export default async function HomePage() {
  const supabase = await createClient();

  // --- Fetch all active public sections ordered by position ---
  const { data: sections } = await supabase
    .from("site_sections")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });

  const sectionsData = sections || [];

  // --- Load templates & normalize content for each section ---
  const sectionsWithData = await Promise.all(
    sectionsData.map(async (section) => {
      const template = section.template_slug
        ? await getTemplate(section.template_slug)
        : null;

      if (!template) return null;

      let content: PublicDBRow[] = [];

      // -----------------------------------------
      // CASE 1: QUI SOMMES NOUS (users)
      // -----------------------------------------
      if (section.table_name === "users") {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("is_approved", true)
          .eq("is_public", true);

        content = (data || []).map((row) => ({
          ...row,
        }));
      }

      // -----------------------------------------
      // CASE 2: WORKFLOW (content_workflow_steps)
      // -----------------------------------------
      if (section.table_name === "content_workflow_steps") {
        const { data } = await supabase
          .from("content_workflow_steps")
          .select("*")
          .eq("section_slug", section.slug)
          .eq("is_active", true);

        content = (data || []).map((row) => ({
          ...row,
          content: row.content ?? {},
        }));
      }

      // -----------------------------------------
      // CASE 3: PRICING (content_pricing)
      // -----------------------------------------
      if (section.table_name === "content_pricing") {
        const { data } = await supabase
          .from("content_pricing")
          .select("*")
          .eq("section_slug", section.slug)
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        content = (data || []).map((row) => ({
          id: row.id,
          price_ht: row.price_ht,
          tva_rate: row.tva_rate,
          price_ttc: row.price_ttc,
          content: row.content ?? {},
        }));
      }

      // -----------------------------------------
      // CASE 4: All sections stored in custom tables
      // -----------------------------------------
      else {
        const { data } = await supabase
          .from(section.table_name)
          .select("*")
          .eq("section_slug", section.slug);

        let rows = data || [];

        // Sort depending on known ordering rules
        if (section.table_name === "content_workflow_steps") {
          rows = rows.sort(
            (a, b) =>
              ((a.step_number as number) || 0) -
              ((b.step_number as number) || 0),
          );
        }

        if (
          ["content_offers", "content_pricing"].includes(section.table_name)
        ) {
          rows = rows.sort(
            (a, b) =>
              ((a.display_order as number) || 0) -
              ((b.display_order as number) || 0),
          );
        }

        // Normalize rows → PublicDBRow[]
        content = rows.map((row) => ({
          id: row.id,
          content: (row.content as Record<string, unknown>) ?? row ?? {},
        }));
      }

      return {
        section,
        content,
        template,
      };
    }),
  );

  // Remove null entries
  const validSections = sectionsWithData.filter(
    (s): s is NonNullable<typeof s> => s !== null,
  );

  return (
    <div className="space-y-16">
      {/* DYNAMIC SECTIONS */}
      {validSections.map(({ section, content, template }) => (
        <SectionRenderer
          key={section.id}
          section={section}
          content={content}
          template={template}
        />
      ))}

      {/* CONTACT SECTION */}
      <section id="contact">
        <SectionContact />
      </section>

      <BackToTop />
    </div>
  );
}
