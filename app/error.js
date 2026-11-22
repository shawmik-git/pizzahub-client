"use client";
export default function Error({ reset }) {
  return (<main className="container-x grid min-h-[60vh] place-items-center text-center"><div>
    <h1 className="text-3xl font-bold">Something burned in the oven</h1><p className="mt-2 text-char/70">An unexpected error occurred. Please try again.</p>
    <button onClick={reset} className="btn btn-primary mt-6">Try again</button></div></main>);
}
