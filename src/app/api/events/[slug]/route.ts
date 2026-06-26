import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/auth";
import { createEventSchema } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
      include: {
        host: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("GET /api/events/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.hostId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createEventSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const updateData: Record<string, unknown> = {};
    const { title, type, date, location, locationUrl, description, coverImageUrl, featuresEnabled, guestCapacity } = parsed.data;

    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (date !== undefined) updateData.date = new Date(date);
    if (location !== undefined) updateData.location = location;
    if (locationUrl !== undefined) updateData.locationUrl = locationUrl;
    if (description !== undefined) updateData.description = description;
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl;
    if (featuresEnabled !== undefined) updateData.featuresEnabled = featuresEnabled;
    if (guestCapacity !== undefined) updateData.guestCapacity = guestCapacity;

    const updated = await prisma.event.update({
      where: { slug: params.slug },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/events/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
