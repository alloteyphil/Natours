import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { getAuthUserId, getUserByAuthId } from "./rbac";

export const listByTour = query({
  args: {
    tourId: v.id("tours"),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_tour", (q) => q.eq("tourId", args.tourId))
      .order("desc")
      .collect();

    // Get user details for each review
    const reviewsWithUsers = await Promise.all(
      reviews.map(async (review) => {
        const user = await ctx.db.get(review.userId);
        return {
          ...review,
          user: user ? { name: user.name, photo: user.photo } : null,
        };
      })
    );

    return reviewsWithUsers;
  },
});

export const create = mutation({
  args: {
    tourId: v.id("tours"),
    review: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("You must be logged in to create a review");
    }

    const user = await getUserByAuthId(ctx, getAuthUserId(authUser));
    if (!user) {
      throw new Error("User not found");
    }

    // Check if user already reviewed this tour
    const existing = await ctx.db
      .query("reviews")
      .withIndex("by_tour_user", (q) =>
        q.eq("tourId", args.tourId).eq("userId", user._id)
      )
      .first();

    if (existing) {
      throw new Error("You have already reviewed this tour");
    }

    const reviewId = await ctx.db.insert("reviews", {
      tourId: args.tourId,
      userId: user._id,
      review: args.review,
      rating: args.rating,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update tour ratings
    await updateTourRatings(ctx, args.tourId);

    return reviewId;
  },
});

export const update = mutation({
  args: {
    reviewId: v.id("reviews"),
    review: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("You must be logged in to update a review");
    }

    const user = await getUserByAuthId(ctx, getAuthUserId(authUser));
    if (!user) {
      throw new Error("User not found");
    }

    const existingReview = await ctx.db.get(args.reviewId);

    if (!existingReview || existingReview.userId !== user._id) {
      throw new Error("Review not found or unauthorized");
    }

    await ctx.db.patch(args.reviewId, {
      review: args.review,
      rating: args.rating,
      updatedAt: Date.now(),
    });

    // Update tour ratings
    await updateTourRatings(ctx, existingReview.tourId);

    return args.reviewId;
  },
});

export const remove = mutation({
  args: {
    reviewId: v.id("reviews"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("You must be logged in to delete a review");
    }

    const user = await getUserByAuthId(ctx, getAuthUserId(authUser));
    if (!user) {
      throw new Error("User not found");
    }

    const review = await ctx.db.get(args.reviewId);

    if (!review || review.userId !== user._id) {
      throw new Error("Review not found or unauthorized");
    }

    const tourId = review.tourId;
    await ctx.db.delete(args.reviewId);

    // Update tour ratings
    await updateTourRatings(ctx, tourId);

    return { success: true };
  },
});

async function updateTourRatings(ctx: any, tourId: any) {
  const reviews = await ctx.db
    .query("reviews")
    .withIndex("by_tour", (q: any) => q.eq("tourId", tourId))
    .collect();

  if (reviews.length === 0) {
    await ctx.db.patch(tourId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  } else {
    const avgRating =
      reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
      reviews.length;
    await ctx.db.patch(tourId, {
      ratingsAverage: Math.round(avgRating * 10) / 10,
      ratingsQuantity: reviews.length,
    });
  }
}
