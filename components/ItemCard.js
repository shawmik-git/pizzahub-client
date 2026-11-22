"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { Heart, MapPin } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useFavorites } from "@/lib/hooks";

const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#F2C14E"/><circle cx="200" cy="150" r="80" fill="#C2371F"/><circle cx="170" cy="130" r="14" fill="#9E2A1B"/><circle cx="225" cy="165" r="14" fill="#9E2A1B"/></svg>');

export default function ItemCard({ item }) {
  const { data } = authClient.useSession();
  const isCustomer = data?.user?.role === "customer";
  const { ids, toggle } = useFavorites(isCustomer);
  const fav = ids.includes(String(item._id));
  const onFav = async () => {
    try { toast.success((await toggle(String(item._id))) ? "Saved to favorites" : "Removed from favorites"); } catch (e) { toast.error(e.message); }
  };
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] bg-char/5">
        <img src={item.images?.[0] || FALLBACK} alt={item.itemName} loading="lazy" onError={(e) => { e.currentTarget.src = FALLBACK; }} className="h-full w-full object-cover" />
        {item.vendor?.premium && <span className="absolute left-3 top-3 rounded-full bg-oven px-2.5 py-1 text-xs font-semibold text-white">Premium</span>}
        {isCustomer && (
          <button onClick={onFav} aria-label={fav ? "Remove from favorites" : "Add to favorites"} aria-pressed={fav} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-tomato shadow">
            <Heart size={18} fill={fav ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium text-basil">{item.category}</p>
        <h3 className="text-lg font-bold leading-snug">{item.itemName}</h3>
        <p className="flex items-center gap-1 text-sm text-char/70"><MapPin size={14} />{item.location}</p>
        <p className="text-sm text-char/70">By {item.vendor?.businessName || item.vendor?.name}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-xl font-bold text-tomato">৳{item.price}</span>
          <Link href={`/menu/${item._id}`} className="btn btn-primary">View Details</Link>
        </div>
      </div>
    </article>
  );
}
