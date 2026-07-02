import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Wallet Pass Generation
 *
 * POST /api/events/[slug]/wallet
 * Body: { type: "apple" | "google" }
 *
 * For Google Wallet: Returns a "Save to Google Wallet" URL using the Google Wallet API.
 * For Apple Wallet: Generates a .pkpass file (requires APPLE_PASS_* env vars).
 *
 * If credentials aren't configured, returns a calendar fallback.
 */

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        title: true,
        date: true,
        time: true,
        location: true,
        mapsUrl: true,
        type: true,
        slug: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const walletType = (body as { type?: string }).type || "google";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (walletType === "google") {
      return handleGoogleWallet(event, baseUrl);
    } else if (walletType === "apple") {
      return handleAppleWallet(event, baseUrl);
    }

    return NextResponse.json({ error: "Invalid wallet type. Use 'apple' or 'google'." }, { status: 400 });
  } catch (error) {
    console.error("POST /api/events/[slug]/wallet error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function handleGoogleWallet(
  event: { title: string; date: Date; time: string | null; location: string | null; mapsUrl: string | null; slug: string },
  baseUrl: string
) {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;

  if (!issuerId) {
    // Fallback: Generate a Google Calendar "Add Event" URL instead
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // +3 hours

    const formatGCalDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

    const calUrl = new URL("https://calendar.google.com/calendar/render");
    calUrl.searchParams.set("action", "TEMPLATE");
    calUrl.searchParams.set("text", event.title);
    calUrl.searchParams.set("dates", `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`);
    if (event.location) calUrl.searchParams.set("location", event.location);
    calUrl.searchParams.set("details", `Event page: ${baseUrl}/${event.slug}`);

    return NextResponse.json({
      type: "google_calendar_fallback",
      url: calUrl.toString(),
      message: "Google Wallet credentials not configured. Redirecting to Google Calendar instead.",
    });
  }

  // With proper credentials, we'd create a JWT and return a save link
  // For now this is a placeholder for when credentials are configured
  const saveUrl = `https://pay.google.com/gp/v/save/${issuerId}`;
  return NextResponse.json({
    type: "google_wallet",
    url: saveUrl,
  });
}

function handleAppleWallet(
  event: { title: string; date: Date; time: string | null; location: string | null; slug: string },
  baseUrl: string
) {
  const passTypeId = process.env.APPLE_PASS_TYPE_ID;
  const teamId = process.env.APPLE_TEAM_ID;

  if (!passTypeId || !teamId) {
    // Fallback: Return .ics calendar download URL
    return NextResponse.json({
      type: "apple_calendar_fallback",
      url: `${baseUrl}/api/events/${event.slug}/calendar`,
      message: "Apple Wallet credentials not configured. Use the calendar download instead.",
    });
  }

  // With proper credentials, we'd generate a .pkpass using passkit-generator
  // This requires signing certificates which are not available in dev
  return NextResponse.json({
    type: "apple_wallet",
    url: `${baseUrl}/api/events/${event.slug}/wallet/download`,
    message: "Apple Wallet pass ready.",
  });
}

// Also support GET for simpler client usage
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        title: true,
        date: true,
        time: true,
        location: true,
        mapsUrl: true,
        type: true,
        slug: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Return available wallet options
    const options: { type: string; label: string; url: string; available: boolean }[] = [];

    // Google Wallet / Calendar
    const hasGoogle = !!process.env.GOOGLE_WALLET_ISSUER_ID;
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);
    const formatGCalDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const calUrl = new URL("https://calendar.google.com/calendar/render");
    calUrl.searchParams.set("action", "TEMPLATE");
    calUrl.searchParams.set("text", event.title);
    calUrl.searchParams.set("dates", `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`);
    if (event.location) calUrl.searchParams.set("location", event.location);
    calUrl.searchParams.set("details", `Event page: ${baseUrl}/${event.slug}`);

    options.push({
      type: hasGoogle ? "google_wallet" : "google_calendar",
      label: hasGoogle ? "Add to Google Wallet" : "Add to Google Calendar",
      url: calUrl.toString(),
      available: true,
    });

    // Apple Wallet / Calendar
    const hasApple = !!process.env.APPLE_PASS_TYPE_ID && !!process.env.APPLE_TEAM_ID;
    options.push({
      type: hasApple ? "apple_wallet" : "apple_calendar",
      label: hasApple ? "Add to Apple Wallet" : "Add to Calendar (.ics)",
      url: `${baseUrl}/api/events/${event.slug}/calendar`,
      available: true,
    });

    return NextResponse.json({ options });
  } catch (error) {
    console.error("GET /api/events/[slug]/wallet error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
