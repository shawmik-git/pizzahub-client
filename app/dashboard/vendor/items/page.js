"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/hooks";
import ItemForm from "@/components/ItemForm";
import { Badge, Button, Empty, ErrorBox, Spinner } from "@/components/ui";

export default function MyItems() {
  const { data, loading, error, reload } = useFetch("/api/vendor/items");
  const [edit, setEdit] = useState(null);
  const [view, setView] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const run = async (fn, ok) => { try { await fn(); toast.success(ok); reload(); } catch (e) { toast.error(e.message); } };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <div>
      <div className="mb-6 flex items-center justify-between"><h1 className="text-3xl font-bold">My Menu Items</h1><Link href="/dashboard/vendor/items/new" className="btn btn-primary">Add item</Link></div>
      {!data.length ? <Empty title="No menu items yet">Add your first pizza. It goes live after admin approval.</Empty> : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.map((i) => (
            <div key={i._id} className="card flex flex-col overflow-hidden">
              <img src={i.images[0]} alt={i.itemName} className="aspect-[4/3] w-full object-cover" />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2"><h3 className="font-bold">{i.itemName}</h3><Badge status={i.status} /></div>
                <p className="text-sm text-char/70">{i.category} · ৳{i.price} · {i.location}</p>
                {view === i._id && <p className="text-sm">{i.description}</p>}
                {i.status === "rejected" && <p className="text-xs text-red-700">Rejected by admin. Edit and resubmit for another review.</p>}
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => setView(view === i._id ? null : i._id)}>{view === i._id ? "Hide" : "Details"}</Button>
                  <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => setEdit(i)}>Edit</Button>
                  {i.status === "approved" && <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => run(() => api(`/api/vendor/items/${i._id}/availability`, { method: "PATCH", body: { active: false } }), "Item paused")}>Pause</Button>}
                  {i.status === "inactive" && i.inactiveBy === "vendor" && <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => run(() => api(`/api/vendor/items/${i._id}/availability`, { method: "PATCH", body: { active: true } }), "Item resumed")}>Resume</Button>}
                  {confirm === i._id
                    ? <Button variant="dark" className="!px-3 !py-1.5" onClick={() => run(() => api(`/api/vendor/items/${i._id}`, { method: "DELETE" }), "Item deleted")}>Confirm delete</Button>
                    : <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => { setConfirm(i._id); setTimeout(() => setConfirm(null), 4000); }}>Delete</Button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {edit && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-char/60 p-4" role="dialog" aria-modal="true">
          <div className="card my-8 w-full max-w-xl p-6">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Edit item</h2><button onClick={() => setEdit(null)} className="text-sm underline">Close</button></div>
            <p className="mb-4 text-xs text-char/60">Saved changes go back to admin review.</p>
            <ItemForm initial={edit} submitLabel="Save changes" onSubmit={async (v) => { await api(`/api/vendor/items/${edit._id}`, { method: "PATCH", body: v }); toast.success("Saved. Sent for review."); setEdit(null); reload(); }} />
          </div>
        </div>
      )}
    </div>
  );
}
