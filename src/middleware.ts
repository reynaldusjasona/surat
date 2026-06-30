import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_DASHBOARDS: Record<string, string> = {
  host: "/dashboard/host",
  organizer: "/dashboard/organizer",
  photographer: "/dashboard/photographer",
  admin: "/dashboard/admin",
};

const DASHBOARD_ROLES = ["host", "organizer", "photographer", "admin"];

const PUBLIC_PATHS = ["/", "/login", "/signup"];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.match(/^\/[^/]+$/)) return true;         // /[slug]
  if (pathname.match(/^\/[^/]+\/upload/)) return true;  // /[slug]/upload
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!pathname.startsWith("/dashboard")) {
    // Redirect logged-in users away from login/signup
    if ((pathname === "/login" || pathname === "/signup") && user) {
      const role = (user.user_metadata?.role as string) ?? "host";
      const dest = ROLE_DASHBOARDS[role] ?? "/dashboard/host";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return supabaseResponse;
  }

  // Dashboard routes require auth
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (user.user_metadata?.role as string) ?? "host";
  const correctDashboard = ROLE_DASHBOARDS[role] ?? "/dashboard/host";

  // Redirect /dashboard to the role dashboard
  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(correctDashboard, request.url));
  }

  // Block cross-role access
  const segments = pathname.split("/");
  const roleSegment = segments[2]; // /dashboard/[roleSegment]/...

  if (DASHBOARD_ROLES.includes(roleSegment) && roleSegment !== role) {
    return NextResponse.redirect(new URL(correctDashboard, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
