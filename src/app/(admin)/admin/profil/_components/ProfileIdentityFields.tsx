"use client";

import type { UserProfile } from "@/types/user-profile";

export default function ProfileIdentityFields({
  profile,
  setProfile,
}: {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}) {
  return (
    <div className="bg-neutral-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstname" className="block mb-1">
            Prénom
          </label>
          <input
            id="firstname"
            type="text"
            value={profile.firstname || ""}
            onChange={(e) =>
              setProfile({ ...profile, firstname: e.target.value })
            }
            className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="lastname" className="block mb-1">
            Nom
          </label>
          <input
            id="lastname"
            type="text"
            value={profile.lastname || ""}
            onChange={(e) =>
              setProfile({ ...profile, lastname: e.target.value })
            }
            className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="pseudo" className="block mb-1">
            Pseudo
          </label>
          <input
            id="pseudo"
            type="text"
            value={profile.pseudo || ""}
            onChange={(e) => setProfile({ ...profile, pseudo: e.target.value })}
            className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1">
            Email (profil)
          </label>
          <input
            id="email"
            type="text"
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded"
          />
        </div>
      </div>
    </div>
  );
}
