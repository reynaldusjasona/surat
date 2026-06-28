import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { purchaseRegistryItemSchema } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
    });

    if (!event) {
      return NextResponse.json({ data: null, error: { message: "Event not found" } }, { status: 404 });
    }

    const item = await prisma.registryItem.findUnique({
      where: { id: params.id },
    });

    if (!item || item.eventId !== event.id) {
      return NextResponse.json({ data: null, error: { message: "Item not found" } }, { status: 404 });
    }

    // Check if already purchased
    if (item.purchasedByName !== null) {
      return NextResponse.json(
        { data: null, error: { message: "This item has already been purchased" } },
        { status: 409 }
      );
    }

    const body = await request.json();
    const parsed = purchaseRegistryItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: { message: "Validation failed", details: parsed.error.flatten() } },
        { status: 422 }
      );
    }

    const { purchasedByName, purchasedByEmail, isAnonymousPurchase } = parsed.data;

    const updated = await prisma.registryItem.update({
      where: { id: params.id },
      data: {
        purchasedByName,
        purchasedByEmail,
        isAnonymousPurchase,
      },
    });

    return NextResponse.json({
      data: {
        id: updated.id,
        name: updated.name,
        purchasedByName: updated.isAnonymousPurchase ? "Someone" : updated.purchasedByName,
        isPurchased: true,
      },
      error: null,
    });
  } catch (error) {
    console.error("POST /api/events/[slug]/registry/[id]/purchase error:", error);
    return NextResponse.json(
      { data: null, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
