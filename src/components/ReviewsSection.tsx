import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useToast } from "../hooks/useToast";

type ReviewsSectionProps = {
  tourId: Id<"tours">;
};

const ReviewsSection = ({ tourId }: ReviewsSectionProps) => {
  const reviews = useQuery(api.reviews.listByTour, { tourId });
  const account = useQuery(api.users.getMe);
  const createReview = useMutation(api.reviews.create);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || account === null) {
      showToast("Please log in to leave a review", "error");
      return;
    }

    if (review.trim().length < 10) {
      showToast("Review must be at least 10 characters", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({ tourId, review: review.trim(), rating });
      showToast("Review submitted successfully!", "success");
      setReview("");
      setRating(5);
      setShowForm(false);
    } catch (error: any) {
      showToast(error.message || "Failed to submit review", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canReview = account && account !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Reviews
        </h2>
        {canReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            Write a review
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-emerald-200/70 bg-white p-6 dark:border-emerald-500/20 dark:bg-slate-900/60"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Rating
              </label>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition hover:scale-110"
                  >
                    <svg
                      className={`h-8 w-8 ${star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-none text-slate-300"
                        }`}
                      stroke="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.564-.955L10 0l2.947 5.955 6.564.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                placeholder="Share your experience..."
                className="mt-2 w-full rounded-lg border border-emerald-200/70 bg-white px-4 py-3 text-slate-900 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting || review.trim().length < 10}
                className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setReview("");
                  setRating(5);
                }}
                className="rounded-full border border-emerald-200/70 px-6 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-emerald-500/30 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {reviews === undefined ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-emerald-200/70 bg-white p-8 text-center dark:border-emerald-500/20 dark:bg-slate-900/60">
          <p className="text-slate-600 dark:text-slate-300">
            No reviews yet. Be the first to review this tour!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-2xl border border-emerald-200/70 bg-white p-6 dark:border-emerald-500/20 dark:bg-slate-900/60"
            >
              <div className="flex items-start gap-4">
                {review.user?.photo ? (
                  <img
                    src={review.user.photo}
                    alt={review.user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                    <svg
                      className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {review.user?.name || "Anonymous"}
                    </h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                            }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.564-.955L10 0l2.947 5.955 6.564.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">
                    {review.review}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
