import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Pagination from "../components/Pagination";

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "duration";
type DifficultyFilter = "all" | "easy" | "medium" | "difficult";

const Tours = () => {
  const tours = useQuery(api.tours.list, { limit: 50 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedTours = useMemo(() => {
    if (!tours) return [];

    let result = [...tours];

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (tour) =>
          tour.name.toLowerCase().includes(searchLower) ||
          tour.summary.toLowerCase().includes(searchLower)
      );
    }

    // Difficulty filter
    if (difficulty !== "all") {
      result = result.filter((tour) => tour.difficulty === difficulty);
    }

    // Max price filter
    if (maxPrice !== "" && maxPrice > 0) {
      result = result.filter((tour) => tour.price <= maxPrice);
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
        break;
      case "duration":
        result.sort((a, b) => a.duration - b.duration);
        break;
    }

    return result;
  }, [tours, search, difficulty, maxPrice, sortBy]);

  const perPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTours.length / perPage));
  const currentPage = useMemo(
    () => Math.min(page, totalPages),
    [page, totalPages]
  );
  const pagedTours = filteredAndSortedTours.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setPage(1);
  };

  const activeFiltersCount =
    (search ? 1 : 0) +
    (difficulty !== "all" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0) +
    (sortBy !== "default" ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setDifficulty("all");
    setMaxPrice("");
    setSortBy("default");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
          All tours
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Browse every adventure and book when you are ready.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search tours..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleFilterChange();
              }}
              className="w-full rounded-xl border border-emerald-200/70 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/30"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200/70 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-400/50 dark:hover:bg-slate-800"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="rounded-2xl border border-emerald-200/70 bg-white p-4 shadow-sm dark:border-emerald-500/20 dark:bg-slate-900/60">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Difficulty Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => {
                    setDifficulty(e.target.value as DifficultyFilter);
                    handleFilterChange();
                  }}
                  className="w-full rounded-lg border border-emerald-200/70 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-800 dark:text-white"
                >
                  <option value="all">All difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>

              {/* Max Price Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Max price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="Any"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value ? Number(e.target.value) : "");
                      handleFilterChange();
                    }}
                    min={0}
                    className="w-full rounded-lg border border-emerald-200/70 bg-white py-2 pl-7 pr-3 text-sm text-slate-900 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption);
                    handleFilterChange();
                  }}
                  className="w-full rounded-lg border border-emerald-200/70 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-800 dark:text-white"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Shortest First</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={activeFiltersCount === 0}
                  className="w-full rounded-lg border border-emerald-200/70 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-500/30 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-400/50"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        {tours && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredAndSortedTours.length === tours.length
              ? `${tours.length} tours available`
              : `Showing ${filteredAndSortedTours.length} of ${tours.length} tours`}
          </p>
        )}
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
      ) : filteredAndSortedTours.length === 0 ? (
        <div className="space-y-4 rounded-2xl border border-dashed border-emerald-200/70 p-8 text-center dark:border-emerald-500/30">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              No tours match your filters
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Try adjusting your search or filter criteria.
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            Clear all filters
          </button>
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
