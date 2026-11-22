import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Proxies uploads to ImgBB so the API key never reaches the browser.
export async function POST(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return Response.json({ message: "Please sign in to upload images" }, { status: 401 });
  const file = (await req.formData()).get("file");
  if (!file || typeof file === "string") return Response.json({ message: "No file received" }, { status: 400 });
  if (!file.type.startsWith("image/")) return Response.json({ message: "Only image files are allowed" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return Response.json({ message: "Image must be under 5 MB" }, { status: 400 });
  const body = new FormData();
  body.append("image", Buffer.from(await file.arrayBuffer()).toString("base64"));
  try {
    const r = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, { method: "POST", body });
    const j = await r.json();
    if (!r.ok || !j.success) throw new Error();
    return Response.json({ url: j.data.display_url });
  } catch {
    return Response.json({ message: "Image upload failed. Try again." }, { status: 502 });
  }
}
