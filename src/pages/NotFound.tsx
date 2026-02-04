import { Link } from "@tanstack/react-router";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-emerald-600 dark:text-emerald-400">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Page not found
        </h2>
        <p className="max-w-md text-slate-600 dark:text-slate-300">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-600 bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:border-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Go home
        </Link>
        <Link
          to="/tours"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-200"
        >
          <svg
            className="h-5 w-5"
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
          Browse tours
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
