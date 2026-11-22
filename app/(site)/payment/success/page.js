"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/hooks";
import { Spinner } from "@/components/ui";

// This page only DISPLAYS the result. Premium is activated by the verified Stripe webhook on the server.
function Success() {
  const sid = useSearchParams().get("session_id");
  const { loading } = useRequireAuth(`/payment/success?session_id=${sid || ""}`);
  const [state, setState] = useState({ status: "checking", tries: 0 });

  useEffect(() => {
    if (loading || !sid) return;
    let stop = false, tries = 0;
    const tick = async () => {
      try { const r = await api(`/api/payments/session/${sid}`); if (r.status === "paid") return !stop && setState({ status: "paid" }); if (r.status !== "pending") return !stop && setState({ status: r.status }); } catch {}
      if (++tries >= 15) return !stop && setState({ status: "timeout" });
      setTimeout(tick, 2000);
    };
    tick();
    return () => { stop = true; };
  }, [loading, sid]);

  if (loading) return <Spinner />;
  const msg = { checking: ["Confirming your payment…", "This usually takes a few seconds."], paid: ["You're Premium!", "Payment confirmed. Unlimited menu items and your Premium badge are now active."],
    timeout: ["Still processing", "Stripe hasn't confirmed the payment yet. Premium turns on automatically once it does. Check your subscription page shortly."],
    failed: ["Payment failed", "No charge was made and your plan hasn't changed."], expired: ["Checkout expired", "Start the upgrade again from the Subscription page."] }[state.status] || ["Payment status", ""];
  return (
    <div className="container-x grid min-h-[50vh] place-items-center py-16 text-center"><div className="card max-w-md p-10">
      {state.status === "checking" && <Spinner label="" />}<h1 className="text-3xl font-bold">{msg[0]}</h1><p className="mt-2 text-char/70">{msg[1]}</p>
      <Link href="/dashboard/vendor/subscription" className="btn btn-primary mt-6">Go to Subscription</Link></div></div>
  );
}
export default function Page() { return <Suspense fallback={<Spinner />}><Success /></Suspense>; }
