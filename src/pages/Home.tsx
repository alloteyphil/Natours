import { useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
const featuredTours = [
  {
    id: "forest-hiker",
    name: "The Forest Hiker",
    slug: "the-forest-hiker",
    duration: 5,
    difficulty: "easy",
    price: 397,
    ratingsAverage: 4.7,
    ratingsQuantity: 37,
    maxGroupSize: 25,
    summary: "Breathe in the forest air on a guided hiking adventure.",
    imageCover: "/img/tours/tour-1-cover.jpg",
  },
  {
    id: "sea-explorer",
    name: "The Sea Explorer",
    slug: "the-sea-explorer",
    duration: 7,
    difficulty: "medium",
    price: 497,
    ratingsAverage: 4.8,
    ratingsQuantity: 23,
    maxGroupSize: 15,
    summary: "Sail into crystal waters with a small-group crew.",
    imageCover: "/img/tours/tour-2-cover.jpg",
  },
  {
    id: "snow-adventurer",
    name: "The Snow Adventurer",
    slug: "the-snow-adventurer",
    duration: 4,
    difficulty: "difficult",
    price: 899,
    ratingsAverage: 4.6,
    ratingsQuantity: 14,
    maxGroupSize: 10,
    summary: "Chase powder and auroras in the snowy backcountry.",
    imageCover: "/img/tours/tour-3-cover.jpg",
  },
  {
    id: "city-wanderer",
    name: "The City Wanderer",
    slug: "the-city-wanderer",
    duration: 3,
    difficulty: "easy",
    price: 299,
    ratingsAverage: 4.4,
    ratingsQuantity: 19,
    maxGroupSize: 30,
    summary: "A curated escape through iconic city highlights.",
    imageCover: "/img/tours/tour-4-cover.jpg",
  },
  {
    id: "park-camper",
    name: "The Park Camper",
    slug: "the-park-camper",
    duration: 10,
    difficulty: "medium",
    price: 1097,
    summary: "Camp under the stars in America’s top parks.",
    imageCover: "/img/tours/tour-5-cover.jpg",
  },
  {
    id: "sports-lover",
    name: "The Sports Lover",
    slug: "the-sports-lover",
    duration: 5,
    difficulty: "easy",
    price: 399,
    ratingsAverage: 4.3,
    ratingsQuantity: 12,
    maxGroupSize: 20,
    summary: "Live match days, stadium tours, and local celebrations.",
    imageCover: "/img/tours/tour-6-cover.jpg",
  },
];

const Home = () => {
  const displayTours = featuredTours;
  const [page, setPage] = useState(1);
  const perPage = 4;
  const totalPages = Math.max(1, Math.ceil(displayTours.length / perPage));
  const pagedTours = displayTours.slice((page - 1) * perPage, page * perPage);
  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="grid gap-8 rounded-3xl border border-emerald-200/70 bg-white p-6 shadow-[0_24px_80px_-60px_rgba(16,185,129,0.5)] dark:border-emerald-500/20 dark:bg-slate-900/60 sm:p-8 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
            Fresh drops weekly
          </span>
          <h1 className="text-3xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-4xl">
            Explore the world in style with curated, small-group tours.
          </h1>
          <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Handpicked adventures with transparent pricing, flexible dates, and
            instant booking. Find your next escape in minutes.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span className="rounded-full border border-emerald-200/70 px-3 py-1 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-200">
              150+ happy travelers
            </span>
            <span className="rounded-full border border-emerald-200/70 px-3 py-1 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-200">
              24/7 trip support
            </span>
            <span className="rounded-full border border-emerald-200/70 px-3 py-1 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-200">
              Secure checkout
            </span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-emerald-50 dark:bg-slate-800">
          <img
            src="/img/tours/tour-7-cover.jpg"
            alt="Featured tour"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-emerald-950/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm backdrop-blur dark:bg-slate-950/80 dark:text-emerald-100">
            Save up to 20% this season
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
              Popular tours
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Quick picks based on traveler ratings.
            </p>
          </div>
          <Link
            to="/tours"
            className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
          >
            View all tours
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {pagedTours.map((tour) => (
            <Link
              key={tour.id}
              to={`/tours/${tour.slug}`}
              className="group overflow-hidden rounded-2xl border border-emerald-200/70 bg-white shadow-[0_18px_50px_-42px_rgba(16,185,129,0.45)] transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_22px_60px_-36px_rgba(16,185,129,0.55)] dark:border-emerald-500/20 dark:bg-slate-900/60 dark:hover:border-emerald-500/40"
            >
              <div className="relative aspect-video overflow-hidden bg-emerald-50 dark:bg-slate-800">
                <img
                  src={tour.imageCover}
                  alt={tour.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                {tour.ratingsAverage && tour.ratingsAverage > 0 && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-white">
                    <svg
                      className="h-3 w-3 fill-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.564-.955L10 0l2.947 5.955 6.564.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span>{tour.ratingsAverage.toFixed(1)}</span>
                    <span className="text-slate-500">({tour.ratingsQuantity})</span>
                  </div>
                )}
              </div>
              <div className="space-y-3 p-5">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {tour.name}
                    </h3>
                    <span className="shrink-0 text-lg font-bold text-emerald-700 dark:text-emerald-300">
                      ${tour.price}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {tour.summary}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 border-t border-emerald-100 pt-3 text-xs text-slate-500 dark:border-emerald-500/20 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {tour.duration} days
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Max {tour.maxGroupSize}
                  </span>
                  <span className="capitalize rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                    {tour.difficulty}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
};

export default Home;
