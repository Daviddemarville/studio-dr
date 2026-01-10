"use server";

import { revalidatePath } from "next/cache";

/**
 * Invalide les caches liés aux settings du site
 * À appeler après modification des settings dans l'admin
 */
export async function revalidateSiteSettings() {
  revalidatePath("/", "layout");
}

/**
 * Invalide les caches liés aux sections de navigation
 * À appeler après modification des sections
 */
export async function revalidateNavSections() {
  revalidatePath("/", "layout");
}
