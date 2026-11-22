"use client";
import Link from "next/link";
import { useFetch } from "@/lib/hooks";
import ItemCard from "@/components/ItemCard";
import { Empty, ErrorBox, Spinner } from "@/components/ui";

export default function Favorites() {
  const { data, loading, error, reload } = useFetch("/api/customer/favorites");
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <div><h1 className="mb-6 text-3xl font-bold">Favorites</h1>
      {!data.length ? <Empty title="No favorites yet">Tap the heart on any menu item to save it here. <Link href="/menu" className="font-semibold text-tomato">Browse the menu</Link></Empty>
        : <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{data.map((i) => <ItemCard key={i._id} item={i} />)}</div>}
    </div>
  );
}
