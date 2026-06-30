import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateIcs } from "@/lib/calendar/ics-generator";

export async function GET(
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

    const icsContent = generateIcs({
      title: event.title,
      description: event.description ?? undefined,
      location: event.location ?? undefined,
      startDate: event.date,
      url: event.mapsUrl ?? undefined,
    });

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
      },
    });
  } catch (error) {
    console.error("GET /api/events/[slug]/calendar error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
