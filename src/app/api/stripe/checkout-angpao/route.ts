import { NextRequest, NextResponse } from "next/server";
import { stripe, ANGPAO_COMMISSION } from "@/lib/stripe/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { slug, senderName, senderEmail, amount, currency = "SGD", message, isAnonymous } = await request.json();

    if (!slug || !senderName || !senderEmail || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
    }

    // Get event to determine plan/commission rate
    const event = await prisma.event.findUnique({
      where: { slug },
      select: { id: true, plan: true, title: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const commissionRate = ANGPAO_COMMISSION[event.plan as keyof typeof ANGPAO_COMMISSION] || ANGPAO_COMMISSION.free;
    const amountInCents = Math.round(amount * 100);
    const commissionInCents = Math.round(amountInCents * commissionRate);
    const stripeCurrency = currency.toLowerCase();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: senderEmail,
      line_items: [
        {
          price_data: {
            currency: stripeCurrency,
            product_data: {
              name: `Angpao for ${event.title}`,
              description: message ? `"${message.substring(0, 100)}"` : "Digital red packet",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "angpao",
        slug,
        eventId: event.id,
        senderName,
        senderEmail,
        amount: amount.toString(),
        currency,
        message: message || "",
        isAnonymous: isAnonymous ? "true" : "false",
        commission: commissionInCents.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${slug}?angpao=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${slug}?angpao=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("POST /api/stripe/checkout-angpao error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
