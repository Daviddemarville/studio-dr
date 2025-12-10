// src/types/admin-user.ts
export interface AdminUser {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  role: string | null;
  is_approved: boolean;
  avatar_url: string | null;
  created_at: string;
}

/**
 * Déclaration globale pour autoriser l’événement custom "toggle-user"
 */
declare global {
  interface WindowEventMap {
    "toggle-user": CustomEvent<string>;
  }
}
