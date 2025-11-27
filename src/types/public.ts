export interface Offer {
  id: string;
  price_ht?: number | string;
  is_active?: boolean;
  display_order?: number;

  title_fr?: string;
  title_en?: string;
  short_fr?: string;
  short_en?: string;
  long_fr?: string;
  long_en?: string;
}

export interface providerType {
  provider: "github" | "google" | "discord";
  className?: string;
}
