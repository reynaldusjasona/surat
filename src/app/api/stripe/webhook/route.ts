import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // If webhook secret is configured, verify signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In development without webhook secret, parse directly
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (!metadata) return NextResponse.json({ received: true });

    try {
      switch (metadata.type) {
        case "event_plan": {
          // Update event plan
          await prisma.event.update({
            where: { slug: metadata.slug },
            data: {
              plan: metadata.plan,
              guestLimit: metadata.plan === "premium" ? 1000 : 200,
              photoLimit: metadata.plan === "premium" ? 2000 : 500,
            },
          });

          // Record transaction
          const eventRecord = await prisma.event.findUnique({ where: { slug: metadata.slug } });
          if (eventRecord) {
            await prisma.transaction.create({
              data: {
                type: "event_plan",
                referenceId: eventRecord.id,
                amount: (session.amount_total || 0) / 100,
                currency: session.currency || "sgd",
                status: "completed",
                metadata: { plan: metadata.plan, slug: metadata.slug },
              },
            });
          }
          break;
        }

        case "photo_unlock": {
          // Record photo unlock
          const unlockEvent = await prisma.event.findUnique({ where: { slug: metadata.slug } });
          if (unlockEvent) {
            // Check if already unlocked
            const existing = await prisma.photoUnlock.findFirst({
              where: { eventId: unlockEvent.id, email: metadata.email },
            });

            if (existing) {
              await prisma.photoUnlock.update({
                where: { id: existing.id },
                data: {
                  amount: (session.amount_total || 0) / 100,
                  currency: metadata.currency || "sgd",
                },
              });
            } else {
              await prisma.photoUnlock.create({
                data: {
                  eventId: unlockEvent.id,
                  email: metadata.email,
                  amount: (session.amount_total || 0) / 100,
                  currency: metadata.currency || "sgd",
                },
              });
            }

            await prisma.transaction.create({
              data: {
                type: "photo_unlock",
                referenceId: unlockEvent.id,
                amount: (session.amount_total || 0) / 100,
                currency: session.currency || "sgd",
                status: "completed",
                metadata: { email: metadata.email, slug: metadata.slug },
              },
            });
          }
          break;
        }

        case "angpao": {
          // Record angpao
          await prisma.angpao.create({
            data: {
              eventId: metadata.eventId,
              senderName: metadata.senderName,
              senderEmail: metadata.senderEmail,
              amount: parseFloat(metadata.amount),
              currency: metadata.currency || "SGD",
              message: metadata.message || null,
              isAnonymous: metadata.isAnonymous === "true",
              commission: parseFloat(metadata.commission) / 100,
            },
          });

          await prisma.transaction.create({
            data: {
              type: "angpao",
              referenceId: metadata.eventId,
              amount: parseFloat(metadata.amount),
              currency: metadata.currency || "SGD",
              status: "completed",
              metadata: {
                senderEmail: metadata.senderEmail,
                isAnonymous: metadata.isAnonymous,
                commission: metadata.commission,
              },
            },
          });
          break;
        }
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
      // Don't return error — Stripe will retry
    }
  }

  return NextResponse.json({ received: true });
}
