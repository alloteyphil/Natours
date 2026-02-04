import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const tours = useQuery(api.tours.list, { limit: 50, search: search.trim() || undefined });
  const filteredTours = search.trim() ? tours?.slice(0, 5) : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search tours..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="h-10 w-full rounded-full border border-emerald-200/70 bg-white pl-10 pr-4 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/30"
        />
      </div>

      {isOpen && search.trim() && (
        <div className="absolute left-0 right-0 top-12 z-50 rounded-2xl border border-emerald-200/70 bg-white shadow-xl dark:border-emerald-500/20 dark:bg-slate-900">
          {filteredTours && filteredTours.length > 0 ? (
            <div className="py-2">
              {filteredTours.map((tour) => (
                <Link
                  key={tour._id}
                  to={`/tours/${tour.slug}`}
                  onClick={() => {
                    setSearch("");
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                >
                  {tour.imageCover && (
                    <img
                      src={tour.imageCover}
                      alt={tour.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {tour.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tour.duration} days • ${tour.price}
                    </p>
                  </div>
                </Link>
              ))}
              <Link
                to="/tours"
                onClick={() => {
                  setSearch("");
                  setIsOpen(false);
                }}
                className="block border-t border-emerald-100 px-4 py-2 text-center text-sm font-medium text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
              >
                View all tours
              </Link>
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No tours found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
