import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { claimRegistryItemSchema } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const event = await prisma.event.findUnique({ where: { slug: params.slug } });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const item = await prisma.registryItem.findUnique({ where: { id: params.id } });

    if (!item || item.eventId !== event.id) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (item.status === "claimed") {
      return NextResponse.json({ error: "Already claimed" }, { status: 409 });
    }

    const body = await request.json();
    const parsed = claimRegistryItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 422 });
    }

    const { claimedBy, claimedByEmail, claimedAnonymous } = parsed.data;

    const updated = await prisma.registryItem.update({
      where: { id: params.id },
      data: { status: "claimed", claimedBy, claimedByEmail, claimedAnonymous },
    });

    return NextResponse.json({
      id: updated.id,
      status: updated.status,
      claimedBy: updated.claimedAnonymous ? null : updated.claimedBy,
    });
  } catch (error) {
    console.error("POST /api/events/[slug]/registry/[id]/claim error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
