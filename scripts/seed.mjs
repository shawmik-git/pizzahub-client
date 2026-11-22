// Demo data: node --env-file=.env scripts/seed.mjs   (or: npm run seed)
// Creates an admin, two vendors, two customers, approved menu items, sample orders and a paid transaction.
// Safe to re-run: existing accounts are reused and demo items are only inserted once.
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.DB_NAME || "pizzahub");
const auth = betterAuth({
  database: mongodbAdapter(db), baseURL: process.env.BETTER_AUTH_URL, secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  user: { additionalFields: { role: { type: "string", required: false, input: true } } },
});

const PASSWORD = "Demo1234";
const people = [
  { name: "PizzaHub Admin", email: "admin@pizzahub.demo", role: "admin" },
  { name: "Marco Rossi", email: "napoli@pizzahub.demo", role: "vendor", businessName: "Napoli Oven", premium: true },
  { name: "Sara Khan", email: "crust@pizzahub.demo", role: "vendor", businessName: "Crust & Co", premium: false },
  { name: "Rafi Ahmed", email: "customer@pizzahub.demo", role: "customer" },
  { name: "Nila Das", email: "nila@pizzahub.demo", role: "customer" },
];
const users = {};
for (const p of people) {
  if (!(await db.collection("user").findOne({ email: p.email }))) {
    try { await auth.api.signUpEmail({ body: { name: p.name, email: p.email, password: PASSWORD } }); } catch (e) { console.error("signup failed", p.email, e.message); continue; }
  }
  const set = { role: p.role, roleChosen: true, isBlocked: false };
  if (p.businessName) set.businessName = p.businessName;
  if (p.role === "vendor") { set.subscriptionPlan = p.premium ? "premium" : "free"; set.subscriptionExpiresAt = p.premium ? new Date(Date.now() + 30 * 864e5) : null; }
  await db.collection("user").updateOne({ email: p.email }, { $set: set });
  users[p.email] = await db.collection("user").findOne({ email: p.email });
}

const img = () => "/pizza.svg";
const P = { margherita: img("photo-1574071318508-1cdbab80d002"), pepperoni: img("photo-1513104890138-7c749659a591"), veg: img("photo-1565299624946-b28f40a0ae38"), meat: img("photo-1604382354936-07c5d9983bd3"), gourmet: img("photo-1571407970349-bc81e7e96d47"), side: img("photo-1573140247632-f8fd74997d5c"), drink: img("photo-1544145945-f90425340c7e") };
const napoli = users["napoli@pizzahub.demo"], crust = users["crust@pizzahub.demo"];
const items = [
  [napoli, "Margherita Classica", "Classic Pizzas", "San Marzano tomato, fior di latte and basil on a 48-hour dough.", 650, "Dhanmondi, Dhaka", P.margherita, "approved"],
  [napoli, "Pepperoni Fire", "Classic Pizzas", "Double pepperoni, mozzarella and a drizzle of hot honey.", 820, "Dhanmondi, Dhaka", P.pepperoni, "approved"],
  [napoli, "Garden Harvest", "Vegetarian Pizzas", "Roasted peppers, mushrooms, olives and fresh rocket.", 740, "Gulshan, Dhaka", P.veg, "approved"],
  [napoli, "Carnivore Supreme", "Meat Lovers", "Sausage, bacon, beef and pepperoni on smoky tomato sauce.", 990, "Gulshan, Dhaka", P.meat, "approved"],
  [napoli, "Truffle Burrata", "Specialty / Gourmet Pizzas", "Burrata, truffle cream, wild mushrooms and parmesan.", 1250, "Banani, Dhaka", P.gourmet, "approved"],
  [napoli, "Garlic Knots", "Sides & Appetizers", "Six warm knots with garlic butter and marinara.", 280, "Dhanmondi, Dhaka", P.side, "approved"],
  [crust, "BBQ Chicken", "Meat Lovers", "Grilled chicken, red onion and smoky barbecue sauce.", 780, "Jashore Sadar", P.meat, "approved"],
  [crust, "Veggie Supreme", "Vegetarian Pizzas", "Sweetcorn, capsicum, onion and a three-cheese blend.", 590, "Jashore Sadar", P.veg, "approved"],
  [crust, "Iced Lemon Mint", "Beverages & Desserts", "Fresh lemon, mint and sparkling water over ice.", 120, "Jashore Sadar", P.drink, "approved"],
  [crust, "Four Cheese Pending", "Specialty / Gourmet Pizzas", "Mozzarella, cheddar, gorgonzola and parmesan. Awaiting review.", 880, "Jashore Sadar", P.gourmet, "pending"],
];
const ids = {};
for (const [v, itemName, category, description, price, location, image, status] of items) {
  const exists = await db.collection("menuItems").findOne({ vendorId: v._id, itemName });
  if (exists) { ids[itemName] = exists._id; continue; }
  const r = await db.collection("menuItems").insertOne({ vendorId: v._id, itemName, category, description, price, location, images: [image], status, createdAt: new Date() });
  ids[itemName] = r.insertedId;
}

const cust = users["customer@pizzahub.demo"];
if (!(await db.collection("orders").findOne({ customerId: cust._id }))) {
  const day = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  await db.collection("orders").insertMany([
    { itemId: ids["Pepperoni Fire"], vendorId: napoli._id, customerId: cust._id, deliveryDate: day(2), deliveryAddress: "House 12, Road 5, Dhanmondi, Dhaka", message: "Extra chili flakes please", status: "pending", createdAt: new Date() },
    { itemId: ids["BBQ Chicken"], vendorId: crust._id, customerId: cust._id, deliveryDate: day(3), deliveryAddress: "Church Road, Jashore", message: "", status: "accepted", createdAt: new Date(Date.now() - 36e5), updatedAt: new Date() },
  ]);
}
if (!(await db.collection("transactions").findOne({ vendorId: napoli._id }))) {
  await db.collection("transactions").insertOne({ vendorId: napoli._id, plan: "premium", amount: 19.99, currency: "usd", stripeSessionId: "cs_demo_seed_1", stripeSubscriptionId: "sub_demo_seed_1", status: "paid", createdAt: new Date() });
}
console.log(`Seed complete. Demo logins (password ${PASSWORD}):\n  admin@pizzahub.demo\n  napoli@pizzahub.demo (Premium vendor)\n  crust@pizzahub.demo (Free vendor)\n  customer@pizzahub.demo\n  nila@pizzahub.demo`);
await client.close();
