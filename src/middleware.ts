import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_DASHBOARDS: Record<string, string> = {
  host: "/host",
  organizer: "/organizer",
  photographer: "/photographer",
  admin: "/admin",
};

const DASHBOARD_PATHS = ["/host", "/organizer", "/photographer", "/admin"];

const PUBLIC_PATHS = ["/", "/login", "/signup", "/create"];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/api/")) return true;
  return false;
}

function isDashboardPath(pathname: string) {
  return DASHBOARD_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
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

  // Public paths — allow through
  if (isPublicPath(pathname)) {
    // Redirect logged-in users away from login/signup
    if ((pathname === "/login" || pathname === "/signup") && user) {
      const role = (user.user_metadata?.role as string) ?? "host";
      const dest = ROLE_DASHBOARDS[role] ?? "/host";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return supabaseResponse;
  }

  // Dashboard paths require auth
  if (isDashboardPath(pathname)) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = (user.user_metadata?.role as string) ?? "host";
    const correctDashboard = ROLE_DASHBOARDS[role] ?? "/host";

    // Block cross-role access (e.g., host trying to access /admin)
    const firstSegment = "/" + pathname.split("/")[1];
    if (DASHBOARD_PATHS.includes(firstSegment) && firstSegment !== correctDashboard.split("/").slice(0, 2).join("/")) {
      // Only block if trying to access a different role's dashboard
      const targetRole = firstSegment.replace("/", "");
      if (targetRole !== role) {
        return NextResponse.redirect(new URL(correctDashboard, request.url));
      }
    }

    return supabaseResponse;
  }

  // Everything else (event pages /[slug], /[slug]/upload, etc.) — public
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
