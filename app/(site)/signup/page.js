"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/api";
import { Button, Input, Select } from "@/components/ui";

export default function SignUp() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", password: "", role: "customer", businessName: "" });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!/[A-Z]/.test(f.password) || !/[a-z]/.test(f.password) || f.password.length < 6) return toast.error("Password needs 6+ characters with one uppercase and one lowercase letter");
    if (f.role === "vendor" && f.businessName.trim().length < 2) return toast.error("Enter your restaurant name");
    setBusy(true);
    const body = { name: f.name.trim(), email: f.email, password: f.password, role: f.role };
    if (f.role === "vendor") body.businessName = f.businessName.trim();
    const { error } = await authClient.signUp.email(body);
    if (error) { setBusy(false); return toast.error(error.message || "Couldn't create your account"); }
    if (file) {
      try { await authClient.updateUser({ image: await uploadImage(file) }); } catch { toast.error("Account created, but the profile image couldn't be uploaded. You can add it in Profile Settings."); }
    }
    setBusy(false);
    toast.success("Account created. Welcome to PizzaHub!");
    router.push("/auth/complete");
    router.refresh();
  };

  return (
    <div className="container-x grid place-items-center py-16">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Select label="I am a" value={f.role} onChange={set("role")}><option value="customer">Customer</option><option value="vendor">Vendor (Restaurant Owner)</option></Select>
          <Input label="Full name" value={f.name} onChange={set("name")} required minLength={2} />
          {f.role === "vendor" && <Input label="Restaurant name" value={f.businessName} onChange={set("businessName")} required />}
          <Input label="Email" type="email" value={f.email} onChange={set("email")} required />
          <Input label="Password" type="password" value={f.password} onChange={set("password")} hint="At least 6 characters, with one uppercase and one lowercase letter" required />
          <label className="block space-y-1.5"><span className="text-sm font-medium">Profile image <span className="font-normal text-char/60">(optional)</span></span>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} className="block w-full text-sm" /></label>
          <Button type="submit" loading={busy} className="w-full">Sign up</Button>
        </form>
        <Button variant="ghost" className="mt-3 w-full" onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/auth/complete" })}>Sign up with Google</Button>
        <p className="mt-6 text-center text-sm">Already have an account? <Link href="/signin" className="font-semibold text-tomato">Sign in</Link></p>
      </div>
    </div>
  );
}
