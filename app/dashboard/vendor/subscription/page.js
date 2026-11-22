"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/hooks";
import { Button, ErrorBox, Spinner } from "@/components/ui";

const PLANS = [
  { id: "free", name: "Free", price: "$0", features: ["Up to 3 active menu items", "Basic vendor dashboard", "Order management"] },
  { id: "premium", name: "Premium", price: "$19.99 / month", features: ["Unlimited active items", "Premium vendor badge", "Featured placement on the homepage", "Everything in Free"] },
];

export default function Subscription() {
  const { data: me, loading, error, reload } = useFetch("/api/me");
  const [busy, setBusy] = useState(false);
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const upgrade = async () => {
    setBusy(true);
    try { const { url } = await api("/api/payments/checkout", { method: "POST" }); window.location.href = url; }
    catch (e) { toast.error(e.message); setBusy(false); }
  };
  const cancel = async () => {
    try { const r = await api("/api/payments/cancel", { method: "POST" }); toast.success(r.message); } catch (e) { toast.error(e.message); }
  };
  return (
    <div><h1 className="text-3xl font-bold">Subscription</h1>
      <p className="mt-1 text-char/70">Current plan: <b className="capitalize">{me.subscriptionPlan}</b>{me.subscriptionExpiresAt && me.subscriptionPlan === "premium" && <> · renews or ends {new Date(me.subscriptionExpiresAt).toLocaleDateString()}</>}</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">{PLANS.map((p) => (
        <div key={p.id} className={`card p-6 ${me.subscriptionPlan === p.id ? "border-2 border-tomato" : ""}`}>
          <h2 className="text-xl font-bold">{p.name}</h2><p className="mt-1 text-2xl font-bold text-tomato">{p.price}</p>
          <ul className="mt-4 space-y-2 text-sm">{p.features.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 text-basil" />{f}</li>)}</ul>
          {p.id === "premium" && (me.subscriptionPlan === "premium" ? <Button variant="ghost" className="mt-5" onClick={cancel}>Cancel at period end</Button> : <Button className="mt-5" loading={busy} onClick={upgrade}>Upgrade to Premium</Button>)}
        </div>))}
      </div>
      <p className="mt-4 text-xs text-char/60">Premium turns on only after Stripe confirms the payment. Test card: 4242 4242 4242 4242.</p>
    </div>
  );
}
