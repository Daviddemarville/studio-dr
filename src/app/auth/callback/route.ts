import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(`${origin}/auth/signIn?error=missing_config`);
  }

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    });

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user && data.user.email) {
      // Check if user exists in public.users, if not create them
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!existingUser) {
        // Create user profile in public.users table
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          firstname:
            data.user.user_metadata?.firstname || 
            data.user.user_metadata?.first_name ||
            data.user.user_metadata?.given_name || 
            data.user.user_metadata?.family_name || 
            data.user.user_metadata?.name ||
            data.user.user_metadata?.full_name?.split(" ")[0] ||
            null,
          lastname:
            data.user.user_metadata?.lastname ||
            data.user.user_metadata?.last_name ||
            data.user.user_metadata?.full_name?.split(" ").slice(1).join(" ") ||
            null,
          pseudo:data.user.user_metadata?.username || data.user.user_metadata?.user_name,
          avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null,
          is_approved: false,
        });

        if (insertError) {
          console.error("Error creating user profile:", insertError);
        }

        // Redirect to pending page for new OAuth users
        return NextResponse.redirect(
          `${origin}/auth/pending?id=${data.user.id}&email=${encodeURIComponent(
            data.user.email
          )}&source=oauth`
        );
      }

      // User already exists, redirect to dashboard or home
      return NextResponse.redirect(`${origin}/admin`);
    }
  }

  // Return to home on error
  return NextResponse.redirect(
    `${origin}/auth/signIn?error=auth_callback_error`
  );
}
