"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { authClient } from "@/lib/auth-client";
import { resetToken } from "@/lib/api";
import { Logo, ProfileMenu } from "@/components/Navbar";
import { Spinner } from "@/components/ui";
import ThemeToggle from "@/components/ThemeToggle";

const NAV = {
  vendor: [["Overview", "/dashboard/vendor"], ["My Menu Items", "/dashboard/vendor/items"], ["Add Menu Item", "/dashboard/vendor/items/new"], ["Customer Orders", "/dashboard/vendor/orders"], ["Subscription", "/dashboard/vendor/subscription"], ["Profile Settings", "/dashboard/profile"]],
  customer: [["Overview", "/dashboard/customer"], ["My Orders", "/dashboard/customer/orders"], ["Favorites", "/dashboard/customer/favorites"], ["Profile Settings", "/dashboard/profile"]],
  admin: [["Overview", "/dashboard/admin"], ["Manage Users", "/dashboard/admin/users"], ["Manage Menu Items", "/dashboard/admin/items"], ["Transactions", "/dashboard/admin/transactions"], ["Profile Settings", "/dashboard/profile"]],
};

export default function DashboardLayout({ children }) {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const user = data?.user;
  const seg = path.split("/")[2];
  const allowed = user && user.roleChosen && (seg === "profile" || seg === user.role);

  // Wait for the session to load before redirecting, so reloading a private route never bounces to Sign In.
  useEffect(() => {
    if (isPending) return;
    if (!user) router.replace(`/signin?next=${encodeURIComponent(path)}`);
    else if (!user.roleChosen) router.replace("/auth/complete");
    else if (!allowed) router.replace(`/dashboard/${user.role}`);
  }, [isPending, user, allowed, path, router]);

  if (isPending || !user || !allowed) return <Spinner label="Loading dashboard…" />;
  if (user.isBlocked) return (
    <div className="container-x grid min-h-screen place-items-center text-center"><div className="card max-w-md p-10">
      <h1 className="text-2xl font-bold">Account blocked</h1><p className="mt-2 text-char/70">Your account has been blocked by an administrator. Contact support if you think this is a mistake.</p>
      <button className="btn btn-primary mt-6" onClick={async () => { await authClient.signOut(); resetToken(); router.push("/"); }}>Log out</button></div></div>
  );

  const links = NAV[user.role];
  const nav = (
    <nav className="space-y-1" aria-label="Dashboard">{links.map(([l, h]) => (
      <Link key={h} href={h} onClick={() => setOpen(false)} className={clsx("block rounded-xl px-4 py-2.5 text-sm font-medium", path === h ? "bg-tomato text-white" : "hover:bg-char/5")}>{l}</Link>
    ))}</nav>
  );
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-char/10 bg-crust px-4 sm:px-6">
        <div className="flex items-center gap-3"><button className="lg:hidden" aria-label="Toggle sidebar" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><Logo /></div>
        <div className="flex items-center gap-3"><span className="hidden rounded-full bg-oven/15 px-3 py-1 text-xs font-semibold capitalize text-oven sm:inline">{user.role}</span><ThemeToggle /><ProfileMenu /></div>
      </header>
      <div className="flex">
        <aside className={clsx("fixed inset-y-16 left-0 z-20 w-64 overflow-y-auto border-r border-char/10 bg-white p-4 transition-transform lg:static lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>{nav}</aside>
        <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
