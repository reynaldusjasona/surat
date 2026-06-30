import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/auth";
import { createRegistryItemSchema } from "@/types";

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

    const event = await prisma.event.findUnique({ where: { slug: params.slug } });

    if (!event) {
      return NextResponse.json({ data: null, error: { message: "Event not found" } }, { status: 404 });
    }

    if (event.hostId !== user.id) {
      return NextResponse.json({ data: null, error: { message: "Forbidden" } }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createRegistryItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: { message: "Validation failed", details: parsed.error.flatten() } },
        { status: 422 }
      );
    }

    const { name, brand, price, productUrl, imageUrl, priority } = parsed.data;

    const item = await prisma.registryItem.create({
      data: {
        eventId: event.id,
        name,
        brand: brand || null,
        price,
        productUrl: productUrl || null,
        imageUrl: imageUrl || null,
        priority,
      },
    });

    return NextResponse.json({ data: item, error: null }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events/[slug]/registry error:", error);
    return NextResponse.json(
      { data: null, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await prisma.event.findUnique({ where: { slug: params.slug } });

    if (!event) {
      return NextResponse.json({ data: null, error: { message: "Event not found" } }, { status: 404 });
    }

    const items = await prisma.registryItem.findMany({
      where: { eventId: event.id },
      orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    });

    const result = items.map((item) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: Number(item.price),
      productUrl: item.productUrl,
      imageUrl: item.imageUrl,
      priority: item.priority,
      status: item.status,
      claimedBy: item.claimedAnonymous ? null : item.claimedBy,
      claimedAnonymous: item.claimedAnonymous,
      createdAt: item.createdAt,
    }));

    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    console.error("GET /api/events/[slug]/registry error:", error);
    return NextResponse.json(
      { data: null, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
