import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type ProviderMetadata = Record<string, unknown>;

interface OAuthUser {
  email?: string;
  user_metadata?: ProviderMetadata;
  app_metadata?: ProviderMetadata;
}

interface ExtractedProfile {
  firstname: string | null;
  lastname: string | null;
  pseudo: string | null;
  avatar_url: string | null;
}

/**
 * Helper to get first non-null, non-empty value from a list
 */
const getFirstValue = (...values: unknown[]): string | null => {
  const found = values.find(
    (v) => typeof v === "string" && v.trim().length > 0
  );
  return (found as string) || null;
};

/**
 * Split a full name into first and last name parts
 */
const splitFullName = (
  fullName: string
): { first: string | null; last: string | null } => {
  const parts = fullName.trim().split(/\s+/);
  return {
    first: parts[0] || null,
    last: parts.slice(1).join(" ") || null,
  };
};

/**
 * Extract user profile data from OAuth provider metadata
 * Handles different providers: Google, GitHub, Discord, Facebook, Twitter, LinkedIn
 */
function extractProviderProfile(user: OAuthUser): ExtractedProfile {
  const meta = user.user_metadata || {};
  const provider = (user.app_metadata?.provider as string) || "";

  // Debug: log metadata to see what we receive from the provider
  console.log(
    `[OAuth ${provider}] user_metadata:`,
    JSON.stringify(meta, null, 2)
  );

  // Get full name from various possible fields
  const fullName =
    (meta.full_name as string) ||
    (meta.name as string) ||
    (meta.global_name as string) ||
    "";
  const { first: firstFromFull, last: lastFromFull } = splitFullName(fullName);

  // Provider-specific extraction strategies
  const strategies: Record<
    string,
    {
      firstname: () => string | null;
      lastname: () => string | null;
      pseudo: () => string | null;
      avatar: () => string | null;
    }
  > = {
    google: {
      firstname: () => getFirstValue(meta.given_name, firstFromFull),
      lastname: () => getFirstValue(meta.family_name, lastFromFull),
      pseudo: () => null,
      // Google uses 'picture' for avatar URL in OIDC, also check 'avatar_url' and 'image'
      avatar: () => getFirstValue(meta.picture, meta.avatar_url, meta.image),
    },
    github: {
      firstname: () => getFirstValue(firstFromFull, meta.name),
      lastname: () => lastFromFull,
      pseudo: () => getFirstValue(meta.user_name, meta.preferred_username),
      avatar: () => getFirstValue(meta.avatar_url, meta.picture),
    },
    discord: {
      firstname: () =>
        getFirstValue(meta.global_name, meta.username, firstFromFull),
      lastname: () => lastFromFull,
      pseudo: () => getFirstValue(meta.username, meta.custom_username),
      avatar: () => {
        if (meta.avatar && meta.id) {
          return `https://cdn.discordapp.com/avatars/${meta.id}/${meta.avatar}.png`;
        }
        return getFirstValue(meta.avatar_url, meta.picture);
      },
    },
    facebook: {
      firstname: () => getFirstValue(meta.first_name, firstFromFull),
      lastname: () => getFirstValue(meta.last_name, lastFromFull),
      pseudo: () => null,
      avatar: () => {
        const pic = meta.picture as
          | { data?: { url?: string } }
          | string
          | undefined;
        if (typeof pic === "object" && pic?.data?.url) {
          return pic.data.url;
        }
        return getFirstValue(pic, meta.avatar_url);
      },
    },
    twitter: {
      firstname: () => getFirstValue(firstFromFull, meta.name),
      lastname: () => lastFromFull,
      pseudo: () => getFirstValue(meta.screen_name, meta.username),
      avatar: () =>
        getFirstValue(
          meta.profile_image_url,
          meta.profile_image_url_https,
          meta.avatar_url
        ),
    },
    linkedin: {
      firstname: () => getFirstValue(meta.given_name, firstFromFull),
      lastname: () => getFirstValue(meta.family_name, lastFromFull),
      pseudo: () => null,
      avatar: () => getFirstValue(meta.picture, meta.avatar_url),
    },
  };

  // Add aliases
  strategies.x = strategies.twitter;
  strategies.linkedin_oidc = strategies.linkedin;

  // Default strategy for unknown providers
  const defaultStrategy = {
    firstname: () =>
      getFirstValue(
        meta.firstname,
        meta.first_name,
        meta.given_name,
        firstFromFull
      ),
    lastname: () =>
      getFirstValue(
        meta.lastname,
        meta.last_name,
        meta.family_name,
        lastFromFull
      ),
    pseudo: () =>
      getFirstValue(
        meta.username,
        meta.user_name,
        meta.preferred_username,
        meta.nickname
      ),
    avatar: () =>
      getFirstValue(meta.avatar_url, meta.picture, meta.profile_image_url),
  };

  const strategy = strategies[provider] || defaultStrategy;

  return {
    firstname: strategy.firstname(),
    lastname: strategy.lastname(),
    pseudo: strategy.pseudo(),
    avatar_url: strategy.avatar(),
  };
}

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
      // Extract profile data from provider metadata
      const providerProfile = extractProviderProfile(data.user);

      // Check if user exists in public.users, if not create them
      const { data: existingUser } = await supabase
        .from("users")
        .select("id, firstname, lastname, pseudo, avatar_url")
        .eq("id", data.user.id)
        .single();

      if (!existingUser) {
        // Create user profile in public.users table with extracted provider data
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          firstname: providerProfile.firstname,
          lastname: providerProfile.lastname,
          pseudo: providerProfile.pseudo,
          avatar_url: providerProfile.avatar_url,
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
      } else {
        // User exists - optionally update missing profile fields from provider
        const updates: Record<string, string | null> = {};

        // Only update fields that are currently empty
        if (!existingUser.firstname && providerProfile.firstname) {
          updates.firstname = providerProfile.firstname;
        }
        if (!existingUser.lastname && providerProfile.lastname) {
          updates.lastname = providerProfile.lastname;
        }
        if (!existingUser.pseudo && providerProfile.pseudo) {
          updates.pseudo = providerProfile.pseudo;
        }
        if (!existingUser.avatar_url && providerProfile.avatar_url) {
          updates.avatar_url = providerProfile.avatar_url;
        }

        // Update if there are any missing fields to fill
        if (Object.keys(updates).length > 0) {
          const { error: updateError } = await supabase
            .from("users")
            .update(updates)
            .eq("id", data.user.id);

          if (updateError) {
            console.error("Error updating user profile:", updateError);
          }
        }

        // User already exists, redirect to dashboard
        return NextResponse.redirect(`${origin}/admin`);
      }
    }
  }

  // Return to home on error
  return NextResponse.redirect(
    `${origin}/auth/signIn?error=auth_callback_error`
  );
}
