import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/auth";
import { createAngpaoSchema } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
      select: { id: true, enableAngpao: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.enableAngpao) {
      return NextResponse.json({ error: "Angpao is disabled for this event" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createAngpaoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { senderName, senderEmail, amount, currency, message, isAnonymous } = parsed.data;

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    const angpao = await prisma.angpao.create({
      data: {
        eventId: event.id,
        senderName,
        senderEmail,
        amount,
        currency,
        message: message || null,
        isAnonymous,
        commission: Number(amount) * 0.029, // 2.9% platform fee
      },
    });

    return NextResponse.json(
      {
        data: {
          id: angpao.id,
          amount: angpao.amount,
          currency: angpao.currency,
          createdAt: angpao.createdAt,
        },
        error: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/events/[slug]/angpao error:", error);
    return NextResponse.json(
      { data: null, error: { message: "Internal server error" } },
      { status: 500 }
    );
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
