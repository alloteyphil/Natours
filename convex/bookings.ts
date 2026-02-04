import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { getAuthUserId, getUserByAuthId } from "./rbac";

export const createBooking = mutation({
  args: {
    tourId: v.id("tours"),
    userId: v.id("users"),
    price: v.number(),
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    // Only create booking if payment was successful (called from webhook)
    return ctx.db.insert("bookings", {
      tourId: args.tourId,
      userId: args.userId,
      price: args.price,
      paid: true, // Always true since this is only called after successful payment
      stripeSessionId: args.stripeSessionId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const deleteAllBookings = mutation({
  args: {},
  handler: async (ctx) => {
    const bookings = await ctx.db.query("bookings").collect();
    await Promise.all(bookings.map((booking) => ctx.db.delete(booking._id)));
    return { deleted: bookings.length };
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

export const getUserBookings = query({
  args: {},
  handler: async (ctx) => {
    try {
      const authUser = await authComponent.getAuthUser(ctx);
      if (!authUser) return [];

      const user = await getUserByAuthId(ctx, getAuthUserId(authUser));
      if (!user) return [];

      const bookings = await ctx.db
        .query("bookings")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .order("desc")
        .collect();

      // Get tour details for each booking
      const bookingsWithTours = await Promise.all(
        bookings.map(async (booking) => {
          const tour = await ctx.db.get(booking.tourId);
          return {
            ...booking,
            tour: tour
              ? {
                  name: tour.name,
                  slug: tour.slug,
                  imageCover: tour.imageCover,
                  duration: tour.duration,
                  difficulty: tour.difficulty,
                }
              : null,
          };
        })
      );

      return bookingsWithTours;
    } catch {
      return [];
    }
  },
});

export const getByStripeSession = query({
  args: {
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_stripe_session", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId)
      )
      .unique();
  },
});
