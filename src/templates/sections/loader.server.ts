"use server";

import fs from "node:fs";
import path from "node:path";
import {
  TemplateSchema,
  type TemplateSchemaType,
} from "@/lib/zod/sectionTemplateSchema";

/* ------------------------------------------------------------------
   Type interne au loader : modèle Zod + propriété slug ajoutée ici
------------------------------------------------------------------ */
export interface TemplateWithSlug extends TemplateSchemaType {
  slug: string;
}

const templatesDir = path.join(process.cwd(), "src", "templates", "sections");

export async function loadTemplates(): Promise<TemplateWithSlug[]> {
  const files = fs.readdirSync(templatesDir);

  const templates = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const content = fs.readFileSync(path.join(templatesDir, file), "utf8");
      const json = JSON.parse(content);

      const parsed = TemplateSchema.safeParse(json);
      if (!parsed.success) {
        console.error(
          `[TEMPLATE ERROR] ${file} invalide :`,
          parsed.error.issues,
        );
        return null;
      }

      return {
        slug: file.replace(".json", ""),
        ...parsed.data,
      };
    })
    .filter((t): t is TemplateWithSlug => t !== null);

  return templates;
}

export async function getTemplate(
  slug: string,
): Promise<TemplateWithSlug | null> {
  const templates = await loadTemplates();
  return templates.find((t) => t.slug === slug) || null;
}
