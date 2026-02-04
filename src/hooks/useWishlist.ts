import { useEffect, useState } from "react";

const STORAGE_KEY = "natours_wishlist";

export type WishlistItem = {
  id: string;
  slug: string;
  name: string;
  imageCover: string;
  price: number;
  addedAt: number;
};

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  const addToWishlist = (tour: Omit<WishlistItem, "addedAt">) => {
    setWishlist((prev) => {
      if (prev.some((t) => t.id === tour.id)) {
        return prev; // Already in wishlist
      }
      const updated = [...prev, { ...tour, addedAt: Date.now() }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWishlist = (tourId: string) => {
    setWishlist((prev) => {
      const updated = prev.filter((t) => t.id !== tourId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (tourId: string) => {
    return wishlist.some((t) => t.id === tourId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };
};
