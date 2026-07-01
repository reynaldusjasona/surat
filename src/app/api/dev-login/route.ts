import { NextRequest, NextResponse } from "next/server";

/**
 * DEV ONLY: Bypass Supabase auth by setting a dev cookie.
 * Usage: /api/dev-login?role=host (or organizer, photographer, admin)
 * This route only works when NODE_ENV !== "production".
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const role = request.nextUrl.searchParams.get("role") || "host";
  const validRoles = ["host", "organizer", "photographer", "admin"];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: `Invalid role. Use: ${validRoles.join(", ")}` }, { status: 400 });
  }

  const dashboardMap: Record<string, string> = {
    host: "/host",
    organizer: "/organizer",
    photographer: "/photographer",
    admin: "/admin",
  };

  const response = NextResponse.redirect(new URL(dashboardMap[role], request.url));

  // Set a dev-bypass cookie
  response.cookies.set("dev-bypass-role", role, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: "lax",
  });

  return response;
}
