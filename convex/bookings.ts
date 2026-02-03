import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPendingBooking = mutation({
  args: {
    tourId: v.id("tours"),
    userId: v.id("users"),
    price: v.number(),
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("bookings", {
      tourId: args.tourId,
      userId: args.userId,
      price: args.price,
      paid: false,
      stripeSessionId: args.stripeSessionId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const markPaid = mutation({
  args: {
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db
      .query("bookings")
      .withIndex("by_stripe_session", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId)
      )
      .unique();

    if (!booking) {
      return;
    }

    await ctx.db.patch(booking._id, {
      paid: true,
      updatedAt: Date.now(),
    });
  },
});

export const listForUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const listForUserDetailed = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = args.userId;
    if (!userId) {
      return [];
    }

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const tours = await Promise.all(
      bookings.map((booking) => ctx.db.get(booking.tourId))
    );

    return bookings.map((booking, index) => ({
      ...booking,
      tour: tours[index],
    }));
  },
});
