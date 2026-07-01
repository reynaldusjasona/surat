import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Supabase may be unreachable in dev
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("dev-bypass-role", "", { path: "/", maxAge: 0 });
  return response;
}

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("dev-bypass-role", "", { path: "/", maxAge: 0 });
  return response;
}
