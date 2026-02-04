import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "./lib/auth-client";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/ToastContainer";
import { router } from "./router";
import "./index.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
if (!convexUrl) {
  throw new Error("Missing VITE_CONVEX_URL environment variable");
}

const convex = new ConvexReactClient(convexUrl);

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <ErrorBoundary>
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ConvexBetterAuthProvider>
  </ErrorBoundary>
);
