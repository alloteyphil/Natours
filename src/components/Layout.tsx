import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const [isNavOpen, setIsNavOpen] = useState(false);

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

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full rounded-full px-4 py-2 text-center text-sm font-medium transition lg:w-auto ${isActive
      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30"
      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f3fb] text-slate-900 dark:bg-[#0b0a14] dark:text-slate-100">
      <header className="border-b border-emerald-200/70 bg-white/70 backdrop-blur dark:border-emerald-500/20 dark:bg-[#0b0a14]/80">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <NavLink to="/" className="flex items-center gap-3">
            <img
              src="/img/logo-green.png"
              alt="Natours"
              className="h-9 w-auto"
            />
          </NavLink>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 rounded-full border border-emerald-200/70 bg-white/80 p-1 shadow-sm shadow-emerald-500/10 dark:border-emerald-500/20 dark:bg-slate-900/70 lg:flex">
              <NavLink to="/tours" className={linkClass}>
                Tours
              </NavLink>
              <NavLink to="/account" className={linkClass}>
                Account
              </NavLink>
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
            </nav>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-sm text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-800 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-emerald-200 dark:hover:border-emerald-400/50 dark:hover:text-emerald-100"
              aria-label="Toggle theme"
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              type="button"
              onClick={() => setIsNavOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-sm text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-800 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-emerald-200 dark:hover:border-emerald-400/50 dark:hover:text-emerald-100 lg:hidden"
              aria-label="Open menu"
            >
              ☰
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
          <NavLink
            to="/tours"
            className={linkClass}
            onClick={() => setIsNavOpen(false)}
          >
            Tours
          </NavLink>
          <NavLink
            to="/account"
            className={linkClass}
            onClick={() => setIsNavOpen(false)}
          >
            Account
          </NavLink>
          <NavLink
            to="/login"
            className={linkClass}
            onClick={() => setIsNavOpen(false)}
          >
            Log in
          </NavLink>
        </nav>
      </aside>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-10">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-emerald-200/70 bg-white/70 py-8 text-sm text-slate-600 dark:border-emerald-500/20 dark:bg-[#0b0a14]/80 dark:text-slate-300">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <span>
            © {new Date().getFullYear()} Natours. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <NavLink
              to="/tours"
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              Tours
            </NavLink>
            <NavLink
              to="/account"
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              Account
            </NavLink>
            <NavLink
              to="/login"
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              Log in
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
