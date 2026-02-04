import { createRouter, createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import Bookings from "./pages/Bookings";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";

const rootRoute = createRootRoute({
  component: () => <Layout />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const toursRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tours",
  component: Tours,
});

const tourDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tours/$slug",
  component: TourDetail,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: Signup,
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: Account,
});

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wishlist",
  component: Wishlist,
});

const bookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bookings",
  component: Bookings,
});

const compareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compare",
  component: Compare,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFound,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  toursRoute,
  tourDetailRoute,
  loginRoute,
  signupRoute,
  accountRoute,
  wishlistRoute,
  bookingsRoute,
  compareRoute,
  notFoundRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
