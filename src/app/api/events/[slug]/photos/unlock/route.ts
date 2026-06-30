import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const unlockSchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("SGD"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await prisma.event.findUnique({ where: { slug: params.slug } });

    if (!event) {
      return NextResponse.json({ data: null, error: { message: "Event not found" } }, { status: 404 });
    }

    const body = await request.json();
    const parsed = unlockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: { message: "Validation failed", details: parsed.error.flatten() } },
        { status: 422 }
      );
    }

    const { email, amount, currency } = parsed.data;

    // Simulate payment
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await prisma.photoUnlock.create({
      data: { eventId: event.id, email, amount, currency },
    });

    return NextResponse.json({ data: { unlocked: true, email }, error: null });
  } catch (error) {
    console.error("POST /api/events/[slug]/photos/unlock error:", error);
    return NextResponse.json({ data: null, error: { message: "Internal server error" } }, { status: 500 });
  }
}
