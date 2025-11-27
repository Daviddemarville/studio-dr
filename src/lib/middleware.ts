import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Variables environements manquant");
  }
  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Public routes that don't require authentication
  const publicRoutes = ["/auth/", "/signIn", "/signUp"];
  const isPublicRoute =
    request.nextUrl.pathname === "/" ||
    publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (!user && !isPublicRoute) {
    // No user, redirect to login page
    const url = request.nextUrl.clone();
    url.pathname = "/auth/signIn";
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access public auth routes
  // BUT exclude /auth/pending to avoid redirect loops
  if (
    user &&
    isPublicRoute &&
    request.nextUrl.pathname !== "/" &&
    !request.nextUrl.pathname.startsWith("/auth/pending")
  ) {
    // Check if user is approved
    const { data: profile } = await supabase
      .from("users")
      .select("is_approved")
      .eq("id", user.sub)
      .maybeSingle();

    const url = request.nextUrl.clone();
    if (profile?.is_approved) {
      url.pathname = "/admin";
    } else {
      url.pathname = "/auth/pending";
    }
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access admin routes
  if (user && request.nextUrl.pathname.startsWith("/admin")) {
    // Check if user is approved
    const { data: profile, error } = await supabase
      .from("users")
      .select("is_approved")
      .eq("id", user.sub)
      .maybeSingle();

    // If there's an error or no profile found, redirect to error page
    // This prevents unauthorized access if database is unavailable
    if (error) {
      console.error("[MIDDLEWARE] Database error:", error);
      const url = request.nextUrl.clone();
      url.pathname = "/auth/error";
      return NextResponse.redirect(url);
    }

    // Only redirect if we found a profile AND it's not approved
    if (profile && !profile.is_approved) {
      // User exists but not approved, redirect to pending page
      const url = request.nextUrl.clone();
      url.pathname = "/auth/pending";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
