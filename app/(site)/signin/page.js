"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Button, Input, Spinner } from "@/components/ui";

function SignIn() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [f, setF] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const dest = next && next.startsWith("/") ? next : "/auth/complete";

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await authClient.signIn.email(f);
    setBusy(false);
    if (error) return toast.error(error.message || "Invalid email or password");
    toast.success("Welcome back!");
    router.push(dest);
    router.refresh();
  };
  const google = () => authClient.signIn.social({ provider: "google", callbackURL: dest });

  return (
    <div className="container-x grid place-items-center py-16">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-bold">Sign in</h1><p className="mt-1 text-sm text-char/70">Welcome back to PizzaHub.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Email" type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
          <Input label="Password" type="password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
          <Button type="submit" loading={busy} className="w-full">Sign in</Button>
        </form>
        <Button variant="ghost" className="mt-3 w-full" onClick={google}>Continue with Google</Button>
        <p className="mt-6 text-center text-sm">New here? <Link href="/signup" className="font-semibold text-tomato">Create an account</Link></p>
      </div>
    </div>
  );
}
export default function Page() { return <Suspense fallback={<Spinner />}><SignIn /></Suspense>; }
