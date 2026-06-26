import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/auth";
import { createGuestSchema, updateRsvpSchema } from "@/types";
import { z } from "zod";

const rsvpSubmitSchema = createGuestSchema.merge(
  z.object({
    rsvpStatus: updateRsvpSchema.shape.rsvpStatus,
  })
);

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = rsvpSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { name, email, rsvpStatus, plusOnes, dietaryNotes } = parsed.data;

    const plusOnesData = plusOnes && plusOnes.length > 0 ? plusOnes : undefined;

    const guest = await prisma.guest.upsert({
      where: {
        eventId_email: {
          eventId: event.id,
          email,
        },
      },
      update: {
        name,
        rsvpStatus,
        plusOnes: plusOnesData ?? { set: null },
        dietaryNotes: dietaryNotes || null,
        rsvpAt: new Date(),
      },
      create: {
        eventId: event.id,
        name,
        email,
        rsvpStatus,
        plusOnes: plusOnesData ?? undefined,
        dietaryNotes: dietaryNotes || null,
        rsvpAt: new Date(),
      },
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    console.error("POST /api/events/[slug]/rsvp error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
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

    const guests = await prisma.guest.findMany({
      where: { eventId: event.id },
      orderBy: { rsvpAt: "desc" },
    });

    const counts = {
      attending: guests.filter((g) => g.rsvpStatus === "attending").length,
      not_attending: guests.filter((g) => g.rsvpStatus === "not_attending").length,
      maybe: guests.filter((g) => g.rsvpStatus === "maybe").length,
      pending: guests.filter((g) => g.rsvpStatus === "pending").length,
      total: guests.length,
    };

    return NextResponse.json({ guests, counts });
  } catch (error) {
    console.error("GET /api/events/[slug]/rsvp error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
