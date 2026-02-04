import { useWishlist } from "../hooks/useWishlist";
import { useToast } from "../hooks/useToast";
import type { Id } from "../../convex/_generated/dataModel";

type WishlistButtonProps = {
  tourId: Id<"tours">;
  slug: string;
  name: string;
  imageCover: string;
  price: number;
  size?: "sm" | "md";
};

const WishlistButton = ({
  tourId,
  slug,
  name,
  imageCover,
  price,
  size = "md",
}: WishlistButtonProps) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const inWishlist = isInWishlist(tourId);

  const handleToggle = () => {
    if (inWishlist) {
      removeFromWishlist(tourId);
      showToast("Removed from wishlist", "info");
    } else {
      addToWishlist({ id: tourId, slug, name, imageCover, price });
      showToast("Added to wishlist", "success");
    }
  };

  const sizeClasses =
    size === "sm"
      ? "h-8 w-8"
      : "h-10 w-10";

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center justify-center rounded-full border transition ${inWishlist
        ? "border-emerald-600 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30"
        : "border-emerald-200/70 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-600 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/50 dark:hover:text-emerald-400"
        } ${sizeClasses}`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"}`}
        fill={inWishlist ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};

export default WishlistButton;
