import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Issues a 15-minute HS256 JWT for the signed-in user. The Express API re-checks role and blocked status in MongoDB.
export async function GET(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const token = jwt.sign({ sub: session.user.id }, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "15m" });
  return Response.json({ token });
}
