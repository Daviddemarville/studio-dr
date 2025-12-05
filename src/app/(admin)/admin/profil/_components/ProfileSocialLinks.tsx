"use client";

import type { UserProfile } from "@/types/user-profile";

export default function ProfileSocialLinks({
  profile,
  setProfile,
}: {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}) {
  return (
    <div className="bg-neutral-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Liens & réseaux sociaux</h2>

      <div className="flex flex-col gap-3">
        <input
          type="url"
          placeholder="URL Portfolio"
          value={profile.url_portfolio || ""}
          onChange={(e) =>
            setProfile({ ...profile, url_portfolio: e.target.value })
          }
          className="bg-neutral-800 border border-neutral-700 p-2 rounded"
        />

        <input
          type="url"
          placeholder="URL LinkedIn"
          value={profile.url_linkedin || ""}
          onChange={(e) =>
            setProfile({ ...profile, url_linkedin: e.target.value })
          }
          className="bg-neutral-800 border border-neutral-700 p-2 rounded"
        />

        <input
          type="url"
          placeholder="URL GitHub"
          value={profile.url_github || ""}
          onChange={(e) =>
            setProfile({ ...profile, url_github: e.target.value })
          }
          className="bg-neutral-800 border border-neutral-700 p-2 rounded"
        />
      </div>
    </div>
  );
}
