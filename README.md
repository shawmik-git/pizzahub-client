# PizzaHub — Pizza Ordering & Delivery Platform (Client)

PizzaHub is a role-based pizza ordering platform. Customers discover local pizza shops, browse menus and place orders. Vendors (restaurants) publish menu items, manage incoming orders and can upgrade to a Premium subscription. Admins manage users, review published menu items and monitor platform transactions.

This repository is the **Next.js client**. The Express API lives in the server repository.

## Links
- **Live site:** https://pizzahub-client-orpin.vercel.app
- **Client repository:** https://github.com/shawmik-git/pizzahub-client
- **Server repository:** https://github.com/shawmik-git/pizzahub-server
- **Live API:** https://pizzahub-server-lilac.vercel.app

## Test accounts
| Role | Email | Password |
|---|---|---|
| Admin | `admin@pizzahub.demo` | `Demo1234` |
| Vendor (Premium) | `napoli@pizzahub.demo` | `Demo1234` |
| Vendor (Free) | `crust@pizzahub.demo` | `Demo1234` |
| Customer | `customer@pizzahub.demo` | `Demo1234` |
| Customer | `nila@pizzahub.demo` | `Demo1234` |

These are demo-only accounts on a demo database. Stripe test card: `4242 4242 4242 4242`, any future expiry date, any CVC, any postal code.

## Important features
- **Authentication with Better Auth:** email and password plus Google sign-in. The role (Vendor or Customer) is chosen at sign-up. Admin accounts cannot be created publicly and are assigned securely through a server script.
- **Password rules:** minimum 6 characters, at least one uppercase and one lowercase letter, enforced on the server.
- **Home page:** hero banner, featured menu items (approved and active only), six pizza categories, "Why Choose PizzaHub?", "How PizzaHub Works" and Framer Motion animations.
- **Browse Menu (public):** search by name, filters by category and location, price range, sorting by price (ascending and descending), pagination, loading and empty states.
- **Item details (private):** image gallery, vendor info and an order form (delivery date, address, special instructions). Vendors cannot order their own items, admins cannot place orders, and invalid item IDs show an error.
- **Vendor dashboard:** overview, My Menu Items (create, read, update, delete, availability), ImgBB image upload, customer orders (accept or reject pending orders once), subscription page. The free plan allows 3 active items, Premium is unlimited.
- **Customer dashboard:** overview, My Orders with details, cancel pending orders, favorites.
- **Admin dashboard:** overview, Manage Users (search, role filter, block and unblock), Manage Menu Items (approve, reject, change status, delete), read-only Transactions.
- **Payments:** Stripe Checkout for vendor subscriptions. Premium is activated **only** after a verified Stripe webhook event, never from the frontend redirect.
- **Route protection:** dashboards are role-protected on the client, and every protected API verifies the role again on the server.
- **UX:** toast notifications (no `alert()`), loading states, custom 404 and error pages, fully responsive layout.
- **Optional extras implemented:** dark and light mode toggle, order status timeline on order details, favorites for customers.

## Tech stack (npm packages)
- **Framework:** `next` (App Router), `react`, `react-dom`
- **UI:** `tailwindcss`, ShadCN UI components (`radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`), `lucide-react`, `framer-motion`, `recharts`, `react-hot-toast`
- **Auth and data:** `better-auth`, `mongodb`, `jsonwebtoken`
- **Services:** MongoDB Atlas, Stripe Checkout and webhooks, Google OAuth, ImgBB image hosting

## Installation and running locally
Requires Node.js 20.6 or newer.

```bash
git clone https://github.com/shawmik-git/pizzahub-client.git
cd pizzahub-client
npm install
```

Create the environment file and fill in the values:

```bash
# macOS / Linux
cp .env.example .env

# Windows (CMD)
copy .env.example .env
```

Then start the development server:

```bash
npm run dev
```

The app runs at http://localhost:3000. Start the server repository as well (see its README). To load demo data (admin, vendors, customers, menu items, sample orders and a transaction), run:

```bash
npm run seed
```

## Environment variables
| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Express API, no trailing slash |
| `BETTER_AUTH_URL` | Public URL of this client, no trailing slash |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth |
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name (`pizzahub`) |
| `JWT_SECRET` | Must be identical to the server's `JWT_SECRET` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `IMGBB_API_KEY` | ImgBB API key (used only server-side through `/api/upload`) |

`.env` files are git-ignored and are never committed. `.env.example` lists every name with empty values.

## Database
Better Auth manages its own `user`, `account`, `session` and `verification` collections. The business collections are `menuItems`, `orders` and `transactions`, with references by `vendorId`, `customerId` and `itemId`. Favorites are stored on the user document, so no extra collection is needed.

## Challenge implementation notes
1. **Advanced search and sorting.** The client calls `GET /api/menu?q=&category=&location=&minPrice=&maxPrice=&sort=price_asc|price_desc|newest&page=&limit=`. The server runs one MongoDB aggregation: `$match` (approved and active items, regex-escaped search over name, description and location, category, location, price range) then `$lookup` for the vendor (blocked vendors are skipped) then `$facet` with `$sort`, `$skip`, `$limit` and a total count.
2. **JWT verification.** After sign-in the client calls `/api/token`, which signs a short-lived (15 minute) HS256 JWT for the Better Auth session. Every private API call sends `Authorization: Bearer <token>`. The Express middleware verifies the signature and expiry (401 on failure), loads the user from MongoDB (blocked users get 403), and a `role(...)` middleware returns 403 for the wrong role. Roles are never read from the token or from the request body.
3. **Overall appearance.** Warm pizza palette (reds, oranges, cream), consistent headings, buttons and cards, equal-height menu cards, and a responsive dashboard with stat cards and charts.

## Deployment notes
- Deploy the client and the server as two Vercel projects and set every environment variable on both.
- `BETTER_AUTH_URL` must equal the live client URL, and the server's `CLIENT_URL` must be the same URL (CORS).
- Google OAuth redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google`.
- Stripe webhook endpoint: `<server-url>/api/payments/webhook`. Handled events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`, `checkout.session.expired`.

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run seed` | Load demo data into MongoDB |
