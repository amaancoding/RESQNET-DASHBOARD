import Link from "next/link";

export default function NotFound() {
  return (
    <div className="ops-grid flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs tracking-[0.28em] text-cyan">RESQNET</p>
        <h1 className="mt-3 text-3xl font-semibold">View not found</h1>
        <p className="mt-2 text-sm text-muted">
          That operations route does not exist in the admin console.
        </p>
        <Link href="/dashboard" className="mt-6 inline-block text-cyan hover:underline">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
