"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce, useFetch } from "@/lib/hooks";
import { CATEGORIES } from "@/lib/constants";
import ItemCard from "@/components/ItemCard";
import { Button, Empty, ErrorBox, Spinner } from "@/components/ui";

function Browse() {
  const params = useSearchParams();
  const [f, setF] = useState({ q: "", category: params.get("category") || "", location: "", sort: "newest", minPrice: "", maxPrice: "" });
  const [page, setPage] = useState(1);
  const q = useDebounce(f.q);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setPage(1); };
  useEffect(() => { setF((x) => ({ ...x, category: params.get("category") || "" })); }, [params]);

  const qs = new URLSearchParams({ ...f, q, page, limit: 9 });
  [...qs.keys()].forEach((k) => !qs.get(k) && qs.delete(k));
  const { data, loading, error, reload } = useFetch(`/api/menu?${qs}`, { auth: false });
  const { data: locations } = useFetch("/api/locations", { auth: false });
  const pages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="container-x py-10">
      <h1 className="h-section">Browse Menu</h1>
      <div className="card mt-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative lg:col-span-2"><Search size={16} className="absolute left-3 top-3.5 text-char/50" />
          <input className="input pl-9" placeholder="Search pizzas, areas…" value={f.q} onChange={set("q")} aria-label="Search" /></div>
        <select className="input" value={f.category} onChange={set("category")} aria-label="Category"><option value="">All categories</option>{CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}</select>
        <select className="input" value={f.location} onChange={set("location")} aria-label="Location"><option value="">All locations</option>{(locations || []).map((l) => <option key={l}>{l}</option>)}</select>
        <select className="input" value={f.sort} onChange={set("sort")} aria-label="Sort"><option value="newest">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select>
        <div className="flex gap-2"><input className="input" type="number" min="0" placeholder="Min ৳" value={f.minPrice} onChange={set("minPrice")} aria-label="Minimum price" /><input className="input" type="number" min="0" placeholder="Max ৳" value={f.maxPrice} onChange={set("maxPrice")} aria-label="Maximum price" /></div>
      </div>
      <div className="mt-8">
        {loading ? <Spinner label="Loading menu…" /> : error ? <ErrorBox message={error} onRetry={reload} /> : data.items.length === 0 ? (
          <Empty title="Nothing matches those filters">Try a different search, category or location.</Empty>
        ) : (<>
          <p className="mb-4 text-sm text-char/70">{data.total} item{data.total === 1 ? "" : "s"}</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((i) => <ItemCard key={i._id} item={i} />)}</div>
          {pages > 1 && <div className="mt-8 flex items-center justify-center gap-4"><Button variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><span className="text-sm">Page {page} of {pages}</span><Button variant="ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</Button></div>}
        </>)}
      </div>
    </div>
  );
}
export default function MenuPage() { return <Suspense fallback={<Spinner />}><Browse /></Suspense>; }
