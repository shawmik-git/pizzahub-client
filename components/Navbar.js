"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { resetToken } from "@/lib/api";
import { Avatar } from "./ui";
import ThemeToggle from "./ThemeToggle";
import { resetFavorites } from "@/lib/hooks";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-2xl font-extrabold text-tomato">
      <span aria-hidden className="inline-block h-6 w-6 rounded-full bg-oven ring-4 ring-tomato/30" />PizzaHub
    </Link>
  );
}

export function ProfileMenu() {
  const { data } = authClient.useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (!data) return null;
  const user = data.user;
  const logout = async () => {
    await authClient.signOut();
    resetToken();
    resetFavorites();
    setOpen(false);
    router.push("/");
    router.refresh();
  };
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full border border-char/15 bg-white py-1 pl-1 pr-3" aria-expanded={open}>
        <Avatar user={user} size={32} /><span className="max-w-[110px] truncate text-sm font-medium">{user.name}</span><ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-char/10 bg-white p-1.5 shadow-lg" onClick={() => setOpen(false)}>
          <p className="truncate px-3 py-2 text-xs text-char/60">{user.email}</p>
          <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm hover:bg-crust">Dashboard</Link>
          <Link href="/dashboard/profile" className="block rounded-lg px-3 py-2 text-sm hover:bg-crust">Profile Settings</Link>
          <button onClick={logout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-tomato hover:bg-crust">Logout</button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { data, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const role = data?.user?.role;
  const links = [["Home", "/"], ["Browse Menu", "/menu"]];
  if (data) {
    if (role === "vendor") links.push(["My Menu Items", "/dashboard/vendor/items"]);
    if (role === "customer") links.push(["My Orders", "/dashboard/customer/orders"]);
    if (role === "admin") links.push(["Manage Users", "/dashboard/admin/users"]);
  }
  return (
    <header className="sticky top-0 z-40 border-b border-char/10 bg-crust/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {links.map(([l, h]) => <Link key={h} href={h} className="text-sm font-medium hover:text-tomato">{l}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isPending ? null : data ? <ProfileMenu /> : (<><Link href="/signin" className="btn btn-ghost">Sign In</Link><Link href="/signup" className="btn btn-primary">Sign Up</Link></>)}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="border-t border-char/10 bg-crust px-4 py-4 md:hidden" onClick={() => setOpen(false)}>
          <div className="flex flex-col gap-3">
            {links.map(([l, h]) => <Link key={h} href={h} className="py-1 font-medium">{l}</Link>)}
            <ThemeToggle />
            {!isPending && (data ? <div onClick={(e) => e.stopPropagation()}><ProfileMenu /></div> : (
              <div className="flex gap-3"><Link href="/signin" className="btn btn-ghost">Sign In</Link><Link href="/signup" className="btn btn-primary">Sign Up</Link></div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
