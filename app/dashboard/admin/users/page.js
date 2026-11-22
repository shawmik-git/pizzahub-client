"use client";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useDebounce, useFetch } from "@/lib/hooks";
import { Avatar, Badge, Button, Empty, ErrorBox, Spinner } from "@/components/ui";

export default function ManageUsers() {
  const [q, setQ] = useState(""), [role, setRole] = useState("");
  const dq = useDebounce(q);
  const { data, loading, error, reload } = useFetch(`/api/admin/users?${new URLSearchParams({ q: dq, role })}`);
  const [sel, setSel] = useState(null);
  const block = async (u) => {
    try { await api(`/api/admin/users/${u._id}/block`, { method: "PATCH", body: { blocked: !u.isBlocked } }); toast.success(u.isBlocked ? "User unblocked" : "User blocked"); } catch (e) { toast.error(e.message); }
    reload();
  };
  return (
    <div><h1 className="mb-6 text-3xl font-bold">Manage Users</h1>
      <div className="mb-4 grid gap-3 sm:grid-cols-3"><input className="input sm:col-span-2" placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search users" />
        <select className="input" value={role} onChange={(e) => setRole(e.target.value)} aria-label="Role"><option value="">All roles</option><option value="vendor">Vendors</option><option value="customer">Customers</option><option value="admin">Admins</option></select></div>
      {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : !data.length ? <Empty title="No users found">Try another search.</Empty> : (
        <div className="card overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-char/10 text-char/60"><tr><th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr></thead>
          <tbody>{data.map((u) => (<Fragment key={u._id}>
            <tr className="border-b border-char/5">
              <td className="p-3"><div className="flex items-center gap-3"><Avatar user={u} size={34} /><div><p className="font-semibold">{u.name}</p><p className="text-xs text-char/60">{u.email}</p></div></div></td>
              <td className="p-3 capitalize">{u.role}</td><td className="p-3">{u.isBlocked ? <Badge status="rejected" /> : <Badge status="approved" />}</td>
              <td className="p-3 text-right"><div className="flex justify-end gap-2"><Button variant="ghost" className="!px-3 !py-1.5" onClick={() => setSel(sel === u._id ? null : u._id)}>Details</Button>
                {u.role !== "admin" && <Button variant={u.isBlocked ? "primary" : "dark"} className="!px-3 !py-1.5" onClick={() => block(u)}>{u.isBlocked ? "Unblock" : "Block"}</Button>}</div></td>
            </tr>
            {sel === u._id && <tr className="bg-crust/60"><td colSpan={4} className="p-3 text-xs">ID {u._id} · Plan: {u.subscriptionPlan || "free"}{u.businessName && ` · Restaurant: ${u.businessName}`} · Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "n/a"}</td></tr>}
          </Fragment>))}</tbody></table></div>)}
    </div>
  );
}
