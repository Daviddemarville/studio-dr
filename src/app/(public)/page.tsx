import { supabaseServer } from "@/lib/supabase-server";
import { getTemplate } from "@/templates/sections/loader.server";
import SectionContact from "./components/SectionContact";
import SectionRenderer from "./components/SectionRenderer";
import BackToTop from "./components/ui/BackToTop";

export default async function HomePage() {
  const supabase = await supabaseServer();

  // Fetch all active sections ordered by position
  const { data: sections } = await supabase
    .from("site_sections")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });

  const sectionsData = sections || [];

  // Prepare all sections with their content and templates
  const sectionsWithData = await Promise.all(
    sectionsData.map(async (section) => {
      // Load template
      const template = section.template_slug
        ? await getTemplate(section.template_slug)
        : null;

      if (!template) return null;

      // Fetch content from the section's table
      let content: any[] = [];

      if (section.table_name === "users") {
        // Special case: users table (for team section)
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("is_approved", true)
          .eq("is_public", true);

        content = data || [];
        console.log("[DEBUG] Users loaded:", content.length, content);
      } else {
        // Standard sections with section_slug
        const { data } = await supabase
          .from(section.table_name)
          .select("*")
          .eq("section_slug", section.slug);

        // Order by display_order or step_number if applicable
        if (
          ["content_offers", "content_pricing"].includes(section.table_name)
        ) {
          content = (data || []).sort(
            (a: any, b: any) => (a.display_order || 0) - (b.display_order || 0),
          );
        } else if (section.table_name === "content_workflow_steps") {
          content = (data || []).sort(
            (a: any, b: any) => (a.step_number || 0) - (b.step_number || 0),
          );
        } else {
          content = data || [];
        }
      }

      return {
        section,
        content,
        template,
      };
    }),
  );

  // Filter out null sections
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

      {/* CONTACT SECTION (independent) */}
      <section id="contact">
        <SectionContact />
      </section>

      <BackToTop />
    </div>
  );
}
