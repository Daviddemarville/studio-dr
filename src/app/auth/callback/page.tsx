import { redirect } from "next/navigation";

export default function CallbackPage({ searchParams }: { searchParams: any }) {
  // Recompose la query string complète
  const qs = new URLSearchParams(searchParams).toString();

  // Redirection vers ton API route (celle qui contient ton callback complet)
  redirect(`/api/auth/callback?${qs}`);
}
