# PizzaHub — Pizza Ordering & Delivery Platform (Client)

PizzaHub lets customers discover local pizza shops, browse menus and place orders. Vendors (restaurants) publish menu items and manage orders, and admins review menu items, manage users and monitor subscription transactions.

- **Live site:** `https://<your-client>.vercel.app`
- **Client repo:** `https://github.com/<you>/pizzahub-client`
- **Server repo:** `https://github.com/<you>/pizzahub-server`

## Important features
- Role-based app (Customer / Vendor / Admin) with Better Auth: email + password and Google sign-in, role chosen at sign-up, admin assigned securely via script
- Home page with featured items, categories, "Why Choose PizzaHub?", "How PizzaHub Works" and Framer Motion animation
- Browse menu: search, category/location filters, price range, sorting by price, pagination, loading and empty states
- Item details with image gallery and order form (delivery date, address, note); duplicate-order, self-order and role checks enforced on the server
- Vendor dashboard: add/edit/pause/delete items (ImgBB uploads), accept/reject orders, free plan limit of 3 active items, Stripe subscription
- Customer dashboard: order tracking and cancelling pending orders
- Admin dashboard: user search/filter/block, item review (approve/reject/deactivate/delete), read-only transactions
- Premium activated **only** by a verified Stripe webhook
- Optional extras: **dark/light mode toggle**, **order status timeline** on customer order details, **favorites/wishlist** (stored on the user document, no extra collection)
- Dashboards with stat cards and charts, toasts (no `alert()`), custom 404 and error pages

## Tech stack (npm packages)
`next` (App Router), `react`, `tailwindcss` (shadcn-style primitives in `components/ui.js`), `framer-motion`, `better-auth`, `mongodb`, `jsonwebtoken`, `react-hot-toast`, `recharts`, `lucide-react`, `clsx`

## Installation & running locally
```bash
git clone <client-repo-url> && cd pizzahub-client
npm install
cp .env.example .env     # fill in the values
npm run dev              # http://localhost:3000
```
Start the server repo too (see its README).

## Environment variables
`NEXT_PUBLIC_API_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `MONGODB_URI`, `DB_NAME`, `JWT_SECRET` (same as server), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `IMGBB_API_KEY`

Never commit `.env`. ImgBB uploads go through `/api/upload`, so the key never reaches the browser.

## Demo data and admin account
Admins cannot sign up publicly. After filling `.env`, load demo data (admin, 2 vendors, 2 customers, 10 menu items, sample orders and a transaction):
```bash
npm run seed
```
Demo logins (password `Demo1234`): `admin@pizzahub.demo`, `napoli@pizzahub.demo` (Premium vendor), `crust@pizzahub.demo` (Free vendor), `customer@pizzahub.demo`, `nila@pizzahub.demo`. Change the admin password before submitting. To promote any other account, run `npm run make-admin -- you@example.com` in the **server** repo.

## Challenge implementation notes
1. **Advanced search and sorting** — `GET /api/menu?q=&category=&location=&minPrice=&maxPrice=&sort=price_asc|price_desc|newest&page=&limit=`. The server builds a MongoDB aggregation: `$match` (approved items; regex-escaped text search over name, description and location; category; location; price range) → `$lookup` vendor (skips blocked vendors) → `$facet` with `$sort`, `$skip`, `$limit` and a total count.
2. **JWT verification** — after sign-in the client calls `/api/token`, which signs a 15-minute HS256 JWT for the Better Auth session. Every private API call sends `Authorization: Bearer <token>`. Express middleware `auth` verifies the signature and expiry (401 on failure), loads the user from MongoDB (blocked users get 403), and `role(...)` middleware returns 403 for the wrong role. Roles are never read from the token or request body.
3. **Appearance** — warm pizza palette, one display and one body typeface, consistent button/card styles, equal-height cards and a responsive dashboard.

## Deployment notes
- Set every env var on Vercel for both projects. `BETTER_AUTH_URL` must be the live client URL; the server's `CLIENT_URL` must match it (CORS).
- Google OAuth redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google`.
- Stripe webhook endpoint: `<server-url>/api/payments/webhook` with events `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`, `checkout.session.expired`, `checkout.session.async_payment_failed`.
- Test card: `4242 4242 4242 4242`, any future date, any CVC.
