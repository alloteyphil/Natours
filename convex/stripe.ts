import Stripe from "stripe";
import { ConvexError, v } from "convex/values";
import { action, httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserOrThrow } from "./rbac";
import type { Doc, Id } from "./_generated/dataModel";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey);
const siteUrl = process.env.SITE_URL ?? "http://localhost:5173";

export const createCheckoutSession = action({
  args: {
    tourId: v.id("tours"),
  },
  handler: async (ctx, args): Promise<{ url: string }> => {
    const authUser = await getAuthUserOrThrow(ctx);
    const tour = (await ctx.runQuery(api.tours.getById, {
      id: args.tourId,
    })) as Doc<"tours"> | null;

    if (!tour) {
      throw new ConvexError("Tour not found");
    }

    const userId = (await ctx.runMutation(
      api.users.ensureUser,
      {}
    )) as Id<"users">;

    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: authUser.email ?? undefined,
        success_url: `${siteUrl}/account?checkout=success`,
        cancel_url: `${siteUrl}/tours/${tour.slug}?checkout=cancelled`,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: Math.round(tour.price * 100),
              product_data: {
                name: tour.name,
                description: tour.summary,
              },
            },
          },
        ],
        metadata: {
          tourId: args.tourId,
          userId,
        },
      });

    await ctx.runMutation(api.bookings.createPendingBooking, {
      tourId: args.tourId,
      userId,
      price: tour.price,
      stripeSessionId: session.id,
    });

    if (!session.url) {
      throw new ConvexError("Stripe session missing URL");
    }

    return { url: session.url };
  },
});

export const stripeWebhook = httpAction(async (ctx, request) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Missing webhook secret", { status: 500 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.id) {
      await ctx.runMutation(api.bookings.markPaid, {
        stripeSessionId: session.id,
      });
    }
  }

  return new Response("ok", { status: 200 });
});
