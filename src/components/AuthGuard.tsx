import type { ReactNode } from "react";
import { AuthBoundary } from "@convex-dev/better-auth/react";
import { api } from "../../convex/_generated/api";
import { authClient } from "../lib/auth-client";

type AuthGuardProps = {
  children: ReactNode;
};

const isAuthError = (error: unknown) =>
  error instanceof Error && error.message === "Unauthenticated";

const AuthGuard = ({ children }: AuthGuardProps) => {
  return (
    <AuthBoundary
      authClient={authClient}
      onUnauth={() => window.location.assign("/login")}
      getAuthUserFn={api.auth.getCurrentUser}
      isAuthError={isAuthError}
    >
      {children}
    </AuthBoundary>
  );
};

export default AuthGuard;
