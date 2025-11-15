"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export function useCurrentUser() {
  const supabase = supabaseBrowser();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return setUser(null);

      const { data: info } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      setUser({ ...data.user, ...info });
    };

    load();
  }, []);

  return user;
}
