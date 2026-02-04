import { Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const Bookings = () => {
  const bookings = useQuery(api.bookings.getUserBookings);

  if (bookings === undefined) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
          My Bookings
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <svg
          className="h-16 w-16 text-slate-300 dark:text-slate-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          No bookings yet
        </h2>
        <p className="max-w-md text-slate-600 dark:text-slate-300">
          Start exploring our amazing tours and book your next adventure!
        </p>
        <Link
          to="/tours"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          Browse Tours
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
          My Bookings
        </h1>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <Link
            key={booking._id}
            to={booking.tour ? `/tours/${booking.tour.slug}` : "/tours"}
            className="group overflow-hidden rounded-2xl border border-emerald-200/70 bg-white shadow-sm transition hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/60"
          >
            {booking.tour?.imageCover && (
              <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={booking.tour.imageCover}
                  alt={booking.tour.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute right-3 top-3">
                  <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                    {booking.paid ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
            )}
            <div className="space-y-3 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {booking.tour?.name || "Tour"}
              </h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">
                  {booking.tour?.duration} days
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ${booking.price}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Booked on {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Bookings;
