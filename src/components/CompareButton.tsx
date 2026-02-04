import { useTourComparison } from "../hooks/useTourComparison";
import { useToast } from "../hooks/useToast";
import type { Id } from "../../convex/_generated/dataModel";
import { Link } from "@tanstack/react-router";

type CompareButtonProps = {
  tourId: Id<"tours">;
  size?: "sm" | "md";
};

const CompareButton = ({ tourId, size = "md" }: CompareButtonProps) => {
  const { addTour, removeTour, isInComparison, comparisonTours } =
    useTourComparison();
  const { showToast } = useToast();
  const inComparison = isInComparison(tourId);

  const sizeClasses = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inComparison) {
      removeTour(tourId);
      showToast("Removed from comparison", "info");
    } else {
      if (comparisonTours.length >= 3) {
        showToast("You can compare up to 3 tours at once", "error");
        return;
      }
      addTour(tourId);
      showToast("Added to comparison", "success");
    }
  };

  if (inComparison && comparisonTours.length > 0) {
    return (
      <Link
        to="/compare"
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`inline-flex items-center justify-center rounded-full border transition ${"border-emerald-600 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30"
          } ${sizeClasses}`}
        title={`View comparison (${comparisonTours.length})`}
      >
        <svg
          className={size === "sm" ? "h-4 w-4" : "h-5 w-5"}
          fill="currentColor"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center justify-center rounded-full border border-emerald-200/70 bg-white text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/50 dark:hover:text-emerald-400 ${sizeClasses}`}
      title="Add to comparison"
      aria-label="Add to comparison"
    >
      <svg
        className={size === "sm" ? "h-4 w-4" : "h-5 w-5"}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    </button>
  );
};

export default CompareButton;
