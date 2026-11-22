"use client";
import Link from "next/link";
import { useRequireAuth } from "@/lib/hooks";
import { Spinner } from "@/components/ui";

export default function Cancel() {
  const { loading } = useRequireAuth("/payment/cancel");
  if (loading) return <Spinner />;
  return (
    <div className="container-x grid min-h-[50vh] place-items-center py-16 text-center"><div className="card max-w-md p-10">
      <h1 className="text-3xl font-bold">Payment cancelled</h1><p className="mt-2 text-char/70">You haven't been charged. You can upgrade whenever you're ready.</p>
      <Link href="/dashboard/vendor/subscription" className="btn btn-primary mt-6">Back to Subscription</Link></div></div>
  );
}
