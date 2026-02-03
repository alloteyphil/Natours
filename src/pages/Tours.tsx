import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Pagination from "../components/Pagination";

const Tours = () => {
  const tours = useQuery(api.tours.list, { limit: 50 });
  const [page, setPage] = useState(1);
  const perPage = 6;
  const totalPages = tours ? Math.max(1, Math.ceil(tours.length / perPage)) : 1;
  const currentPage = useMemo(
    () => Math.min(page, totalPages),
    [page, totalPages]
  );
  const pagedTours = tours
    ? tours.slice((currentPage - 1) * perPage, currentPage * perPage)
    : [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold sm:text-3xl">All tours</h1>
        <p className="text-slate-600">
          Browse every adventure and book when you are ready.
        </p>
      </div>

      {!tours ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`tour-skeleton-${index}`}
              className="overflow-hidden rounded-2xl border border-emerald-200/70 bg-white shadow-[0_18px_50px_-42px_rgba(16,185,129,0.45)] dark:border-emerald-500/20 dark:bg-slate-900/60"
            >
              <div className="aspect-video animate-pulse bg-emerald-100 dark:bg-slate-800" />
              <div className="space-y-3 p-5">
                <div className="space-y-2">
                  <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-emerald-100 dark:bg-slate-800" />
                  <div className="h-4 w-20 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                  <div className="h-4 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : tours.length === 0 ? (
        <div className="space-y-3 rounded-2xl border border-dashed border-emerald-200/70 p-6 dark:border-emerald-500/30">
          <p className="text-slate-600 dark:text-slate-300">
            No tours available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {pagedTours.map((tour) => (
              <Link
                key={tour._id}
                to={`/tours/${tour.slug}`}
                className="group overflow-hidden rounded-2xl border border-emerald-200/70 bg-white shadow-[0_18px_50px_-42px_rgba(16,185,129,0.45)] transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_22px_60px_-36px_rgba(16,185,129,0.55)] dark:border-emerald-500/20 dark:bg-slate-900/60 dark:hover:border-emerald-500/40"
              >
                <div className="relative aspect-video overflow-hidden bg-emerald-50 dark:bg-slate-800">
                  <img
                    src={tour.imageCover ?? "/img/tours/tour-1-cover.jpg"}
                    alt={tour.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {tour.ratingsAverage > 0 && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-white">
                      <svg
                        className="h-3 w-3 fill-yellow-400"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.564-.955L10 0l2.947 5.955 6.564.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span>{tour.ratingsAverage.toFixed(1)}</span>
                      {tour.ratingsQuantity > 0 && (
                        <span className="text-slate-500">
                          ({tour.ratingsQuantity})
                        </span>
                      )}
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
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {tour.duration} days
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
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
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default Tours;
