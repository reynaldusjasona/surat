import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createWalletPassSchema } from "@/types";
import { generateApplePass } from "@/lib/wallet/apple-pass";
import { generateGooglePass } from "@/lib/wallet/google-pass";

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
    const parsed = createWalletPassSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { guestId, passType } = parsed.data;

    const guest = await prisma.guest.findUnique({
      where: { id: guestId },
    });

    if (!guest || guest.eventId !== event.id) {
      return NextResponse.json({ error: "Guest not found for this event" }, { status: 404 });
    }

    if (passType === "apple") {
      const result = await generateApplePass({
        eventName: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        guestId: guest.id,
        guestName: guest.name,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error, fallback: "calendar" },
          { status: 503 }
        );
      }

      // Store pass record
      await prisma.walletPass.upsert({
        where: {
          eventId_guestId_passType: {
            eventId: event.id,
            guestId: guest.id,
            passType: "apple",
          },
        },
        update: { passData: { generated: true } },
        create: {
          eventId: event.id,
          guestId: guest.id,
          passType: "apple",
          passData: { generated: true },
        },
      });

      const passBuffer = result.buffer!;
      return new NextResponse(passBuffer as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.pkpass",
          "Content-Disposition": `attachment; filename="${event.slug}-pass.pkpass"`,
        },
      });
    }

    if (passType === "google") {
      const result = await generateGooglePass({
        eventName: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        guestId: guest.id,
        guestName: guest.name,
        eventId: event.id,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error, fallback: "calendar" },
          { status: 503 }
        );
      }

      // Store pass record
      await prisma.walletPass.upsert({
        where: {
          eventId_guestId_passType: {
            eventId: event.id,
            guestId: guest.id,
            passType: "google",
          },
        },
        update: { passData: { saveUrl: result.saveUrl } },
        create: {
          eventId: event.id,
          guestId: guest.id,
          passType: "google",
          passData: { saveUrl: result.saveUrl },
        },
      });

      return NextResponse.json({ saveUrl: result.saveUrl });
    }

    return NextResponse.json({ error: "Invalid pass type" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/events/[slug]/wallet error:", error);
    return NextResponse.json(
      { error: "Internal server error", fallback: "calendar" },
      { status: 500 }
    );
  }
}
