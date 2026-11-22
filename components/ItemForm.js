"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { uploadImage } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { Button, Input, Select, Textarea } from "./ui";

export default function ItemForm({ initial, submitLabel, onSubmit }) {
  const [v, setV] = useState({ itemName: "", category: "", description: "", price: "", location: "", images: [], ...initial });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const upload = async (e) => {
    const files = [...e.target.files].slice(0, 4 - v.images.length);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setV((x) => ({ ...x, images: [...x.images, ...urls].slice(0, 4) }));
    } catch (err) { toast.error(err.message); }
    setUploading(false);
    e.target.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!v.images.length) return toast.error("Upload at least one item image");
    setSaving(true);
    try { await onSubmit({ ...v, price: Number(v.price) }); } catch (err) { toast.error(err.message); }
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Item name" value={v.itemName} onChange={set("itemName")} required minLength={2} maxLength={80} />
      <Select label="Category" value={v.category} onChange={set("category")} required>
        <option value="">Select a category</option>{CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
      </Select>
      <Textarea label="Description" value={v.description} onChange={set("description")} required minLength={10} maxLength={1000} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Price (৳)" type="number" min="1" step="any" value={v.price} onChange={set("price")} required />
        <Input label="Location (area / city)" value={v.location} onChange={set("location")} required />
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium">Item images <span className="font-normal text-char/60">(required, up to 4)</span></p>
        <div className="flex flex-wrap gap-3">
          {v.images.map((u) => (
            <div key={u} className="relative h-24 w-24"><img src={u} alt="" className="h-full w-full rounded-lg object-cover" />
              <button type="button" aria-label="Remove image" onClick={() => setV({ ...v, images: v.images.filter((x) => x !== u) })} className="absolute -right-2 -top-2 rounded-full bg-char p-1 text-white"><X size={12} /></button></div>
          ))}
          {v.images.length < 4 && (
            <label className="grid h-24 w-24 cursor-pointer place-items-center rounded-lg border-2 border-dashed border-char/25 text-center text-xs text-char/60 hover:border-tomato">
              {uploading ? "Uploading…" : "+ Add photo"}<input type="file" accept="image/*" multiple hidden onChange={upload} disabled={uploading} />
            </label>
          )}
        </div>
      </div>
      <Button type="submit" loading={saving} disabled={uploading}>{submitLabel}</Button>
    </form>
  );
}
