import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_BATCH = 20;
const THUMB_WIDTH = 400;

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
    });

    if (!event) {
      return NextResponse.json({ data: null, error: { message: "Event not found" } }, { status: 404 });
    }

    const formData = await request.formData();
    const uploaderId = formData.get("uploaderId") as string;
    const uploaderRole = formData.get("uploaderRole") as string;

    if (!uploaderId || !uploaderRole) {
      return NextResponse.json(
        { data: null, error: { message: "uploaderId and uploaderRole are required" } },
        { status: 422 }
      );
    }

    if (uploaderRole !== "photographer" && uploaderRole !== "guest") {
      return NextResponse.json(
        { data: null, error: { message: "uploaderRole must be photographer or guest" } },
        { status: 422 }
      );
    }

    const files: File[] = [];
    const allEntries = Array.from(formData.entries());
    for (const [key, value] of allEntries) {
      if (key === "files" && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { data: null, error: { message: "No files provided" } },
        { status: 422 }
      );
    }

    if (files.length > MAX_BATCH) {
      return NextResponse.json(
        { data: null, error: { message: `Max ${MAX_BATCH} photos per upload` } },
        { status: 422 }
      );
    }

    // Validate file sizes
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { data: null, error: { message: `File ${file.name} exceeds 10MB limit` } },
          { status: 422 }
        );
      }
    }

    // Use service role client for storage operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const createdPhotos = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileId = crypto.randomUUID();
      const ext = file.name.split(".").pop() || "jpg";

      // Generate thumbnail
      const thumbBuffer = await sharp(buffer)
        .resize(THUMB_WIDTH)
        .jpeg({ quality: 80 })
        .toBuffer();

      const metadata = await sharp(buffer).metadata();
      const resolution = metadata.width && metadata.height
        ? `${metadata.width}x${metadata.height}`
        : null;

      // Upload original
      const originalPath = `photos/${event.id}/${fileId}.${ext}`;
      const { error: origError } = await supabase.storage
        .from("events")
        .upload(originalPath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (origError) {
        console.error("Original upload error:", origError);
        continue;
      }

      // Upload thumbnail
      const thumbPath = `photos/${event.id}/thumbs/${fileId}.jpg`;
      const { error: thumbError } = await supabase.storage
        .from("events")
        .upload(thumbPath, thumbBuffer, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (thumbError) {
        console.error("Thumbnail upload error:", thumbError);
        continue;
      }

      // Get public URLs
      const { data: origUrl } = supabase.storage.from("events").getPublicUrl(originalPath);
      const { data: thumbUrl } = supabase.storage.from("events").getPublicUrl(thumbPath);

      // Create DB record
      const photo = await prisma.photo.create({
        data: {
          eventId: event.id,
          uploaderId,
          uploaderRole: uploaderRole as "photographer" | "guest",
          fileUrl: origUrl.publicUrl,
          thumbnailUrl: thumbUrl.publicUrl,
          fileSize: file.size,
          resolution,
        },
      });

      createdPhotos.push(photo);
    }

    return NextResponse.json(
      { data: createdPhotos, error: null },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/events/[slug]/photos/upload error:", error);
    return NextResponse.json(
      { data: null, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
