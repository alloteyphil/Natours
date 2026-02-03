import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "./lib/auth-client";
import App from "./App";
import "./index.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
if (!convexUrl) {
  throw new Error("Missing VITE_CONVEX_URL environment variable");
}

const convex = new ConvexReactClient(convexUrl, { expectAuth: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConvexBetterAuthProvider>
  </React.StrictMode>
);
