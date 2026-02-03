import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { stripeWebhook } from "./stripe";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth, { cors: true });

http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: stripeWebhook,
});

export default http;
