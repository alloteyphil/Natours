import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tours: defineTable({
    name: v.string(),
    slug: v.string(),
    duration: v.number(),
    maxGroupSize: v.number(),
    difficulty: v.string(),
    ratingsAverage: v.number(),
    ratingsQuantity: v.number(),
    price: v.number(),
    priceDiscount: v.optional(v.number()),
    summary: v.string(),
    description: v.string(),
    imageCover: v.optional(v.string()),
    images: v.array(v.string()),
    startDates: v.array(v.string()),
    secretTour: v.boolean(),
    startLocation: v.optional(
      v.object({
        type: v.literal("Point"),
        coordinates: v.array(v.number()),
        address: v.optional(v.string()),
        description: v.optional(v.string()),
      })
    ),
    locations: v.array(
      v.object({
        type: v.literal("Point"),
        coordinates: v.array(v.number()),
        address: v.optional(v.string()),
        description: v.optional(v.string()),
        day: v.optional(v.number()),
      })
    ),
    guides: v.array(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_price", ["price"])
    .index("by_ratings", ["ratingsAverage"])
    .index("by_price_ratings", ["price", "ratingsAverage"]),
  users: defineTable({
    authUserId: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    photo: v.optional(v.string()),
    role: v.string(),
    active: v.boolean(),
    stripeCustomerId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_auth_user", ["authUserId"]),
  reviews: defineTable({
    tourId: v.id("tours"),
    userId: v.id("users"),
    review: v.string(),
    rating: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tour", ["tourId"])
    .index("by_user", ["userId"])
    .index("by_tour_user", ["tourId", "userId"]),
  bookings: defineTable({
    tourId: v.id("tours"),
    userId: v.id("users"),
    price: v.number(),
    paid: v.boolean(),
    stripeSessionId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tour", ["tourId"])
    .index("by_user", ["userId"])
    .index("by_tour_user", ["tourId", "userId"])
    .index("by_stripe_session", ["stripeSessionId"]),
});
