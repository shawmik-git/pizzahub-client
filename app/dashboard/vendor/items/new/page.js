"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import ItemForm from "@/components/ItemForm";

export default function AddItem() {
  const router = useRouter();
  const submit = async (v) => {
    try {
      await api("/api/vendor/items", { method: "POST", body: v });
      toast.success("Item submitted. It will appear once an admin approves it.");
      router.push("/dashboard/vendor/items");
    } catch (e) {
      if (e.code === "LIMIT") toast.error(<span>{e.message} <Link href="/dashboard/vendor/subscription" className="underline">Upgrade</Link></span>);
      else throw e;
    }
  };
  return (<div className="max-w-2xl"><h1 className="mb-6 text-3xl font-bold">Add Menu Item</h1><div className="card p-6"><ItemForm submitLabel="Submit for approval" onSubmit={submit} /></div></div>);
}
