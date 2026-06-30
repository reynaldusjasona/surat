import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

const FREE_LIMIT = 20;
const SIGNED_URL_EXPIRY = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await prisma.event.findUnique({ where: { slug: params.slug } });

    if (!event) {
      return NextResponse.json({ data: null, error: { message: "Event not found" } }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { data: null, error: { message: "email query param is required" } },
        { status: 422 }
      );
    }

    const unlock = await prisma.photoUnlock.findFirst({
      where: { eventId: event.id, email },
    });

    const isUnlocked = !!unlock;

    const photos = await prisma.photo.findMany({
      where: { eventId: event.id },
      orderBy: { createdAt: "desc" },
    });

    const photosToReturn = isUnlocked ? photos : photos.slice(0, FREE_LIMIT);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const signedPhotos = await Promise.all(
      photosToReturn.map(async (photo) => {
        const url = new URL(photo.originalUrl);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/events\/(.+)/);
        const storagePath = pathMatch ? pathMatch[1] : null;

        let signedUrl = photo.originalUrl;

        if (storagePath) {
          const { data } = await supabase.storage
            .from("events")
            .createSignedUrl(storagePath, SIGNED_URL_EXPIRY);
          if (data?.signedUrl) signedUrl = data.signedUrl;
        }

        return { id: photo.id, signedUrl, fileSize: photo.fileSize };
      })
    );

    return NextResponse.json({
      data: { photos: signedPhotos, isUnlocked, totalPhotos: photos.length, returnedPhotos: photosToReturn.length },
      error: null,
    });
  } catch (error) {
    console.error("GET /api/events/[slug]/photos/download error:", error);
    return NextResponse.json({ data: null, error: { message: "Internal server error" } }, { status: 500 });
  }
}
