"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, uploadImage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useFetch } from "@/lib/hooks";
import { Avatar, Button, ErrorBox, Input, Spinner } from "@/components/ui";

export default function Profile() {
  const { data: me, loading, error, reload } = useFetch("/api/me");
  const { refetch } = authClient.useSession();
  const [f, setF] = useState({ name: "", image: "", businessName: "" });
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (me) setF({ name: me.name, image: me.image, businessName: me.businessName }); }, [me]);
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const pick = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try { setF({ ...f, image: await uploadImage(file) }); toast.success("Image uploaded. Save to apply."); } catch (err) { toast.error(err.message); }
  };
  const save = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await api("/api/profile", { method: "PATCH", body: f }); await refetch(); toast.success("Profile updated"); } catch (err) { toast.error(err.message); }
    setBusy(false);
  };
  return (
    <div className="max-w-xl"><h1 className="mb-6 text-3xl font-bold">Profile Settings</h1>
      <form onSubmit={save} className="card space-y-4 p-6">
        <div className="flex items-center gap-4"><Avatar user={f} size={64} /><label className="btn btn-ghost cursor-pointer">Change photo<input type="file" accept="image/*" hidden onChange={pick} /></label></div>
        <Input label="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required minLength={2} />
        {me.role === "vendor" && <Input label="Restaurant name" value={f.businessName} onChange={(e) => setF({ ...f, businessName: e.target.value })} required />}
        <Input label="Email" value={me.email} disabled hint="Email can't be changed" />
        <p className="text-sm text-char/70">Role: <b className="capitalize">{me.role}</b>{me.role === "vendor" && <> · Plan: <b className="capitalize">{me.subscriptionPlan}</b></>}</p>
        <Button type="submit" loading={busy}>Save changes</Button>
      </form>
    </div>
  );
}
