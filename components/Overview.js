"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFetch } from "@/lib/hooks";
import { ErrorBox, Spinner } from "./ui";

export default function Overview({ role, title }) {
  const { data, loading, error, reload } = useFetch(`/api/${role}/overview`);
  if (loading) return <Spinner label="Loading your dashboard…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.stats.map((s) => (
          <div key={s.label} className="card p-5"><p className="text-sm text-char/70">{s.label}</p><p className="mt-1 text-3xl font-bold text-tomato">{s.value}</p></div>
        ))}
      </div>
      <div className="card p-5">
        <h2 className="mb-4 text-lg font-bold">At a glance</h2>
        <div className="h-64"><ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.chart}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#C2371F" radius={[6, 6, 0, 0]} /></BarChart>
        </ResponsiveContainer></div>
      </div>
    </div>
  );
}
