"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";
import { authClient } from "./auth-client";

export function useFetch(path, opts) {
  const [s, set] = useState({ data: null, loading: !!path, error: null });
  const load = useCallback(async () => {
    if (!path) return;
    set((x) => ({ ...x, loading: true, error: null }));
    try { set({ data: await api(path, opts), loading: false, error: null }); }
    catch (e) { set({ data: null, loading: false, error: e.message }); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  useEffect(() => { load(); }, [load]);
  return { ...s, reload: load };
}

export function useRequireAuth(next) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  useEffect(() => { if (!isPending && !data) router.replace(`/signin?next=${encodeURIComponent(next || "/")}`); }, [isPending, data, router, next]);
  return { user: data?.user, loading: isPending || !data };
}

export function useDebounce(v, ms = 350) {
  const [d, setD] = useState(v);
  useEffect(() => { const t = setTimeout(() => setD(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return d;
}

// Shared favorites store so every card on a page uses a single request.
let favCache = null;
const favSubs = new Set();
export const resetFavorites = () => { favCache = null; favSubs.forEach((f) => f([])); };
export function useFavorites(enabled) {
  const [ids, setIds] = useState(favCache || []);
  useEffect(() => {
    if (!enabled) return;
    favSubs.add(setIds);
    if (favCache) setIds(favCache);
    else {
      favCache = [];
      api("/api/customer/favorite-ids").then((v) => { favCache = v; favSubs.forEach((f) => f(v)); }).catch(() => { favCache = null; });
    }
    return () => favSubs.delete(setIds);
  }, [enabled]);
  const toggle = async (id) => {
    const r = await api(`/api/customer/favorites/${id}`, { method: "POST" });
    favCache = r.favorite ? [...(favCache || []), id] : (favCache || []).filter((x) => x !== id);
    favSubs.forEach((f) => f(favCache));
    return r.favorite;
  };
  return { ids, toggle };
}
