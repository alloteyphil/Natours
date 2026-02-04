import { useEffect, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "../hooks/useToast";

const CheckoutSuccess = () => {
  const account = useQuery(api.users.getMe);
  const navigate = useNavigate();
  const search = useSearch({ from: "/checkout-success" });
  const { showToast } = useToast();
  const verifyBooking = useAction(api.stripe.verifyAndCreateBooking);
  const [isVerifying, setIsVerifying] = useState(false);

  // Check if booking exists for this session
  const booking = useQuery(
    api.bookings.getByStripeSession,
    search.session_id ? { stripeSessionId: search.session_id } : "skip"
  );

  useEffect(() => {
    // If no booking exists after 2 seconds, try to verify and create it manually
    if (search.session_id && account && !booking && !isVerifying) {
      const timer = setTimeout(async () => {
        setIsVerifying(true);
        try {
          await verifyBooking({ sessionId: search.session_id });
          showToast("Booking confirmed!", "success");
        } catch (error: any) {
          console.error("Failed to verify booking:", error);
          showToast(
            error.message || "Booking verification failed. Please contact support.",
            "error"
          );
        } finally {
          setIsVerifying(false);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [search.session_id, account, booking, isVerifying, verifyBooking, showToast]);

  useEffect(() => {
    // Wait a moment for auth state and booking to be created, then redirect
    if (account !== undefined) {
      const timer = setTimeout(() => {
        if (account) {
          navigate({ to: "/bookings", search: { checkout: "success" } });
        } else {
          navigate({ to: "/login" });
        }
      }, 4000); // Increased to 4 seconds to allow webhook/verification to process

      return () => clearTimeout(timer);
    }
  }, [account, navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 px-4 text-center">
      <div className="rounded-full bg-emerald-100 p-6 dark:bg-emerald-500/20">
        <svg
          className="h-16 w-16 text-emerald-600 dark:text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Payment Successful!
        </h1>
        <p className="max-w-md text-slate-600 dark:text-slate-300">
          Thank you for your booking. Your tour has been confirmed and you'll receive a confirmation email shortly.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          View My Bookings
        </Link>
        <Link
          to="/tours"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/50"
        >
          Browse More Tours
        </Link>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Redirecting you to your bookings...
      </p>
    </div>
  );
};

export default CheckoutSuccess;
