"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EXPRESS_API_BASE_URL } from "@/lib/api/config";
import { SESSION_COOKIE } from "@/lib/auth/constants";

export interface LoginState {
  error: string | null;
}

function sessionCookieOptions(remember: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 12,
  };
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  let response: Response;
  try {
    response = await fetch(`${EXPRESS_API_BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember }),
    });
  } catch {
    return { error: "Unable to reach the admin API. Confirm Express is running." };
  }

  if (response.status === 401) {
    return { error: "Invalid email or password." };
  }
  if (response.status === 429) {
    return { error: "Too many login attempts. Try again later." };
  }
  if (!response.ok) {
    return { error: "Unable to sign in." };
  }

  const setCookies = response.headers.getSetCookie?.() ?? [];
  let token = "";
  for (const raw of setCookies) {
    const pair = raw.split(";")[0] ?? "";
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    const name = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    if (name === SESSION_COOKIE && value) {
      token = value;
    }
  }

  if (!token) {
    return { error: "Sign-in succeeded but no session cookie was returned." };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions(remember));
  redirect("/dashboard");
}

export async function logoutAction() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    try {
      await fetch(`${EXPRESS_API_BASE_URL}/api/admin/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          Cookie: `${SESSION_COOKIE}=${token}`,
        },
      });
    } catch {
      // Still clear the local session if Express is unreachable.
    }
  }

  store.delete(SESSION_COOKIE);
  redirect("/login");
}
