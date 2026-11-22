"use client";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/hooks";
import { Avatar, Badge, Button, Empty, ErrorBox, Spinner } from "@/components/ui";

export default function VendorOrders() {
  const { data, loading, error, reload } = useFetch("/api/vendor/orders");
  const act = async (id, action) => {
    try { await api(`/api/vendor/orders/${id}`, { method: "PATCH", body: { action } }); toast.success(action === "accept" ? "Order accepted" : "Order rejected"); } catch (e) { toast.error(e.message); }
    reload();
  };
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <div><h1 className="mb-6 text-3xl font-bold">Customer Orders</h1>
      {!data.length ? <Empty title="No orders yet">Orders from customers will show up here.</Empty> : (
        <div className="grid gap-4">{data.map((o) => (
          <div key={o._id} className="card grid gap-4 p-5 md:grid-cols-[96px_1fr_auto] md:items-center">
            <img src={o.item?.images?.[0]} alt="" className="h-24 w-24 rounded-xl object-cover" />
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2"><h3 className="text-base font-bold">{o.item?.itemName || "Removed item"}</h3><Badge status={o.status} /></div>
              <p className="flex items-center gap-2"><Avatar user={o.customer} size={22} />{o.customer?.name} · {o.customer?.email}</p>
              <p>Deliver on <b>{o.deliveryDate}</b> to {o.deliveryAddress}</p>
              {o.message && <p className="text-char/70">“{o.message}”</p>}
            </div>
            {o.status === "pending" && <div className="flex gap-2"><Button onClick={() => act(o._id, "accept")}>Accept</Button><Button variant="ghost" onClick={() => act(o._id, "reject")}>Reject</Button></div>}
          </div>))}
        </div>)}
    </div>
  );
}
