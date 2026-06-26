import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/auth";
import { createEventSchema } from "@/types";
import { generateSlug } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { title, type, date, location, locationUrl, description, coverImageUrl, featuresEnabled, guestCapacity } = parsed.data;

    const slug = generateSlug(title);

    const event = await prisma.event.create({
      data: {
        hostId: user.id,
        title,
        type,
        date: new Date(date),
        location,
        locationUrl: locationUrl || null,
        description: description || null,
        coverImageUrl: coverImageUrl || null,
        slug,
        featuresEnabled: featuresEnabled || {},
        guestCapacity: guestCapacity || null,
      },
    });

    return NextResponse.json({ slug: event.slug, id: event.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
