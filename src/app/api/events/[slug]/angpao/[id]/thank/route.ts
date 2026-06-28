import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
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

    const angpao = await prisma.angpao.findUnique({
      where: { id: params.id },
    });

    if (!angpao || angpao.eventId !== event.id) {
      return NextResponse.json({ data: null, error: { message: "Angpao not found" } }, { status: 404 });
    }

    const updated = await prisma.angpao.update({
      where: { id: params.id },
      data: { isThanked: true },
    });

    return NextResponse.json({
      data: {
        id: updated.id,
        isThanked: updated.isThanked,
      },
      error: null,
    });
  } catch (error) {
    console.error("PATCH /api/events/[slug]/angpao/[id]/thank error:", error);
    return NextResponse.json(
      { data: null, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
