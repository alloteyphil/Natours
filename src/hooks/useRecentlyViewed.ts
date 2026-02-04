import { useEffect, useState } from "react";

const STORAGE_KEY = "natours_recently_viewed";
const MAX_ITEMS = 5;

export type RecentlyViewedTour = {
  id: string;
  slug: string;
  name: string;
  imageCover: string;
  price: number;
  viewedAt: number;
};

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedTour[]>(
    []
  );

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  const addTour = (tour: Omit<RecentlyViewedTour, "viewedAt">) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((t) => t.id !== tour.id);
      const updated = [{ ...tour, viewedAt: Date.now() }, ...filtered].slice(
        0,
        MAX_ITEMS
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { recentlyViewed, addTour, clearAll };
};
