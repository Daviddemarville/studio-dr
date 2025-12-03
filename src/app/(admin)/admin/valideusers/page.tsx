import { createClient } from "@/lib/supabase-server";
import UserList from "./_components/UserList";

export default async function ValidateUsersPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("users")
    .select("id, firstname, lastname, email, role, is_approved, avatar_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return <div>Erreur lors du chargement des utilisateurs.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Validation des utilisateurs</h1>
      <UserList users={users || []} />
    </div>
  );
}
