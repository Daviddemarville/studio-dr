"use client";

import { useState } from "react";
import type {
  PublicDBRow,
  PublicSection,
  PublicTemplate,
} from "@/types/public";

import {
  CardsWithImage,
  FAQ,
  GenericRepeater,
  GenericSimple,
  Logos,
  Pricing,
  QuiSommesNous,
  Testimonials,
  Workflow,
} from "./SectionRenderer/index";

/* ============================================================================
 * TYPES
 * ============================================================================
 */

/**
 * Props reçues depuis page.tsx
 * - section : métadonnées issues de site_sections
 * - content : lignes normalisées (selon table_name)
 * - template : template chargé via loader.server
 */
interface SectionRendererProps {
  section: PublicSection;
  content: PublicDBRow[];
  template: PublicTemplate;
}

/**
 * Props attendues par toutes les vues spécialisées
 * ⚠️ Ne PAS diverger de cette signature
 */
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

/* ============================================================================
 * ROUTING PAR TEMPLATE_SLUG (SOURCE DE VÉRITÉ = DB)
 * ============================================================================
 *
 * ⚠️ Les clés DOIVENT correspondre EXACTEMENT à site_sections.template_slug
 * ⚠️ Si un slug n’est pas ici → fallback générique volontaire
 */
const SPECIAL_VIEWS: Record<string, React.FC<ViewProps>> = {
  section_qui_sommes_nous: QuiSommesNous,
  section_comment_travaillons_nous: Workflow,
  section_faq: FAQ,
  section_logos_confiance: Logos,
  section_temoignages: Testimonials,
  section_nos_tarifs: Pricing,
  section_cards_with_image: CardsWithImage,
};

/* ============================================================================
 * UTILITAIRE DE LOCALISATION FR / EN
 * ============================================================================
 *
 * Règle :
 * 1. FR si lang === fr et dispo
 * 2. EN si dispo
 * 3. FR fallback
 * 4. champ brut
 */
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

/* ============================================================================
 * SECTION RENDERER — POINT D’ENTRÉE UNIQUE
 * ============================================================================
 *
 * Ordre STRICT :
 * 1️⃣ Vue spécialisée (si template_slug reconnu)
 * 2️⃣ Générique avec repeater
 * 3️⃣ Générique simple
 *
 * Aucun autre comportement autorisé ici.
 */
export default function SectionRenderer({
  section,
  content,
  template,
}: SectionRendererProps) {
  // Lang figé pour l’instant (switch possible plus tard)
  const [lang] = useState<"fr" | "en">("fr");

  // Sécurité : pas de rendu vide ou incohérent
  if (!template || !Array.isArray(content) || content.length === 0) {
    return null;
  }

  /* ------------------------------------------------------------------------
   * 1️⃣ Vue spécialisée basée sur template_slug
   * ------------------------------------------------------------------------ */
  if (section.template_slug && section.template_slug in SPECIAL_VIEWS) {
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

  /* ------------------------------------------------------------------------
   * 2️⃣ Fallback générique — template avec repeater
   * ------------------------------------------------------------------------ */
  const hasRepeater =
    Array.isArray(template.fields) &&
    template.fields.some((field) => field.type === "repeater");

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

  /* ------------------------------------------------------------------------
   * 3️⃣ Fallback générique simple (dernier recours)
   * ------------------------------------------------------------------------ */
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
