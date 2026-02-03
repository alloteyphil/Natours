# Natours (Vite + Convex)

Modern rewrite of Natours using Vite + React + Tailwind v4 on the frontend, and Convex + Better Auth + Stripe on the backend.

## Stack

- Vite + React (TypeScript)
- Tailwind CSS v4
- Convex backend (queries, mutations, actions, http actions)
- Better Auth (email/password) with Convex component
- Stripe Checkout + webhooks

## Local setup

1. Install dependencies:
   - `npm install`
2. Start Convex and generate `_generated` files:
   - `npx convex dev`
3. Set Convex environment variables:
   - `npx convex env set SITE_URL http://localhost:5173`
   - `npx convex env set TRUSTED_ORIGINS http://localhost:5173`
   - `npx convex env set BETTER_AUTH_URL http://localhost:5173`
   - `npx convex env set BETTER_AUTH_SECRET <32+char-secret>`
   - `npx convex env set STRIPE_SECRET_KEY <stripe-secret>`
   - `npx convex env set STRIPE_WEBHOOK_SECRET <stripe-webhook-secret>`
4. Create a frontend env file at `.env.local`:
   - `VITE_CONVEX_URL=<convex-deployment-url>`
   - `VITE_STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>`
5. Start the frontend:
   - `npm run dev`

## Stripe webhooks (local)

- Run `stripe listen --forward-to https://<your-convex-deployment>.convex.site/stripe/webhook`
- Use the webhook secret printed by Stripe CLI for `STRIPE_WEBHOOK_SECRET`

## Deploy to Vercel (frontend only)

1. Create a new Vercel project from this repo.
2. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add frontend env vars in Vercel:
   - `VITE_CONVEX_URL`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
4. Update Convex env vars to the Vercel URL:
   - `SITE_URL=https://<your-vercel-domain>`
   - `TRUSTED_ORIGINS=https://<your-vercel-domain>`
   - `BETTER_AUTH_URL=https://<your-vercel-domain>`
5. Keep Stripe secrets in Convex env (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`).

## Folder overview

- `src/`: Vite React app
- `convex/`: Convex backend (schema, queries, mutations, actions)
- `public/`: Static assets
