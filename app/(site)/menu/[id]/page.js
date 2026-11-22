"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { useFetch, useRequireAuth } from "@/lib/hooks";
import { Button, ErrorBox, Input, Spinner, Textarea } from "@/components/ui";

export default function ItemDetails({ params }) {
  const { id } = params;
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth(`/menu/${id}`);
  const { data: item, loading, error, reload } = useFetch(user ? `/api/menu/${id}` : null, { auth: false });
  const [img, setImg] = useState(0);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ deliveryDate: "", deliveryAddress: "", message: "" });

  if (authLoading || loading) return <Spinner />;
  if (error) return <div className="container-x py-16"><ErrorBox message={error} onRetry={reload} /></div>;

  const order = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/customer/orders", { method: "POST", body: { ...form, itemId: id } });
      toast.success("Order placed! The restaurant will confirm shortly.");
      router.push("/dashboard/customer/orders");
    } catch (err) { toast.error(err.message); }
    setBusy(false);
  };
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="container-x grid gap-10 py-10 lg:grid-cols-2">
      <div>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-char/5"><img src={item.images[img]} alt={item.itemName} className="h-full w-full object-cover" /></div>
        {item.images.length > 1 && <div className="mt-3 flex gap-3">{item.images.map((u, i) => (
          <button key={u} onClick={() => setImg(i)} className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${i === img ? "border-tomato" : "border-transparent"}`}><img src={u} alt="" className="h-full w-full object-cover" /></button>
        ))}</div>}
      </div>
      <div>
        <p className="text-sm font-medium text-basil">{item.category}</p>
        <h1 className="mt-1 text-4xl font-bold">{item.itemName}</h1>
        <p className="mt-2 flex items-center gap-1 text-char/70"><MapPin size={16} />{item.location}</p>
        <p className="mt-4 text-3xl font-bold text-tomato">৳{item.price}</p>
        <p className="mt-4 max-w-prose leading-relaxed text-char/80">{item.description}</p>
        <div className="card mt-6 flex items-center gap-3 p-4">
          {item.vendor.image && <img src={item.vendor.image} alt="" className="h-11 w-11 rounded-full object-cover" />}
          <div><p className="font-semibold">{item.vendor.businessName || item.vendor.name}</p><p className="text-sm text-char/70">{item.vendor.premium ? "Premium restaurant" : "Restaurant"}</p></div>
        </div>
        <div className="mt-6">
          {user.role !== "customer" ? <p className="rounded-xl bg-white p-4 text-sm text-char/70">Only customer accounts can place orders.</p>
            : !open ? <Button onClick={() => setOpen(true)}>Order this item</Button> : (
              <form onSubmit={order} className="card space-y-4 p-5">
                <Input label="Delivery date" type="date" min={today} value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} required />
                <Input label="Delivery address" value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} minLength={8} required />
                <Textarea label="Special instructions (optional)" maxLength={500} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <div className="flex gap-3"><Button type="submit" loading={busy}>Place order</Button><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button></div>
              </form>)}
        </div>
      </div>
    </div>
  );
}
