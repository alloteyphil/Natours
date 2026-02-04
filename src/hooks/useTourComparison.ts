import { useState, useEffect } from "react";
import type { Id } from "../../convex/_generated/dataModel";

const COMPARISON_STORAGE_KEY = "tour-comparison";

export const useTourComparison = () => {
  const [comparisonTours, setComparisonTours] = useState<Id<"tours">[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(COMPARISON_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      COMPARISON_STORAGE_KEY,
      JSON.stringify(comparisonTours)
    );
  }, [comparisonTours]);

  const addTour = (tourId: Id<"tours">) => {
    if (comparisonTours.length >= 3) {
      return false; // Max 3 tours
    }
    if (comparisonTours.includes(tourId)) {
      return false; // Already added
    }
    setComparisonTours([...comparisonTours, tourId]);
    return true;
  };

  const removeTour = (tourId: Id<"tours">) => {
    setComparisonTours(comparisonTours.filter((id) => id !== tourId));
  };

  const clearAll = () => {
    setComparisonTours([]);
  };

  const isInComparison = (tourId: Id<"tours">) => {
    return comparisonTours.includes(tourId);
  };

  return {
    comparisonTours,
    addTour,
    removeTour,
    clearAll,
    isInComparison,
  };
};
