import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <main className="flex min-h-[calc(100vh-72px)] w-full flex-col items-center justify-center gap-6 bg-[#ECF2F7] px-6 font-gilroy text-center">
      <p className="text-[13px] font-bold uppercase tracking-[2px] text-[#473BF0]">
        404 — Page not found
      </p>
      <h1 className="text-[40px] font-bold leading-none tracking-[-1.5px] text-navy sm:text-[56px]">
        This page doesn't exist
      </h1>
      <p className="max-w-[420px] text-[17px] leading-7 text-navy/60">
        The URL{" "}
        <code className="rounded bg-navy/5 px-1.5 py-0.5 text-[15px] text-navy">
          {location.pathname}
        </code>{" "}
        wasn't found. It may have moved or never existed.
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex h-[50px] items-center justify-center rounded-lg bg-[#473BF0] px-8 text-[17px] font-bold text-white transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </main>
  );
}
