import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME || "pizzahub");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL],
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  socialProviders: { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } },
  user: { additionalFields: {
    role: { type: "string", required: false, input: true },
    roleChosen: { type: "boolean", required: false, input: false },
    isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
    businessName: { type: "string", required: false, input: true },
    subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
    subscriptionExpiresAt: { type: "date", required: false, input: false },
  } },
  hooks: {
    // Server-side password rule: min 6 (above) + one uppercase + one lowercase.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const p = String(ctx.body?.password || "");
        if (!/[A-Z]/.test(p) || !/[a-z]/.test(p)) throw new APIError("BAD_REQUEST", { message: "Password needs one uppercase and one lowercase letter" });
      }
    }),
  },
  databaseHooks: { user: {
    // Public sign-up can only ever create vendors or customers. Admin is assigned via the make-admin script.
    create: { before: async (u) => {
      const chosen = ["vendor", "customer"].includes(u.role);
      return { data: { ...u, role: chosen ? u.role : "customer", roleChosen: chosen, isBlocked: false, subscriptionPlan: "free", subscriptionExpiresAt: null } };
    } },
    // Profile updates through Better Auth can never touch privileged fields.
    update: { before: async (u) => {
      const { role, roleChosen, isBlocked, subscriptionPlan, subscriptionExpiresAt, ...rest } = u;
      return { data: rest };
    } },
  } },
});
