import { NextRequest, NextResponse } from "next/server";
import { stripe, EVENT_PLANS } from "@/lib/stripe/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, eventTitle, slug } = await request.json();

    if (!plan || !eventTitle || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
    }

    const planConfig = EVENT_PLANS[plan as keyof typeof EVENT_PLANS];
    if (!planConfig || planConfig.price === 0) {
      return NextResponse.json({ error: "Invalid plan or free plan selected" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "sgd",
            product_data: {
              name: `Surat ${planConfig.label} Plan`,
              description: `Event: ${eventTitle}`,
            },
            unit_amount: planConfig.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "event_plan",
        userId: user.id,
        slug,
        plan,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/host/events/${slug}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/host/events/${slug}?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("POST /api/stripe/checkout-event error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
