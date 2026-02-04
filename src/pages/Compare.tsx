import { Link } from "@tanstack/react-router";
import TourComparison from "../components/TourComparison";
import { useTourComparison } from "../hooks/useTourComparison";

const Compare = () => {
  const { comparisonTours, clearAll } = useTourComparison();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
            Compare Tours
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {comparisonTours.length > 0
              ? "Select up to 3 tours to compare side by side"
              : "Add tours to compare their features, prices, and ratings"}
          </p>
        </div>
        {comparisonTours.length > 0 && (
          <button
            onClick={clearAll}
            className="rounded-full border border-emerald-200/70 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/50"
          >
            Clear all
          </button>
        )}
      </div>

      {comparisonTours.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 rounded-2xl border border-emerald-200/70 bg-white p-12 text-center dark:border-emerald-500/20 dark:bg-slate-900/60">
          <div className="rounded-full bg-emerald-100 p-6 dark:bg-emerald-500/20">
            <svg
              className="h-16 w-16 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              No tours to compare
            </h2>
            <p className="max-w-md text-slate-600 dark:text-slate-300">
              Start comparing tours by adding them from the tours page. You can compare up to 3 tours at once to help you make the best choice.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Browse Tours
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/50"
            >
              Go Home
            </Link>
          </div>
        </div>
      ) : (
        <TourComparison tourIds={comparisonTours} />
      )}
    </div>
  );
};

export default Compare;
