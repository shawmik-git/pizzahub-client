"use client";
import { useFetch } from "@/lib/hooks";
import { Badge, Empty, ErrorBox, Spinner } from "@/components/ui";

export default function Transactions() {
  const { data, loading, error, reload } = useFetch("/api/admin/transactions");
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <div><h1 className="mb-6 text-3xl font-bold">Transactions</h1>
      {!data.length ? <Empty title="No transactions yet">Premium subscription payments will be listed here (read-only).</Empty> : (
        <div className="card overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-char/10 text-char/60"><tr><th className="p-3">Vendor</th><th className="p-3">Plan</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Date</th></tr></thead>
          <tbody>{data.map((t) => (<tr key={t._id} className="border-b border-char/5">
            <td className="p-3"><p className="font-semibold">{t.vendor?.businessName || t.vendor?.name}</p><p className="text-xs text-char/60">{t.vendor?.email}</p></td>
            <td className="p-3 capitalize">{t.plan}</td><td className="p-3">{(t.currency || "usd").toUpperCase()} {t.amount}</td><td className="p-3"><Badge status={t.status} /></td><td className="p-3">{new Date(t.createdAt).toLocaleString()}</td></tr>))}</tbody></table></div>)}
    </div>
  );
}
