"use client";

import { useState } from "react";
import type {
  PublicDBRow,
  PublicSection,
  PublicTemplate,
} from "@/types/public";
import {
  FAQ,
  GenericRepeater,
  GenericSimple,
  Logos,
  QuiSommesNous,
  Testimonials,
  Workflow,
} from "./SectionRenderer/index";

interface SectionRendererProps {
  section: PublicSection;
  content: PublicDBRow[];
  template: PublicTemplate;
}

type ViewProps = {
  section: PublicSection;
  content: PublicDBRow[];
  template: PublicTemplate;
  lang: "fr" | "en";
  getLocalizedValue: (
    obj: Record<string, unknown>,
    field: string,
    lang: "fr" | "en",
  ) => string;
};

/** Mapping slug → composant spécifique */
const SPECIAL_VIEWS: Record<string, React.FC<ViewProps>> = {
  section_qui_sommes_nous: QuiSommesNous,
  section_comment_travaillons_nous: Workflow,
  section_faq: FAQ,
  section_logos_confiance: Logos,
  section_temoignages: Testimonials,
};

/** Utilitaire FR/EN */
const getLocalizedValue = (
  obj: Record<string, unknown>,
  fieldName: string,
  lang: "fr" | "en",
): string => {
  const frKey = `${fieldName}_fr`;
  const enKey = `${fieldName}_en`;

  if (lang === "fr" && obj[frKey]) return String(obj[frKey]);
  if (obj[enKey]) return String(obj[enKey]);
  if (obj[frKey]) return String(obj[frKey]);
  return String(obj[fieldName] ?? "");
};

export default function SectionRenderer({
  section,
  content,
  template,
}: SectionRendererProps) {
  const [lang] = useState<"fr" | "en">("fr");

  if (!template || !content.length) return null;

  // === 1. Section avec vue spécialisée ?
  if (section.template_slug && SPECIAL_VIEWS[section.template_slug]) {
    const View = SPECIAL_VIEWS[section.template_slug];

    return (
      <View
        section={section}
        content={content}
        template={template}
        lang={lang}
        getLocalizedValue={getLocalizedValue}
      />
    );
  }

  // === 2. Détection repeater ===
  const hasRepeater =
    Array.isArray(template.fields) &&
    template.fields.some((f) => f.type === "repeater");

  // === 3. Fallbacks génériques ===
  if (hasRepeater) {
    return (
      <GenericRepeater
        section={section}
        content={content}
        template={template}
        lang={lang}
        getLocalizedValue={getLocalizedValue}
      />
    );
  }

  return (
    <GenericSimple
      section={section}
      content={content}
      template={template}
      lang={lang}
      getLocalizedValue={getLocalizedValue}
    />
  );
}
