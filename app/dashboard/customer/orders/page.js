"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/hooks";
import { Badge, Button, Empty, ErrorBox, Spinner } from "@/components/ui";

function Timeline({ o }) {
  const end = { accepted: ["Accepted by restaurant", "bg-basil"], rejected: ["Rejected by restaurant", "bg-red-600"], cancelled: ["Cancelled by you", "bg-char/50"] }[o.status];
  const steps = [["Order placed", o.createdAt, "bg-basil"], end ? [end[0], o.updatedAt, end[1]] : ["Waiting for the restaurant", null, "bg-amber-500"]];
  return (
    <ol className="mb-4 space-y-3 border-l-2 border-char/15 pl-5" aria-label="Order status timeline">
      {steps.map(([t, d, c]) => (
        <li key={t} className="relative"><span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ${c}`} /><p className="font-medium">{t}</p>{d && <p className="text-xs text-char/60">{new Date(d).toLocaleString()}</p>}</li>
      ))}
    </ol>
  );
}

export default function MyOrders() {
  const { data, loading, error, reload } = useFetch("/api/customer/orders");
  const [open, setOpen] = useState(null);
  const cancel = async (id) => {
    try { await api(`/api/customer/orders/${id}/cancel`, { method: "PATCH" }); toast.success("Order cancelled"); } catch (e) { toast.error(e.message); }
    reload();
  };
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <div><h1 className="mb-6 text-3xl font-bold">My Orders</h1>
      {!data.length ? <Empty title="No orders yet">Pick something from the menu to place your first order.</Empty> : (
        <div className="grid gap-4">{data.map((o) => (
          <div key={o._id} className="card p-5">
            <div className="grid gap-4 md:grid-cols-[96px_1fr_auto] md:items-center">
              <img src={o.item?.images?.[0]} alt="" className="h-24 w-24 rounded-xl object-cover" />
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2"><h3 className="text-base font-bold">{o.item?.itemName || "Removed item"}</h3><Badge status={o.status} /></div>
                <p>From {o.vendor?.businessName || o.vendor?.name}</p><p>Delivery: <b>{o.deliveryDate}</b> · {o.deliveryAddress}</p>
                <p className="text-char/60">Requested {new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2"><Button variant="ghost" onClick={() => setOpen(open === o._id ? null : o._id)}>Details</Button>{o.status === "pending" && <Button variant="dark" onClick={() => cancel(o._id)}>Cancel</Button>}</div>
            </div>
            {open === o._id && <div className="mt-4 rounded-xl bg-crust p-4 text-sm"><Timeline o={o} /><p>Price: ৳{o.item?.price}</p><p>Vendor contact: {o.vendor?.email}</p><p>Your note: {o.message || "None"}</p></div>}
          </div>))}
        </div>)}
    </div>
  );
}
