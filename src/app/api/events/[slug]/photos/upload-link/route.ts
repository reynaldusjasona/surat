import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { getBaseUrl } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ data: null, error: { message: "Unauthorized" } }, { status: 401 });
    }

    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
    });

    if (!event) {
      return NextResponse.json({ data: null, error: { message: "Event not found" } }, { status: 404 });
    }

    if (event.hostId !== user.id) {
      return NextResponse.json({ data: null, error: { message: "Forbidden" } }, { status: 403 });
    }

    const baseUrl = getBaseUrl() || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const uploadUrl = `${baseUrl}/${params.slug}/upload?role=photographer`;

    return NextResponse.json({
      data: { uploadUrl },
      error: null,
    });
  } catch (error) {
    console.error("POST /api/events/[slug]/photos/upload-link error:", error);
    return NextResponse.json(
      { data: null, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
