"use client";

import type { UserProfile } from "@/types/user-profile";

export default function ProfileBioFields({
  profile,
  setProfile,
}: {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}) {
  return (
    <div className="bg-neutral-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Biographie</h2>

      <label className="block mb-2">Biographie FR</label>
      <textarea
        value={profile.bio_fr || ""}
        onChange={(e) => setProfile({ ...profile, bio_fr: e.target.value })}
        className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded min-h-[120px]"
      />

      <label className="block mt-4 mb-2">Biographie EN</label>
      <textarea
        value={profile.bio_en || ""}
        onChange={(e) => setProfile({ ...profile, bio_en: e.target.value })}
        className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded min-h-[120px]"
      />
    </div>
  );
}
