"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/hooks";
import { Button, Input, Select, Spinner } from "@/components/ui";

// Landing page after any sign-in. Sends users to their dashboard; first-time Google users pick a role here.
export default function Complete() {
  const router = useRouter();
  const { user, loading } = useRequireAuth("/auth/complete");
  const [role, setRole] = useState("customer");
  const [businessName, setBN] = useState("");
  const [busy, setBusy] = useState(false);
  const needsRole = user && !user.roleChosen;

  useEffect(() => { if (user && user.roleChosen) router.replace(`/dashboard/${user.role}`); }, [user, router]);
  if (loading || !needsRole) return <Spinner />;

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/me/role", { method: "POST", body: { role, businessName } });
      window.location.href = `/dashboard/${role}`; // full reload refreshes the session
    } catch (err) { toast.error(err.message); setBusy(false); }
  };
  return (
    <div className="container-x grid place-items-center py-16"><form onSubmit={save} className="card w-full max-w-md space-y-4 p-8">
      <h1 className="text-3xl font-bold">One last step</h1><p className="text-sm text-char/70">How will you use PizzaHub?</p>
      <Select label="Account type" value={role} onChange={(e) => setRole(e.target.value)}><option value="customer">Customer</option><option value="vendor">Vendor (Restaurant Owner)</option></Select>
      {role === "vendor" && <Input label="Restaurant name" value={businessName} onChange={(e) => setBN(e.target.value)} required />}
      <Button type="submit" loading={busy} className="w-full">Continue</Button>
    </form></div>
  );
}
