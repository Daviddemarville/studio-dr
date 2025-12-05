"use client";

import ProfileEditor from "./_components/ProfileEditor";

export default function ProfilPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mon profil</h1>
      <ProfileEditor />
    </div>
  );
}
