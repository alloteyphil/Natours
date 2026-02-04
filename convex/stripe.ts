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
        success_url: `${siteUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
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
          price: tour.price.toString(),
        },
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

  // Verify webhook secret format (should start with whsec_)
  if (!webhookSecret.startsWith("whsec_")) {
    return new Response(
      JSON.stringify({
        error: "Invalid webhook secret format",
        hint: "Webhook secret should start with 'whsec_'. Get it from 'stripe listen' output.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: "Webhook signature verification failed",
        details: errorMessage,
        hint: "Check that STRIPE_WEBHOOK_SECRET matches the secret from 'stripe listen'",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve the full session to ensure we have all data
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["payment_intent"],
    });

    // Only create booking if payment was successful
    if (fullSession.payment_status === "paid" && fullSession.metadata) {
      const tourId = fullSession.metadata.tourId as Id<"tours">;
      const userId = fullSession.metadata.userId as Id<"users">;
      const price = parseFloat(fullSession.metadata.price || "0");

      if (tourId && userId && price > 0) {
        try {
          // Create booking only after successful payment
          await ctx.runMutation(api.bookings.createBooking, {
            tourId,
            userId,
            price,
            stripeSessionId: fullSession.id,
          });
        } catch (error) {
          // Return error so Stripe can retry
          return new Response(
            JSON.stringify({ error: "Failed to create booking" }),
            { status: 500 }
          );
        }
      }
    }
  }

  return new Response("ok", { status: 200 });
});

export const verifyAndCreateBooking = action({
  args: {
    sessionId: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    message: string;
    bookingId?: Id<"bookings">;
  }> => {
    try {
      // Retrieve the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(args.sessionId, {
        expand: ["payment_intent"],
      });

      // Check if payment was successful
      if (session.payment_status !== "paid") {
        throw new ConvexError(
          `Payment not completed. Status: ${session.payment_status}`
        );
      }

      if (!session.metadata) {
        throw new ConvexError("Session metadata missing");
      }

      const tourId = session.metadata.tourId as Id<"tours">;
      const userId = session.metadata.userId as Id<"users">;
      const price = parseFloat(session.metadata.price || "0");

      if (!tourId || !userId || price <= 0) {
        throw new ConvexError("Invalid metadata in session");
      }

      // Check if booking already exists
      const existingBooking = (await ctx.runQuery(
        api.bookings.getByStripeSession,
        {
          stripeSessionId: args.sessionId,
        }
      )) as Doc<"bookings"> | null | undefined;

      if (existingBooking) {
        return {
          success: true,
          message: "Booking already exists",
          bookingId: existingBooking._id,
        };
      }

      // Create the booking
      const bookingId = (await ctx.runMutation(api.bookings.createBooking, {
        tourId,
        userId,
        price,
        stripeSessionId: args.sessionId,
      })) as Id<"bookings">;

      return { success: true, message: "Booking created", bookingId };
    } catch (error) {
      throw new ConvexError(
        error instanceof Error
          ? error.message
          : "Failed to verify and create booking"
      );
    }
  },
});
