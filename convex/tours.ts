import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    let tours = await ctx.db
      .query("tours")
      .withIndex("by_price")
      .order("asc")
      .take(limit);

    // Filter by search term if provided
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      tours = tours.filter(
        (tour) =>
          tour.name.toLowerCase().includes(searchLower) ||
          tour.summary.toLowerCase().includes(searchLower) ||
          tour.description.toLowerCase().includes(searchLower)
      );
    }

    return tours;
  },
});

export const getById = query({
  args: {
    id: v.id("tours"),
  },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tours")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const seedSampleTours = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("tours").take(1);
    if (existing.length > 0) {
      return { created: 0, skipped: true };
    }

    const now = Date.now();
    const tours = [
      {
        name: "The Forest Hiker",
        slug: "the-forest-hiker",
        duration: 5,
        maxGroupSize: 25,
        difficulty: "easy",
        ratingsAverage: 4.7,
        ratingsQuantity: 37,
        price: 397,
        priceDiscount: 0,
        summary: "Breathe in the forest air on a guided hiking adventure.",
        description:
          "Explore lush forest trails with expert guides, scenic overlooks, and cozy campfire nights.",
        imageCover: "/img/tours/tour-1-cover.jpg",
        images: [
          "/img/tours/tour-1-1.jpg",
          "/img/tours/tour-1-2.jpg",
          "/img/tours/tour-1-3.jpg",
        ],
        startDates: ["2026-04-01", "2026-05-01"],
      },
      {
        name: "The Sea Explorer",
        slug: "the-sea-explorer",
        duration: 7,
        maxGroupSize: 15,
        difficulty: "medium",
        ratingsAverage: 4.8,
        ratingsQuantity: 23,
        price: 497,
        priceDiscount: 50,
        summary: "Sail into crystal waters with a small-group crew.",
        description:
          "Snorkel hidden coves, explore coastal villages, and enjoy fresh seafood by the shore.",
        imageCover: "/img/tours/tour-2-cover.jpg",
        images: [
          "/img/tours/tour-2-1.jpg",
          "/img/tours/tour-2-2.jpg",
          "/img/tours/tour-2-3.jpg",
        ],
        startDates: ["2026-04-15", "2026-06-10"],
      },
      {
        name: "The Snow Adventurer",
        slug: "the-snow-adventurer",
        duration: 4,
        maxGroupSize: 10,
        difficulty: "difficult",
        ratingsAverage: 4.6,
        ratingsQuantity: 14,
        price: 899,
        priceDiscount: 0,
        summary: "Chase powder and auroras in the snowy backcountry.",
        description:
          "Snowshoe across alpine landscapes, warm up in mountain lodges, and spot northern lights.",
        imageCover: "/img/tours/tour-3-cover.jpg",
        images: [
          "/img/tours/tour-3-1.jpg",
          "/img/tours/tour-3-2.jpg",
          "/img/tours/tour-3-3.jpg",
        ],
        startDates: ["2026-01-20", "2026-02-10"],
      },
      {
        name: "The City Wanderer",
        slug: "the-city-wanderer",
        duration: 3,
        maxGroupSize: 30,
        difficulty: "easy",
        ratingsAverage: 4.4,
        ratingsQuantity: 19,
        price: 299,
        priceDiscount: 0,
        summary: "A curated escape through iconic city highlights.",
        description:
          "Visit hidden cafes, famous landmarks, and neighborhoods loved by locals.",
        imageCover: "/img/tours/tour-4-cover.jpg",
        images: [
          "/img/tours/tour-4-1.jpg",
          "/img/tours/tour-4-2.jpg",
          "/img/tours/tour-4-3.jpg",
        ],
        startDates: ["2026-03-12", "2026-05-05"],
      },
      {
        name: "The Park Camper",
        slug: "the-park-camper",
        duration: 10,
        maxGroupSize: 12,
        difficulty: "medium",
        ratingsAverage: 4.9,
        ratingsQuantity: 45,
        price: 1097,
        priceDiscount: 0,
        summary: "Camp under the stars in America’s top parks.",
        description:
          "Wake up to sunrise hikes, guided wildlife spotting, and nights under the Milky Way.",
        imageCover: "/img/tours/tour-5-cover.jpg",
        images: [
          "/img/tours/tour-5-1.jpg",
          "/img/tours/tour-5-2.jpg",
          "/img/tours/tour-5-3.jpg",
        ],
        startDates: ["2026-06-01", "2026-07-10"],
      },
      {
        name: "The Sports Lover",
        slug: "the-sports-lover",
        duration: 5,
        maxGroupSize: 20,
        difficulty: "easy",
        ratingsAverage: 4.3,
        ratingsQuantity: 12,
        price: 399,
        priceDiscount: 0,
        summary: "Live match days, stadium tours, and local celebrations.",
        description:
          "Experience the energy of world-class sports with behind-the-scenes access.",
        imageCover: "/img/tours/tour-6-cover.jpg",
        images: [
          "/img/tours/tour-6-1.jpg",
          "/img/tours/tour-6-2.jpg",
          "/img/tours/tour-6-3.jpg",
        ],
        startDates: ["2026-08-05", "2026-09-02"],
      },
      {
        name: "The Wine Taster",
        slug: "the-wine-taster",
        duration: 6,
        maxGroupSize: 14,
        difficulty: "medium",
        ratingsAverage: 4.8,
        ratingsQuantity: 31,
        price: 799,
        priceDiscount: 100,
        summary: "Sip your way through world-famous vineyards.",
        description:
          "Taste award-winning wines, learn pairing basics, and meet artisan vintners.",
        imageCover: "/img/tours/tour-7-cover.jpg",
        images: [
          "/img/tours/tour-7-1.jpg",
          "/img/tours/tour-7-2.jpg",
          "/img/tours/tour-7-3.jpg",
        ],
        startDates: ["2026-04-25", "2026-06-20"],
      },
      {
        name: "The Star Gazer",
        slug: "the-star-gazer",
        duration: 5,
        maxGroupSize: 12,
        difficulty: "easy",
        ratingsAverage: 4.9,
        ratingsQuantity: 18,
        price: 499,
        priceDiscount: 0,
        summary: "Night skies, telescopes, and desert tranquility.",
        description:
          "Camp in remote landscapes, learn astronomy basics, and photograph the Milky Way.",
        imageCover: "/img/tours/tour-8-cover.jpg",
        images: [
          "/img/tours/tour-8-1.jpg",
          "/img/tours/tour-8-2.jpg",
          "/img/tours/tour-8-3.jpg",
        ],
        startDates: ["2026-09-15", "2026-10-10"],
      },
      {
        name: "The Northern Lights",
        slug: "the-northern-lights",
        duration: 7,
        maxGroupSize: 10,
        difficulty: "difficult",
        ratingsAverage: 4.7,
        ratingsQuantity: 16,
        price: 1299,
        priceDiscount: 0,
        summary: "A winter expedition to chase the aurora.",
        description:
          "Snowmobile through arctic terrain, warm up in cabins, and witness epic auroras.",
        imageCover: "/img/tours/tour-9-cover.jpg",
        images: [
          "/img/tours/tour-9-1.jpg",
          "/img/tours/tour-9-2.jpg",
          "/img/tours/tour-9-3.jpg",
        ],
        startDates: ["2026-12-01", "2027-01-15"],
      },
    ];

    for (const tour of tours) {
      await ctx.db.insert("tours", {
        ...tour,
        secretTour: false,
        guides: [],
        locations: [],
        createdAt: now,
        updatedAt: now,
      });
    }

    return { created: tours.length, skipped: false };
  },
});
