"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getMessages(filter: "all" | "unread" = "all") {
    const supabase = await createClient();

    let query = supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

    if (filter === "unread") {
        query = query.eq("is_read", false);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erreur getMessages:", error);
        return [];
    }

    return data;
}

export async function deleteMessage(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Erreur deleteMessage:", error);
        throw new Error("Impossible de supprimer le message");
    }

    revalidatePath("/admin/message");
}

export async function toggleRead(id: string, value: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: value })
        .eq("id", id);

    if (error) {
        console.error("Erreur toggleRead:", error);
        throw new Error("Impossible de modifier le statut");
    }

    revalidatePath("/admin/message");
}
