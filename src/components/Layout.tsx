import { useEffect, useState } from "react";
import { Link, Outlet, useRouterState, useMatchRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import SearchBar from "./SearchBar";

const Layout = () => {
  const account = useQuery(api.users.getMe);
  const location = useRouterState({ select: (s) => s.location });
  const matchRoute = useMatchRoute();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const [isNavOpen, setIsNavOpen] = useState(false);

  // Close mobile nav and scroll to top on route change
  useEffect(() => {
    setIsNavOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!isNavOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isNavOpen]);

  useEffect(() => {
    document.body.style.overflow = isNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isNavOpen]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next as "light" | "dark");
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem("theme", next);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f3fb] text-slate-900 dark:bg-[#0b0a14] dark:text-slate-100">
      <header className="sticky top-0 z-[100] border-b border-emerald-200/70 bg-white/95 backdrop-blur-sm dark:border-emerald-500/20 dark:bg-[#0b0a14]/95">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/img/logo-green.png"
              alt="Natours"
              className="h-9 w-auto"
            />
          </Link>
          <div className="hidden flex-1 px-4 md:block">
            <SearchBar />
          </div>
          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-2 lg:flex">
              <Link
                to="/tours"
                className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${matchRoute({ to: "/tours" })
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-200"
                  : "border-emerald-200/70 bg-white text-slate-600 hover:border-emerald-300 hover:text-slate-900 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/50 dark:hover:text-white"
                  }`}
              >
                <svg
                  className="h-4 w-4"
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
                Tours
              </Link>
              <Link
                to="/bookings"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${matchRoute({ to: "/bookings" })
                  ? "border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/20"
                  : "border-emerald-200/70 hover:border-emerald-300 dark:border-emerald-500/30 dark:hover:border-emerald-400/50"
                  }`}
                title="My Bookings"
              >
                <svg
                  className="h-5 w-5 text-slate-600 dark:text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </Link>
              <Link
                to="/wishlist"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${matchRoute({ to: "/wishlist" })
                  ? "border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/20"
                  : "border-emerald-200/70 hover:border-emerald-300 dark:border-emerald-500/30 dark:hover:border-emerald-400/50"
                  }`}
                title="Wishlist"
              >
                <svg
                  className="h-5 w-5 text-slate-600 dark:text-slate-300"
                  fill="none"
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
              </Link>
              <Link
                to="/account"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${matchRoute({ to: "/account" })
                  ? "border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/20"
                  : "border-emerald-200/70 hover:border-emerald-300 dark:border-emerald-500/30 dark:hover:border-emerald-400/50"
                  }`}
                title="Account"
              >
                {account?.user?.photo || account?.authUser?.image ? (
                  <img
                    src={account.user?.photo ?? account.authUser?.image ?? undefined}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : account === null ? (
                  <svg
                    className="h-5 w-5 text-slate-400 dark:text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ) : (
                  <div className="h-5 w-5 animate-pulse rounded-full bg-emerald-200 dark:bg-emerald-500/30" />
                )}
              </Link>
              {account === null && (
                <Link
                  to="/login"
                  className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${matchRoute({ to: "/login" })
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-200"
                    : "border-emerald-200/70 bg-white text-slate-600 hover:border-emerald-300 hover:text-slate-900 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/50 dark:hover:text-white"
                    }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Log in
                </Link>
              )}
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200/70 bg-white text-sm transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-500/30 dark:bg-slate-900 dark:hover:border-emerald-400/50 dark:hover:bg-emerald-500/10"
                aria-label="Toggle theme"
                title={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? (
                  <svg
                    className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-slate-600 dark:text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </nav>
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsNavOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200/70 bg-white text-sm transition hover:border-emerald-300 dark:border-emerald-500/30 dark:bg-slate-900 dark:hover:border-emerald-400/50 lg:hidden"
              aria-label="Open menu"
            >
              <svg
                className="h-5 w-5 text-slate-600 dark:text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity ${isNavOpen ? "opacity-100" : "pointer-events-none opacity-0"
          } lg:hidden`}
        onClick={() => setIsNavOpen(false)}
        aria-hidden={!isNavOpen}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-72 flex-col gap-6 bg-white p-6 shadow-2xl transition-transform dark:bg-slate-950 ${isNavOpen ? "translate-x-0" : "translate-x-full"
          } lg:hidden`}
        aria-hidden={!isNavOpen}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-900 dark:text-white">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setIsNavOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 text-sm text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-200 dark:hover:border-emerald-400/50 dark:hover:text-emerald-100"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            to="/tours"
            className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition ${matchRoute({ to: "/tours" })
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            onClick={() => setIsNavOpen(false)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Tours
          </Link>
          <Link
            to="/bookings"
            className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition ${matchRoute({ to: "/bookings" })
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            onClick={() => setIsNavOpen(false)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Bookings
          </Link>
          <Link
            to="/wishlist"
            className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition ${matchRoute({ to: "/wishlist" })
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            onClick={() => setIsNavOpen(false)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            Wishlist
          </Link>
          <Link
            to="/account"
            className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition ${matchRoute({ to: "/account" })
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            onClick={() => setIsNavOpen(false)}
          >
            {account?.user?.photo || account?.authUser?.image ? (
              <img
                src={(account.user?.photo ?? account.authUser?.image) ?? undefined}
                alt="Profile"
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : account === null ? (
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            ) : (
              <div className="h-5 w-5 animate-pulse rounded-full bg-emerald-200 dark:bg-emerald-500/30" />
            )}
            <span>Account</span>
          </Link>
          {account === null && (
            <Link
              to="/login"
              className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition ${matchRoute({ to: "/login" })
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              onClick={() => setIsNavOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Log in
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              toggleTheme();
              setIsNavOpen(false);
            }}
            className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {theme === "dark" ? (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Light mode
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                Dark mode
              </>
            )}
          </button>
        </nav>
      </aside>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-10">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-emerald-200/70 bg-white/70 py-8 text-sm dark:border-emerald-500/20 dark:bg-[#0b0a14]/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/img/logo-green.png"
                alt="Natours"
                className="h-8 w-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Natours
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Explore the world with us
                </span>
              </div>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Tours
              </Link>
              <Link
                to="/account"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200/70 bg-white transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-500/30 dark:bg-slate-900 dark:hover:border-emerald-400/50 dark:hover:bg-emerald-500/10"
                title="Account"
              >
                {account?.user?.photo || account?.authUser?.image ? (
                  <img
                    src={account.user?.photo ?? account.authUser?.image ?? undefined}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : account === null ? (
                  <svg
                    className="h-5 w-5 text-slate-400 dark:text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ) : (
                  <div className="h-5 w-5 animate-pulse rounded-full bg-emerald-200 dark:bg-emerald-500/30" />
                )}
              </Link>
              {account === null && (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-200"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Log in
                </Link>
              )}
            </nav>
          </div>
          <div className="flex flex-col items-center gap-2 border-t border-emerald-100/50 pt-6 dark:border-emerald-500/10 sm:flex-row sm:justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Natours. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <a
                href="#"
                className="transition hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Privacy
              </a>
              <span className="text-emerald-200 dark:text-emerald-500/30">•</span>
              <a
                href="#"
                className="transition hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Terms
              </a>
              <span className="text-emerald-200 dark:text-emerald-500/30">•</span>
              <a
                href="#"
                className="transition hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
