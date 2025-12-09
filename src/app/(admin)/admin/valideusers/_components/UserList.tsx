"use client";

import Image from "next/image";
import { useState } from "react";
import type { UserProfile } from "@/types/user-profile";
import UserRow from "./UserRow";

export default function UserList({ users }: { users: UserProfile[] }) {
  return (
    <div className="w-full">
      {/* DESKTOP VERSION (tableau) */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f1623] border-b">
            <tr>
              <th className="p-3 text-left">Utilisateur</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Rôle</th>
              <th className="p-3 text-center">Statut</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VERSION (cartes) */}
      <div className="md:hidden flex flex-col gap-4">
        {users.map((user) => (
          <MobileUserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function MobileUserCard({ user }: { user: UserProfile }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#0f1623] border border-gray-700 rounded-lg p-4 shadow">
      {/* Header : Avatar + Nom + Statut */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt="avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-gray-600"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600/40" />
          )}
          <div>
            <p className="font-medium text-white">
              {user.firstname} {user.lastname}
            </p>

            <p className="text-xs mt-1">
              {user.is_approved ? (
                <span className="text-green-400">Approuvé</span>
              ) : (
                <span className="text-red-400">En attente</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Bouton d'action */}
      <div className="mt-4">
        <ActionButton user={user} />
      </div>

      {/* Accordéon */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left mt-3 text-sm text-gray-300 hover:text-white transition"
      >
        {open ? "Masquer les détails ▲" : "Afficher les détails ▼"}
      </button>

      {open && (
        <div className="mt-2 text-sm text-gray-400 border-t border-gray-700 pt-2 space-y-1">
          <p>
            <span className="font-medium text-gray-300">Email :</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-medium text-gray-300">Rôle :</span>{" "}
            {user.role}
          </p>
        </div>
      )}
    </div>
  );
}

/* Petit bouton stylé, réutilise la logique via UserRow */
function ActionButton({ user }: { user: UserProfile }) {
  // On exploite ton UserRow actuel en isolant la logique
  const action = user.is_approved ? "Désapprouver" : "Valider";
  const color = user.is_approved
    ? "bg-red-600 hover:bg-red-700"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <button
      type="button"
      onClick={() => {
        const evt = new CustomEvent("toggle-user", { detail: user.id });
        window.dispatchEvent(evt);
      }}
      className={`w-full py-2 rounded-md text-sm text-white font-medium ${color} transition`}
    >
      {action}
    </button>
  );
}
