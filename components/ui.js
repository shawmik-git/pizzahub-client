"use client";
import clsx from "clsx";
import { STATUS_STYLE } from "@/lib/constants";
import { Button as ShButton } from "@/components/ui/button";
import { Input as ShInput } from "@/components/ui/input";
import { Textarea as ShTextarea } from "@/components/ui/textarea";
import { Badge as ShBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const BTN = {
  primary: "bg-tomato text-white hover:bg-[#a52d18]",
  ghost: "border border-char/20 bg-transparent text-char hover:bg-char/5",
  dark: "bg-char text-white hover:bg-black dark:bg-[#F5E9D6] dark:text-[#1B120D]",
};
export const Button = ({ variant = "primary", loading, className, children, ...p }) => (
  <ShButton {...p} disabled={p.disabled || loading} className={clsx("h-auto rounded-full px-5 py-2.5 text-sm font-semibold", BTN[variant], className)}>{loading ? "Please wait…" : children}</ShButton>
);
export const Field = ({ label, hint, children }) => (
  <label className="block space-y-1.5"><span className="text-sm font-medium">{label}</span>{children}{hint && <span className="block text-xs text-char/60">{hint}</span>}</label>
);
const FIELD = "input h-auto w-full rounded-xl border-char/20 bg-white px-3.5 py-2.5 text-sm focus-visible:border-tomato focus-visible:ring-tomato/20";
export const Input = ({ label, hint, className, ...p }) => <Field label={label} hint={hint}><ShInput {...p} className={clsx(FIELD, className)} /></Field>;
export const Textarea = ({ label, hint, ...p }) => <Field label={label} hint={hint}><ShTextarea rows={4} {...p} className={FIELD} /></Field>;
export const Select = ({ label, children, ...p }) => <Field label={label}><select {...p} className="input">{children}</select></Field>;
export const Badge = ({ status }) => (
  <ShBadge className={clsx("h-auto rounded-full border-transparent px-2.5 py-1 text-xs font-semibold capitalize", STATUS_STYLE[status] || "bg-char/10")}>{status}</ShBadge>
);
export const Spinner = ({ label = "Loading…" }) => (
  <div role="status" className="flex items-center justify-center gap-3 py-16 text-char/70">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-tomato border-t-transparent" />{label}
  </div>
);
export const Empty = ({ title, children }) => (
  <Card className="card mx-auto max-w-md p-10 text-center"><p className="text-4xl" aria-hidden>🍕</p><h3 className="mt-3 text-lg font-bold">{title}</h3><p className="mt-1 text-sm text-char/70">{children}</p></Card>
);
export const ErrorBox = ({ message, onRetry }) => (
  <Card className="card mx-auto max-w-md p-8 text-center"><h3 className="text-lg font-bold">Something went wrong</h3><p className="mt-1 text-sm text-char/70">{message}</p>{onRetry && <Button className="mt-4" onClick={onRetry}>Try again</Button>}</Card>
);
export const Avatar = ({ user, size = 36 }) => user?.image
  ? <img src={user.image} alt="" style={{ width: size, height: size }} className="rounded-full object-cover" />
  : <span style={{ width: size, height: size }} className="grid place-items-center rounded-full bg-oven font-bold text-white">{(user?.name || "?")[0].toUpperCase()}</span>;