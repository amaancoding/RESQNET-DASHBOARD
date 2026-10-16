"use client";

import { useActionState, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/common/Button";
import { loginAction, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = { error: null };

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initialState);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  return (
    <div className="ops-grid min-h-screen">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl lg:grid-cols-2">
        <section className="hidden flex-col justify-between border-r border-line px-10 py-12 lg:flex">
          <div>
            <h1 className="text-5xl font-semibold tracking-[0.2em]">RESQNET</h1>
            <p className="mt-2 text-sm text-muted">Emergency Response Administration</p>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="border-l-2 border-accent pl-4">EMERGENCY RESPONSE</li>
            <li className="border-l-2 border-cyan pl-4">NETWORK MONITORING</li>
            <li className="border-l-2 border-ok pl-4">REAL-TIME OPERATIONS</li>
          </ul>
          <p className="max-w-sm text-sm text-muted">
            Command console for SOS intake from the Android mesh. Sign in with a
            seeded AdminUser. Phone SOS routes stay unauthenticated.
          </p>
        </section>

        <section className="flex items-center px-6 py-12 sm:px-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <h1 className="text-3xl font-semibold tracking-[0.18em]">RESQNET</h1>
              <p className="text-sm text-muted">Admin Dashboard</p>
            </div>
            <div className="rounded-2xl border border-line bg-navy-900/85 p-6 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <span className="rounded-lg bg-accent/15 p-2 text-accent">
                  <ShieldAlert className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                  <p className="text-xs text-muted">Express session authentication</p>
                </div>
              </div>
              <form action={action} className="space-y-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted">Email</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    className="w-full rounded-lg border border-line bg-navy-950 px-3 py-2.5 text-sm outline-none focus:border-cyan/40 focus:ring-1 focus:ring-cyan/40"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted">Password</span>
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg border border-line bg-navy-950 px-3 py-2.5 text-sm outline-none focus:border-cyan/40 focus:ring-1 focus:ring-cyan/40"
                  />
                </label>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-muted">
                    <input
                      name="remember"
                      type="checkbox"
                      className="accent-cyan"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-cyan hover:underline"
                    onClick={() =>
                      setForgotMessage(
                        "Password reset is not available. Use npm run seed:admin on the backend.",
                      )
                    }
                  >
                    Forgot password
                  </button>
                </div>
                {state.error ? (
                  <p role="alert" className="text-sm text-accent">
                    {state.error}
                  </p>
                ) : null}
                {forgotMessage ? (
                  <p className="text-sm text-muted">{forgotMessage}</p>
                ) : null}
                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? "Signing in…" : "Sign In"}
                </Button>
              </form>
              <div className="mt-5 rounded-lg border border-line bg-navy-950 px-3 py-3 text-xs text-muted">
                <p className="font-medium text-ink">Seeded credentials</p>
                <p className="mt-1">
                  Use ADMIN_EMAIL and ADMIN_PASSWORD from the backend environment.
                  Passwords are never stored in this dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
