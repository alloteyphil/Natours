import { createAuthClient } from "better-auth/react";
import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;

if (!convexUrl) {
  throw new Error("Missing VITE_CONVEX_URL environment variable");
}

// Use Convex site URL for auth endpoints, fallback to localhost for dev
const baseURL = convexSiteUrl || "http://localhost:5173";

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    convexClient({
      convexUrl,
    }),
    crossDomainClient(),
  ],
});
