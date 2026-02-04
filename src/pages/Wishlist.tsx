import { Link } from "@tanstack/react-router";
import { useWishlist } from "../hooks/useWishlist";
import { useToast } from "../hooks/useToast";
import OptimizedImage from "../components/OptimizedImage";
import WishlistButton from "../components/WishlistButton";

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();
  const { showToast } = useToast();

  const handleClearAll = () => {
    if (wishlist.length === 0) return;
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      clearWishlist();
      showToast("Wishlist cleared", "info");
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="space-y-4">
          <svg
            className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Your wishlist is empty
          </h2>
          <p className="max-w-md text-slate-600 dark:text-slate-300">
            Start exploring tours and add them to your wishlist to save them for later.
          </p>
        </div>
        <Link
          to="/tours"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-600 bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:border-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          Browse tours
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {wishlist.length} {wishlist.length === 1 ? "tour" : "tours"} saved
          </p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={handleClearAll}
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-white transition hover:shadow-lg dark:border-emerald-500/20 dark:bg-slate-900/60 dark:hover:shadow-emerald-500/10"
          >
            <Link to={`/tours/${item.slug}`} className="block">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <OptimizedImage
                  src={item.imageCover}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute right-2 top-2">
                  <WishlistButton
                    tourId={item.id}
                    slug={item.slug}
                    name={item.name}
                    imageCover={item.imageCover}
                    price={item.price}
                    size="sm"
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="mt-2 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ${item.price}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
