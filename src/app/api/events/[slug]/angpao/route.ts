import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Direct angpao recording is disabled — all angpao payments must go through Stripe.
  // Use POST /api/stripe/checkout-angpao to initiate an angpao payment.
  // The webhook handler (POST /api/stripe/webhook) records the angpao after payment succeeds.
  return NextResponse.json(
    {
      error: "Direct angpao submission is not allowed. Use the Stripe checkout flow.",
      redirect: "/api/stripe/checkout-angpao",
    },
    { status: 403 }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ data: null, error: { message: "Unauthorized" } }, { status: 401 });
    }

    const event = await prisma.event.findUnique({ where: { slug: params.slug } });

    if (!event) {
      return NextResponse.json({ data: null, error: { message: "Event not found" } }, { status: 404 });
    }

    if (event.hostId !== user.id) {
      return NextResponse.json({ data: null, error: { message: "Forbidden" } }, { status: 403 });
    }

    const angpaoList = await prisma.angpao.findMany({
      where: { eventId: event.id },
      orderBy: { createdAt: "desc" },
    });

    const totalAmount = angpaoList.reduce((sum, a) => sum + Number(a.amount), 0);

    // Strip sender email from all records (privacy)
    const maskedList = angpaoList.map((a) => ({
      id: a.id,
      senderName: a.isAnonymous ? "Anonymous" : a.senderName,
      amount: Number(a.amount),
      currency: a.currency,
      message: a.message,
      isAnonymous: a.isAnonymous,
      isThanked: a.isThanked,
      createdAt: a.createdAt,
    }));

    return NextResponse.json({
      data: { totalAmount, count: angpaoList.length, angpao: maskedList },
      error: null,
    });
  } catch (error) {
    console.error("GET /api/events/[slug]/angpao error:", error);
    return NextResponse.json(
      { data: null, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
