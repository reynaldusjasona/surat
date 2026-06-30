import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await prisma.event.findUnique({ where: { slug: params.slug } });

    if (!event) {
      return NextResponse.json({ data: null, error: { message: "Event not found" } }, { status: 404 });
    }

    const photos = await prisma.photo.findMany({
      where: { eventId: event.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        thumbnailUrl: true,
        originalUrl: true,
        uploaderName: true,
        isPhotographer: true,
        downloadCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: photos, error: null });
  } catch (error) {
    console.error("GET /api/events/[slug]/photos error:", error);
    return NextResponse.json(
      { data: null, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
