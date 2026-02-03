import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

type CheckoutButtonProps = {
  tourId: Id<"tours">;
};

const CheckoutButton = ({ tourId }: CheckoutButtonProps) => {
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);
  const authUser = useQuery(api.auth.getAuthUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!authUser) {
      window.location.assign("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createCheckoutSession({ tourId });
      window.location.assign(result.url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to start checkout";
      if (message === "Unauthenticated") {
        window.location.assign("/login");
        return;
      }
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading || authUser === undefined}
        className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {authUser === undefined
          ? "Checking account..."
          : isLoading
            ? "Redirecting..."
            : "Book now"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CheckoutButton;
