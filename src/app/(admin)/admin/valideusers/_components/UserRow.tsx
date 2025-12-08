"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import type { UserProfile } from "@/types/user-profile";
import { toggleUserApproval } from "../actions";

export default function UserRow({ user }: { user: UserProfile }) {
  const handleToggle = useCallback(async () => {
    try {
      const nextStatus = !user.is_approved;
      await toggleUserApproval(user.id, nextStatus);

      if (nextStatus) {
        toast.success("Utilisateur approuvé !");
      } else {
        toast.info("Utilisateur désapprouvé.");
      }
    } catch {
      toast.error("Erreur lors de la mise à jour.");
    }
  }, [user.id, user.is_approved]);

  useEffect(() => {
    const handler = (e: CustomEvent<string>) => {
      if (e.detail === user.id) handleToggle();
    };

    window.addEventListener("toggle-user", handler as EventListener);
    return () =>
      window.removeEventListener("toggle-user", handler as EventListener);
  }, [user.id, handleToggle]);

  return (
    <tr className="border-b">
      <td className="p-3 flex items-center gap-3">
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt="avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
        )}
        {user.firstname} {user.lastname}
      </td>

      <td className="p-3">{user.email}</td>

      <td className="p-3 capitalize">{user.role}</td>

      <td className="p-3 text-center">
        {user.is_approved ? (
          <span className="text-green-600 font-medium">Approuvé</span>
        ) : (
          <span className="text-red-600 font-medium">En attente</span>
        )}
      </td>

      <td className="p-3 text-center">
        <button
          type="button"
          onClick={handleToggle}
          className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {user.is_approved ? "Désapprouver" : "Valider"}
        </button>
      </td>
    </tr>
  );
}
