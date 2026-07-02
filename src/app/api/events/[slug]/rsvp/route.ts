import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/auth";
import { createRsvpSchema } from "@/types";
import { sendRsvpConfirmation, sendNewRsvpNotification } from "@/lib/email/send";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ interval: 60_000, limit: 10 }); // 10 RSVPs per minute per IP

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { success } = limiter.check(ip);
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
      select: { id: true, enableRsvp: true, guestLimit: true, _count: { select: { rsvps: true } } },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.enableRsvp) {
      return NextResponse.json({ error: "RSVPs are disabled for this event" }, { status: 403 });
    }

    if (event._count.rsvps >= event.guestLimit) {
      return NextResponse.json({ error: "This event is at capacity" }, { status: 409 });
    }

    const body = await request.json();
    const parsed = createRsvpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { name, email, status, plusOnes, dietaryNotes } = parsed.data;

    const rsvp = await prisma.rsvp.upsert({
      where: { eventId_email: { eventId: event.id, email } },
      update: {
        name,
        status,
        plusOnes: plusOnes && plusOnes.length > 0 ? (plusOnes as object[]) : undefined,
        dietaryNotes: dietaryNotes || null,
      },
      create: {
        eventId: event.id,
        name,
        email,
        status,
        plusOnes: plusOnes && plusOnes.length > 0 ? (plusOnes as object[]) : undefined,
        dietaryNotes: dietaryNotes || null,
      },
    });

    // Send emails (non-blocking)
    const fullEvent = await prisma.event.findUnique({
      where: { id: event.id },
      include: { host: { select: { fullName: true, email: true } }, _count: { select: { rsvps: true } } },
    });

    if (fullEvent) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      // Email to guest
      sendRsvpConfirmation({
        guestName: name,
        guestEmail: email,
        eventTitle: fullEvent.title,
        eventDate: fullEvent.date.toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" }),
        eventLocation: fullEvent.location || "TBA",
        eventUrl: `${baseUrl}/${params.slug}`,
        status,
      });

      // Email to host
      if (fullEvent.host.email) {
        sendNewRsvpNotification({
          hostName: fullEvent.host.fullName || "Host",
          hostEmail: fullEvent.host.email,
          guestName: name,
          guestEmail: email,
          eventTitle: fullEvent.title,
          status,
          plusOnes: plusOnes?.length || 0,
          dashboardUrl: `${baseUrl}/host/events/${params.slug}`,
          totalRsvps: fullEvent._count.rsvps,
        });
      }
    }

    return NextResponse.json(rsvp, { status: 201 });
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

    const event = await prisma.event.findUnique({ where: { slug: params.slug } });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.hostId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rsvps = await prisma.rsvp.findMany({
      where: { eventId: event.id },
      orderBy: { createdAt: "desc" },
    });

    const counts = {
      attending: rsvps.filter((r) => r.status === "attending").length,
      maybe: rsvps.filter((r) => r.status === "maybe").length,
      not_attending: rsvps.filter((r) => r.status === "not_attending").length,
      total: rsvps.length,
    };

    return NextResponse.json({ rsvps, counts });
  } catch (error) {
    console.error("GET /api/events/[slug]/rsvp error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
