// Calls the Express API with a short-lived JWT issued for the signed-in Better Auth session.
let cache = { t: null, exp: 0 };
export const resetToken = () => { cache = { t: null, exp: 0 }; };

async function getToken() {
  if (cache.t && Date.now() < cache.exp) return cache.t;
  const r = await fetch("/api/token");
  if (!r.ok) return null;
  const { token } = await r.json();
  cache = { t: token, exp: Date.now() + 10 * 60 * 1000 };
  return token;
}

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) { const t = await getToken(); if (t) headers.Authorization = `Bearer ${t}`; }
  let res;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error("Can't reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || "Request failed"), { status: res.status, code: data.code });
  return data;
}

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Image upload failed");
  return data.url;
}
