import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (<><Navbar /><main className="container-x grid min-h-[60vh] place-items-center text-center"><div>
    <p className="text-6xl" aria-hidden>🍕</p><h1 className="mt-4 text-4xl font-bold">This page isn't on the menu</h1>
    <p className="mt-2 text-char/70">The link may be broken, or the page has moved.</p><Link href="/" className="btn btn-primary mt-6">Back to home</Link></div></main><Footer /></>);
}
