import { NextRequest, NextResponse } from "next/server";
import { stripe, PHOTO_UNLOCK_PRICE } from "@/lib/stripe/server";

export async function POST(request: NextRequest) {
  try {
    const { slug, email, currency = "sgd" } = await request.json();

    if (!slug || !email) {
      return NextResponse.json({ error: "Missing slug or email" }, { status: 422 });
    }

    const priceConfig = PHOTO_UNLOCK_PRICE[currency as keyof typeof PHOTO_UNLOCK_PRICE] || PHOTO_UNLOCK_PRICE.sgd;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: priceConfig.currency,
            product_data: {
              name: "Full Photo Gallery Unlock",
              description: "Download all event photos in full resolution",
            },
            unit_amount: priceConfig.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "photo_unlock",
        slug,
        email,
        currency: priceConfig.currency,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${slug}?unlock=success&email=${encodeURIComponent(email)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${slug}?unlock=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("POST /api/stripe/checkout-photo-unlock error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
