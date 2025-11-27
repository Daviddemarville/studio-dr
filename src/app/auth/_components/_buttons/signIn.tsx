"use client";

import { createClient } from "@/lib/supabase-browser";
import type { providerType } from "@/types/public";

const supabase = createClient();

export function SignInButton({ provider, className }: providerType) {
  async function handleClick() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });
    if (error) {
      console.error(error);
      return;
    }
  }
  return (
    <button
      type="button"
      onClick={async () => await handleClick()}
      className={
        `my-2 cursor-pointer w-full flex items-center justify-center gap-2 py-2 rounded-lg border hover:brightness-95 ` +
        (className ?? "")
      }
    >
      <span className="text-sm">Continue with {provider}</span>
    </button>
  );
}
