import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CheckoutButton from "../features/bookings/CheckoutButton";
import OptimizedImage from "../components/OptimizedImage";
import WishlistButton from "../components/WishlistButton";
import ShareButton from "../components/ShareButton";
import ReviewsSection from "../components/ReviewsSection";
import ImageLightbox from "../components/ImageLightbox";
import TourRecommendations from "../components/TourRecommendations";
import CompareButton from "../components/CompareButton";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

const TourDetail = () => {
  const { slug } = useParams({ from: "/tours/$slug" });
  const tour = useQuery(api.tours.getBySlug, slug ? { slug } : "skip");
  const { addTour } = useRecentlyViewed();
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(null);

  // Track recently viewed tour
  useEffect(() => {
    if (tour) {
      addTour({
        id: tour._id,
        slug: tour.slug,
        name: tour.name,
        imageCover: tour.imageCover ?? "/img/tours/tour-1-cover.jpg",
        price: tour.price,
      });
    }
  }, [tour, addTour]);

  if (!tour && slug) {
    return (
      <div className="space-y-8">
        <div className="overflow-hidden rounded-3xl border border-emerald-200/70 bg-white dark:border-emerald-500/20 dark:bg-slate-900/60">
          <div className="aspect-video animate-pulse bg-emerald-100 dark:bg-slate-800" />
          <div className="space-y-3 p-4 sm:p-6">
            <div className="h-4 w-24 animate-pulse rounded-full bg-emerald-100 dark:bg-slate-700" />
            <div className="h-7 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>

        <div className="grid gap-6 rounded-2xl border border-emerald-200/70 bg-white p-4 sm:p-6 dark:border-emerald-500/20 dark:bg-slate-900/60 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`stat-skeleton-${index}`} className="space-y-2">
              <div className="h-3 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`gallery-skeleton-${index}`}
                className="aspect-4/3 animate-pulse rounded-2xl border border-emerald-200/70 bg-emerald-100 dark:border-emerald-500/20 dark:bg-slate-800"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="space-y-3">
        <p className="text-slate-600 dark:text-slate-300">Tour not found.</p>
        <Link
          to="/tours"
          className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          Back to tours
        </Link>
      </div>
    );
  }

  const finalPrice = tour.priceDiscount
    ? tour.price - tour.priceDiscount
    : tour.price;
  const images = tour.images ?? [];
  const startDates = tour.startDates ?? [];
  const locations = tour.locations ?? [];

  return (
    <div className="space-y-8">
      <div className="relative rounded-3xl border border-emerald-200/70 bg-white dark:border-emerald-500/20 dark:bg-slate-900/60">
        <div className="relative aspect-video overflow-hidden rounded-t-3xl bg-slate-100 dark:bg-slate-800">
          <OptimizedImage
            src={tour.imageCover ?? "/img/tours/tour-1-cover.jpg"}
            alt={tour.name}
            priority
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-3 sm:right-auto">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-emerald-200">
              {tour.difficulty}
            </span>
            {(tour.ratingsAverage ?? 0) > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-white">
                <svg className="h-3 w-3 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.564-.955L10 0l2.947 5.955 6.564.955-4.756 4.635 1.123 6.545z" />
                </svg>
                {(tour.ratingsAverage ?? 0).toFixed(1)} ({tour.ratingsQuantity ?? 0})
              </span>
            )}
          </div>
        </div>
        <div className="space-y-4 p-6 sm:p-8">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                  {tour.name}
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
                  {tour.summary}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ShareButton tourName={tour.name} tourSlug={tour.slug} />
                <CompareButton tourId={tour._id} />
                <WishlistButton
                  tourId={tour._id}
                  slug={tour.slug}
                  name={tour.name}
                  imageCover={tour.imageCover ?? "/img/tours/tour-1-cover.jpg"}
                  price={tour.price}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tour.duration} days
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Max {tour.maxGroupSize} people
            </span>
            {tour.startLocation?.address && (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {tour.startLocation.address}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <div className="rounded-2xl border border-emerald-200/70 bg-white p-6 shadow-sm dark:border-emerald-500/20 dark:bg-slate-900/60">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
              Quick facts
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Next date</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {startDates.length > 0 ? startDates[0] : "TBA"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Group size</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {tour.maxGroupSize} people
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Difficulty</p>
                  <p className="text-sm font-semibold capitalize text-slate-900 dark:text-white">
                    {tour.difficulty}
                  </p>
                </div>
              </div>
              {(tour.ratingsAverage ?? 0) > 0 && (
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.564-.955L10 0l2.947 5.955 6.564.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Rating</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {(tour.ratingsAverage ?? 0).toFixed(1)} / 5 ({tour.ratingsQuantity ?? 0} reviews)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {startDates.length > 0 && (
            <div className="rounded-2xl border border-emerald-200/70 bg-white p-6 shadow-sm dark:border-emerald-500/20 dark:bg-slate-900/60">
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                Available dates
              </h2>
              <div className="flex flex-wrap gap-2">
                {startDates.map((date, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                  >
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                ))}
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Gallery
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setLightboxImageIndex(index)}
                    className="aspect-4/3 overflow-hidden rounded-2xl border border-emerald-200/70 bg-slate-100 transition hover:scale-[1.02] dark:border-emerald-500/20 dark:bg-slate-800"
                  >
                    <OptimizedImage
                      src={image}
                      alt={`${tour.name} gallery`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              About this tour
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              {tour.description}
            </p>
          </div>

          {locations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Tour locations
              </h2>
              <div className="space-y-3">
                {locations.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-emerald-200/70 bg-white p-4 dark:border-emerald-500/20 dark:bg-slate-900/60"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                      {location.day ?? index + 1}
                    </span>
                    <div className="flex-1">
                      {location.description && (
                        <p className="font-medium text-slate-900 dark:text-white">
                          {location.description}
                        </p>
                      )}
                      {location.address && (
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {location.address}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-6 lg:z-40 lg:h-fit">
          <div className="rounded-2xl border border-emerald-200/70 bg-white p-6 shadow-lg dark:border-emerald-500/20 dark:bg-slate-900/60">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-emerald-100 pb-4 dark:border-emerald-500/20">
                <div className="space-y-2 flex-1">
                  <div className="flex items-baseline gap-2">
                    {tour.priceDiscount ? (
                      <>
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                          ${finalPrice}
                        </span>
                        <span className="text-lg text-slate-500 line-through dark:text-slate-400">
                          ${tour.price}
                        </span>
                        <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                          Save ${tour.priceDiscount}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        ${tour.price}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    per person
                  </p>
                </div>
                <WishlistButton
                  tourId={tour._id}
                  slug={tour.slug}
                  name={tour.name}
                  imageCover={tour.imageCover ?? "/img/tours/tour-1-cover.jpg"}
                  price={tour.price}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">
                    Duration
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {tour.duration} days
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">
                    Group size
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    Max {tour.maxGroupSize}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">
                    Difficulty
                  </span>
                  <span className="font-medium capitalize text-slate-900 dark:text-white">
                    {tour.difficulty}
                  </span>
                </div>
              </div>
              <CheckoutButton tourId={tour._id} />
            </div>
          </div>
        </div>
      </div>

      <ReviewsSection tourId={tour._id} />

      {lightboxImageIndex !== null && images.length > 0 && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxImageIndex}
          onClose={() => setLightboxImageIndex(null)}
          onNavigate={(index) => setLightboxImageIndex(index)}
        />
      )}

      {tour && (
        <TourRecommendations
          currentTourId={tour._id}
          currentTour={{
            difficulty: tour.difficulty,
            price: tour.price,
            duration: tour.duration,
          }}
        />
      )}
    </div>
  );
};

export default TourDetail;
