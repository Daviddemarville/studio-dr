// ==============================
// Type: Settings (table settings)
// ==============================

export interface Settings {
  id: string;
  site_name: string | null;
  language_default: string | null;
  maintenance_mode: boolean;
  logo_url: string | null;
  tagline: string | null;
  site_description: string | null;
  favicon_url: string | null;
  default_meta_image_url: string | null;
  available_languages: string[];
  maintenance_message_fr: string | null;
  maintenance_message_en: string | null;
  maintenance_allowlist: string[] | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  google_maps_url: string | null;
  social_facebook_url: string | null;
  social_instagram_url: string | null;
  social_linkedin_url: string | null;
  social_github_url: string | null;
  meta_default_title: string | null;
  meta_default_description: string | null;
  ga_tracking_id: string | null;
  created_at: string;
  updated_at: string;
}

// ==================================
// Type: Mentions légales (JSON)
// ==================================

export interface MentionsLegales {
  editor: {
    type: string;
    full_name: string;
    siret: string | null;
    rcs: string | null;
    tva_intra: string | null;
    director_publication: string;
    editor_responsible: string | null;
  };
  host: {
    name: string;
    company: string;
    address: string;
    phone: string;
  };
  intellectual_property: {
    title: string;
    content: string;
  };
  liability: {
    title: string;
    content: string;
  };
}

// ==================================
// Type: Conditions générales de vente
// ==================================

export interface ConditionsVente {
  introduction: { title: string; content: string };
  services: { title: string; content: string };
  pricing: { title: string; content: string };
  payment: { title: string; content: string };
  delivery: { title: string; content: string };
  responsability: { title: string; content: string };
  intellectual_property: { title: string; content: string };
  termination: { title: string; content: string };
}

// ==================================
// Type: Politique de confidentialité
// ==================================

export interface PolitiqueConfidentialite {
  introduction: { title: string; content: string };
  data_controller: { title: string; content: string };
  data_collected: { title: string; content: string };
  purpose: { title: string; content: string };
  legal_basis: { title: string; content: string };
  retention: { title: string; content: string };
  rights: { title: string; content: string };
  cookies: { title: string; content: string };
  security: { title: string; content: string };
  third_parties: { title: string; content: string };
  contact: { title: string; content: string };
}
