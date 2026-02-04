import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import OptimizedImage from "./OptimizedImage";
import WishlistButton from "./WishlistButton";

type TourRecommendationsProps = {
  currentTourId: Id<"tours">;
  currentTour: {
    difficulty: string;
    price: number;
    duration: number;
  };
};

const TourRecommendations = ({
  currentTourId,
  currentTour,
}: TourRecommendationsProps) => {
  const tours = useQuery(api.tours.list, { limit: 50 });

  const recommendations = useMemo(() => {
    if (!tours) return [];

    return tours
      .filter((tour) => tour._id !== currentTourId)
      .map((tour) => {
        let score = 0;

        // Same difficulty = +3 points
        if (tour.difficulty === currentTour.difficulty) {
          score += 3;
        }

        // Similar price range (±20%) = +2 points
        const priceDiff = Math.abs(tour.price - currentTour.price) / currentTour.price;
        if (priceDiff <= 0.2) {
          score += 2;
        }

        // Similar duration (±2 days) = +2 points
        if (Math.abs(tour.duration - currentTour.duration) <= 2) {
          score += 2;
        }

        // High ratings = +1 point
        if ((tour.ratingsAverage ?? 0) >= 4.5) {
          score += 1;
        }

        return { tour, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.tour);
  }, [tours, currentTourId, currentTour]);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
        You might also like
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((tour) => {
          const finalPrice = tour.priceDiscount
            ? tour.price - tour.priceDiscount
            : tour.price;

          return (
            <Link
              key={tour._id}
              to={`/tours/${tour.slug}`}
              className="group overflow-hidden rounded-2xl border border-emerald-200/70 bg-white shadow-sm transition hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/60"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                <OptimizedImage
                  src={tour.imageCover ?? "/img/tours/tour-1-cover.jpg"}
                  alt={tour.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute right-2 top-2">
                  <WishlistButton
                    tourId={tour._id}
                    slug={tour.slug}
                    name={tour.name}
                    imageCover={tour.imageCover ?? "/img/tours/tour-1-cover.jpg"}
                    price={tour.price}
                    size="sm"
                  />
                </div>
                {tour.priceDiscount && (
                  <div className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                    Save ${tour.priceDiscount}
                  </div>
                )}
              </div>
              <div className="space-y-2 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                  {tour.name}
                </h3>
                <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                  {tour.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600 dark:text-slate-300">
                      {tour.duration} days
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="capitalize text-slate-600 dark:text-slate-300">
                      {tour.difficulty}
                    </span>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    ${finalPrice}
                  </span>
                </div>
                {(tour.ratingsAverage ?? 0) > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <svg className="h-4 w-4 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.564-.955L10 0l2.947 5.955 6.564.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="text-slate-600 dark:text-slate-300">
                      {(tour.ratingsAverage ?? 0).toFixed(1)} ({tour.ratingsQuantity ?? 0})
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TourRecommendations;
