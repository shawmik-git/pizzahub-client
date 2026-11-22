"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ShieldCheck, Store, Wallet } from "lucide-react";
import { useFetch } from "@/lib/hooks";
import { CATEGORIES } from "@/lib/constants";
import ItemCard from "@/components/ItemCard";
import { Empty, ErrorBox, Spinner } from "@/components/ui";

const dots = [[30, 28], [58, 22], [72, 46], [62, 72], [34, 70], [22, 50], [48, 48], [80, 28]];

function Pizza() {
  return (
    <motion.div aria-hidden initial={{ rotate: -120, scale: 0.85, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ duration: 1.1, ease: "easeOut" }}
      className="relative mx-auto aspect-square w-full max-w-md rounded-full bg-[#D9954A] p-[6%] shadow-xl">
      <div className="h-full w-full rounded-full bg-tomato p-[4%]"><div className="relative h-full w-full rounded-full bg-[#F2C14E]">
        {dots.map(([x, y], i) => <span key={i} style={{ left: `${x}%`, top: `${y}%` }} className="absolute h-[14%] w-[14%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9E2A1B]" />)}
      </div></div>
    </motion.div>
  );
}

export default function Home() {
  const { data, loading, error, reload } = useFetch("/api/menu?sort=featured&limit=6", { auth: false });
  const why = [
    [Clock, "Hot on arrival", "Vendors confirm every order, so what you pick is what leaves the oven."],
    [Store, "Local kitchens", "Browse independent pizza shops near you instead of one big chain."],
    [Wallet, "Simple pricing", "Prices are listed up front. No payment needed to place an order."],
    [ShieldCheck, "Vetted menus", "Every menu item is reviewed by our team before it goes live."],
  ];
  return (
    <>
      <section className="container-x grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">Hot &amp; Fresh Pizza Delivered to Your Door</h1>
          <p className="mt-5 max-w-md text-lg text-char/75">Find pizza shops near you, browse their menus and place an order in a minute. Real ovens, local kitchens.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link href="/menu" className="btn btn-primary">Explore Pizza Menu</Link><Link href="/signup" className="btn btn-ghost">Open a pizza shop</Link></div>
        </div>
        <Pizza />
      </section>

      <section className="container-x py-12">
        <div className="mb-8 flex items-end justify-between"><h2 className="h-section">Featured Menu Items</h2><Link href="/menu" className="text-sm font-semibold text-tomato">See all</Link></div>
        {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : data.items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((i) => <ItemCard key={i._id} item={i} />)}</div>
        ) : <Empty title="No pizzas yet">Approved menu items will appear here.</Empty>}
      </section>

      <section className="container-x py-12">
        <h2 className="h-section mb-8">Pizza Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link href={`/menu?category=${encodeURIComponent(c.name)}`} className="card flex h-full items-start gap-4 p-5 transition hover:border-tomato">
                <span className="text-3xl" aria-hidden>{c.icon}</span><span><span className="block font-bold">{c.name}</span><span className="text-sm text-char/70">{c.blurb}</span></span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-x py-12">
        <h2 className="h-section mb-8">Why Choose PizzaHub?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(([Icon, t, d]) => <div key={t} className="card p-5"><Icon className="text-tomato" /><h3 className="mt-3 font-bold">{t}</h3><p className="mt-1 text-sm text-char/70">{d}</p></div>)}
        </div>
      </section>

      <section className="container-x py-12">
        <h2 className="h-section mb-8">How PizzaHub Works</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {["Pick a pizza from a local shop", "Choose a delivery date and address", "The shop accepts and your order is on its way"].map((s, i) => (
            <li key={s} className="card flex items-center gap-4 p-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tomato font-bold text-white">{i + 1}</span>{s}</li>
          ))}
        </ol>
      </section>
    </>
  );
}
