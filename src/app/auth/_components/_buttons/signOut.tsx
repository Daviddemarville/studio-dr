"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export function LogoutButton() {
  const supabase = createClient();
  const [_user, setUser] = useState(null);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }
  }
  return (
    <button
      type="button"
      onClick={async () => {
        await signOut();
        setUser(null);
      }}
      // className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-transparent bg-black text-white hover:brightness-95"
    >
      <span className="text-sm">Logout</span>
    </button>
  );
}
