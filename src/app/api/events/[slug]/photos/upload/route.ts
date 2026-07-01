import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const THUMB_WIDTH = 400;

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
      select: { id: true, enablePhotos: true, photoLimit: true, _count: { select: { photos: true } } },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.enablePhotos) {
      return NextResponse.json({ error: "Photo uploads disabled" }, { status: 403 });
    }

    if (event._count.photos >= event.photoLimit) {
      return NextResponse.json({ error: `Photo limit reached (${event.photoLimit}). Upgrade your plan for more.` }, { status: 409 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploaderName = formData.get("uploaderName") as string;
    const uploaderEmail = formData.get("uploaderEmail") as string;
    const isPhotographer = formData.get("isPhotographer") === "true";

    if (!file || !uploaderName || !uploaderEmail) {
      return NextResponse.json({ error: "file, uploaderName, uploaderEmail required" }, { status: 422 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are accepted" }, { status: 422 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 422 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileId = crypto.randomUUID();
    const ext = file.name.split(".").pop() ?? "jpg";

    const thumbBuffer = await sharp(buffer)
      .resize(THUMB_WIDTH)
      .jpeg({ quality: 80 })
      .toBuffer();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const originalPath = `photos/${event.id}/${fileId}.${ext}`;
    const thumbPath = `photos/${event.id}/thumbs/${fileId}.jpg`;

    const { error: origError } = await supabase.storage
      .from("events")
      .upload(originalPath, buffer, { contentType: file.type, upsert: false });

    if (origError) {
      return NextResponse.json({ error: "Storage upload failed" }, { status: 500 });
    }

    await supabase.storage
      .from("events")
      .upload(thumbPath, thumbBuffer, { contentType: "image/jpeg", upsert: false });

    const { data: origUrl } = supabase.storage.from("events").getPublicUrl(originalPath);
    const { data: thumbUrl } = supabase.storage.from("events").getPublicUrl(thumbPath);

    const photo = await prisma.photo.create({
      data: {
        eventId: event.id,
        uploaderName,
        uploaderEmail,
        isPhotographer,
        originalUrl: origUrl.publicUrl,
        thumbnailUrl: thumbUrl.publicUrl,
        fileSize: file.size,
      },
    });

    return NextResponse.json({ data: photo, error: null }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events/[slug]/photos/upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
