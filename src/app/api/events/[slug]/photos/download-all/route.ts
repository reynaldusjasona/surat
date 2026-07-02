import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import JSZip from "jszip";

/**
 * GET /api/events/[slug]/photos/download-all?email=xxx
 *
 * Returns a ZIP file containing all photos for the event.
 * Requires either:
 * - A valid photo unlock purchase (via email param)
 * - Or the event host (checked via auth, but simplified here)
 *
 * Falls back to first 20 photos if not unlocked.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
      select: { id: true, title: true, slug: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "email query param is required" }, { status: 422 });
    }

    // Check if user has unlocked photos
    const unlock = await prisma.photoUnlock.findFirst({
      where: { eventId: event.id, email },
    });

    const FREE_LIMIT = 20;
    const isUnlocked = !!unlock;

    const photos = await prisma.photo.findMany({
      where: { eventId: event.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, originalUrl: true, uploaderName: true, createdAt: true },
    });

    const photosToZip = isUnlocked ? photos : photos.slice(0, FREE_LIMIT);

    if (photosToZip.length === 0) {
      return NextResponse.json({ error: "No photos available to download" }, { status: 404 });
    }

    // Create ZIP
    const zip = new JSZip();
    const folder = zip.folder(event.title.replace(/[^a-zA-Z0-9\s-]/g, "").trim()) || zip;

    // Fetch each photo and add to zip
    const fetchPromises = photosToZip.map(async (photo, index) => {
      try {
        const response = await fetch(photo.originalUrl);
        if (!response.ok) return;

        const buffer = await response.arrayBuffer();
        const ext = getExtension(photo.originalUrl);
        const filename = `photo_${(index + 1).toString().padStart(3, "0")}_${photo.uploaderName.replace(/[^a-zA-Z0-9]/g, "_")}${ext}`;
        folder.file(filename, buffer);
      } catch {
        // Skip photos that fail to fetch
      }
    });

    await Promise.all(fetchPromises);

    const zipBuffer = await zip.generateAsync({ type: "arraybuffer", compression: "DEFLATE" });

    const sanitizedTitle = event.title.replace(/[^a-zA-Z0-9\s-]/g, "").trim().replace(/\s+/g, "_");

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${sanitizedTitle}_photos.zip"`,
        "Content-Length": zipBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("GET /api/events/[slug]/photos/download-all error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getExtension(url: string): string {
  const pathname = new URL(url).pathname;
  const ext = pathname.split(".").pop()?.toLowerCase();
  if (ext && ["jpg", "jpeg", "png", "webp", "gif", "heic"].includes(ext)) {
    return `.${ext}`;
  }
  return ".jpg";
}
