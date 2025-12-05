export interface UserProfile {
  id: string;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  pseudo: string | null;
  avatar_url: string | null;
  bio_fr: string | null;
  bio_en: string | null;
  url_portfolio: string | null;
  url_linkedin: string | null;
  url_github: string | null;
  is_public: boolean;
  is_approved: boolean;
  role: string | null;
  created_at?: string;
  updated_at?: string;
}
