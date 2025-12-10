"use client";

import type { UserProfile } from "@/types/user-profile";
import AvatarPreview from "./AvatarPreview";

export default function ProfileAvatarUploader({
  profile,
  setProfile,
}: {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}) {
  return (
    <div className="bg-neutral-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Avatar</h2>

      <div className="flex flex-col items-center justify-center">
        <AvatarPreview
          avatarUrl={profile.avatar_url}
          userId={profile.id}
          onChange={(url) => setProfile({ ...profile, avatar_url: url })}
        />
      </div>
    </div>
  );
}
