"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useDebounce, useFetch } from "@/lib/hooks";
import { Badge, Button, Empty, ErrorBox, Spinner } from "@/components/ui";

export default function ManageItems() {
  const [q, setQ] = useState(""), [status, setStatus] = useState("");
  const dq = useDebounce(q);
  const { data, loading, error, reload } = useFetch(`/api/admin/items?${new URLSearchParams({ q: dq, status })}`);
  const [confirm, setConfirm] = useState(null);
  const run = async (fn, ok) => { try { await fn(); toast.success(ok); } catch (e) { toast.error(e.message); } reload(); };
  const setS = (i, s) => run(() => api(`/api/admin/items/${i._id}/status`, { method: "PATCH", body: { status: s } }), `Item ${s}`);
  return (
    <div><h1 className="mb-6 text-3xl font-bold">Manage Menu Items</h1>
      <div className="mb-4 grid gap-3 sm:grid-cols-3"><input className="input sm:col-span-2" placeholder="Search by name or location" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search items" />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"><option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="inactive">Inactive</option></select></div>
      {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : !data.length ? <Empty title="No menu items">Nothing matches this filter.</Empty> : (
        <div className="grid gap-4">{data.map((i) => (
          <div key={i._id} className="card grid gap-4 p-4 md:grid-cols-[96px_1fr_auto] md:items-center">
            <img src={i.images?.[0]} alt="" className="h-24 w-24 rounded-xl object-cover" />
            <div className="space-y-1 text-sm"><div className="flex items-center gap-2"><h3 className="text-base font-bold">{i.itemName}</h3><Badge status={i.status} /></div>
              <p>{i.category} · ৳{i.price} · {i.location}</p><p className="text-char/70">By {i.vendor?.businessName || i.vendor?.name}</p><p className="line-clamp-2 text-char/70">{i.description}</p></div>
            <div className="flex flex-wrap gap-2">
              {i.status !== "approved" && <Button className="!px-3 !py-1.5" onClick={() => setS(i, "approved")}>Approve</Button>}
              {i.status !== "rejected" && <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => setS(i, "rejected")}>Reject</Button>}
              {i.status === "approved" && <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => setS(i, "inactive")}>Deactivate</Button>}
              {confirm === i._id ? <Button variant="dark" className="!px-3 !py-1.5" onClick={() => run(() => api(`/api/admin/items/${i._id}`, { method: "DELETE" }), "Item deleted")}>Confirm delete</Button>
                : <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => { setConfirm(i._id); setTimeout(() => setConfirm(null), 4000); }}>Delete</Button>}
            </div>
          </div>))}</div>)}
    </div>
  );
}
