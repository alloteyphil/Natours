import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Id } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import OptimizedImage from "./OptimizedImage";
import { useToast } from "../hooks/useToast";

type TourComparisonProps = {
  tourIds: Id<"tours">[];
};

const TourComparison = ({ tourIds }: TourComparisonProps) => {
  const tours = useQuery(api.tours.list, { limit: 100 });
  const { showToast } = useToast();
  const [selectedTours, setSelectedTours] = useState<Id<"tours">[]>(tourIds);

  const comparisonTours = tours?.filter((tour) =>
    selectedTours.includes(tour._id)
  ) ?? [];

  const removeTour = (tourId: Id<"tours">) => {
    if (selectedTours.length <= 1) {
      showToast("You need at least one tour to compare", "error");
      return;
    }
    setSelectedTours(selectedTours.filter((id) => id !== tourId));
  };

  const addTour = (tourId: Id<"tours">) => {
    if (selectedTours.length >= 3) {
      showToast("You can compare up to 3 tours at once", "error");
      return;
    }
    if (selectedTours.includes(tourId)) {
      showToast("Tour already added to comparison", "error");
      return;
    }
    setSelectedTours([...selectedTours, tourId]);
  };

  if (comparisonTours.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200/70 bg-white p-8 text-center dark:border-emerald-500/20 dark:bg-slate-900/60">
        <p className="text-slate-600 dark:text-slate-300">
          Select tours to compare them side by side
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Compare Tours
        </h2>
        {selectedTours.length < 3 && tours && (
          <select
            onChange={(e) => {
              if (e.target.value) {
                addTour(e.target.value as Id<"tours">);
                e.target.value = "";
              }
            }}
            className="rounded-lg border border-emerald-200/70 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-800 dark:text-white"
          >
            <option value="">Add tour to compare...</option>
            {tours
              .filter((tour) => !selectedTours.includes(tour._id))
              .map((tour) => (
                <option key={tour._id} value={tour._id}>
                  {tour.name}
                </option>
              ))}
          </select>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparisonTours.length}, minmax(280px, 1fr))` }}>
          {comparisonTours.map((tour) => {
            const finalPrice = tour.priceDiscount
              ? tour.price - tour.priceDiscount
              : tour.price;

            return (
              <div
                key={tour._id}
                className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-white dark:border-emerald-500/20 dark:bg-slate-900/60"
              >
                <button
                  onClick={() => removeTour(tour._id)}
                  className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 text-slate-600 shadow-sm transition hover:bg-white dark:bg-slate-800 dark:text-slate-300"
                  aria-label="Remove from comparison"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <Link to={`/tours/${tour.slug}`} className="block">
                  <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <OptimizedImage
                      src={tour.imageCover ?? "/img/tours/tour-1-cover.jpg"}
                      alt={tour.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-3 p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {tour.name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Price</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ${finalPrice}
                          {tour.priceDiscount && (
                            <span className="ml-1 text-xs text-slate-400 line-through">
                              ${tour.price}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Duration</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {tour.duration} days
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Difficulty</span>
                        <span className="font-medium capitalize text-slate-900 dark:text-white">
                          {tour.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Group Size</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          Max {tour.maxGroupSize}
                        </span>
                      </div>
                      {(tour.ratingsAverage ?? 0) > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Rating</span>
                          <div className="flex items-center gap-1">
                            <svg className="h-4 w-4 fill-yellow-400" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.564-.955L10 0l2.947 5.955 6.564.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {(tour.ratingsAverage ?? 0).toFixed(1)} ({tour.ratingsQuantity ?? 0})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TourComparison;
