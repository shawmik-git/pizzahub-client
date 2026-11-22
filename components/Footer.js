import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Navbar";

const XLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);

export default function Footer() {
  return (
    <footer className="mt-20 bg-char text-crust/80">
      <div className="container-x grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2"><Logo /><p className="mt-3 max-w-sm text-sm">Discover local pizza shops, browse their menus and get fresh pizza delivered. Built for pizza lovers and the kitchens that feed them.</p></div>
        <div><h4 className="font-bold text-white">Explore</h4><ul className="mt-3 space-y-2 text-sm">
          <li><Link href="/menu" className="hover:text-white">Browse Menu</Link></li><li><Link href="/signup" className="hover:text-white">Sell on PizzaHub</Link></li><li><Link href="/signin" className="hover:text-white">Sign In</Link></li></ul></div>
        <div><h4 className="font-bold text-white">Contact</h4><ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-2"><Mail size={14} />hello@pizzahub.example</li><li className="flex items-center gap-2"><Phone size={14} />+880 1700-000000</li><li className="flex items-center gap-2"><MapPin size={14} />Jashore, Bangladesh</li></ul>
          <div className="mt-4 flex gap-3"><a href="https://x.com" aria-label="X" className="hover:text-white"><XLogo /></a><a href="https://facebook.com" aria-label="Facebook" className="hover:text-white"><Facebook size={18} /></a><a href="https://instagram.com" aria-label="Instagram" className="hover:text-white"><Instagram size={18} /></a></div></div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} PizzaHub. All rights reserved.</div>
    </footer>
  );
}
