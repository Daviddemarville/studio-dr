import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Client Supabase pour API Routes (app/api/**)
 * Gère les cookies, sessions, login, logout, CRUD sécurisé.
 */
export async function supabaseRoute() {
  const cookieStore = await cookies(); // Next.js 16 = async cookies

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        /**
         * set/remove sont requis par l'interface, 
         * mais Next 16 rend cookies() read-only côté route → on laisse vides
         */
        set() {},
        remove() {},
      },
    }
  );
}
