import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authClient } from "../lib/auth-client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message ?? "Unable to log in");
        setIsLoading(false);
        return;
      }
      window.location.assign("/account");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to log in";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-emerald-200/70 bg-white p-8 shadow-[0_24px_70px_-55px_rgba(16,185,129,0.45)] dark:border-emerald-500/20 dark:bg-slate-900/70">
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <img
              src="/img/logo-green.png"
              alt="Natours"
              className="h-9 w-auto"
            />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Log in to manage your bookings and saved tours.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-emerald-200/70 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/30"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-emerald-200/70 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/30"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Need an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-emerald-700 transition hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
