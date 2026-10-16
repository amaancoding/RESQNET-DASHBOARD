import { cookies } from "next/headers";
import { EXPRESS_API_BASE_URL } from "@/lib/api/config";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import type { AdminSession } from "@/lib/types";

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${EXPRESS_API_BASE_URL}/api/admin/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        Cookie: `${SESSION_COOKIE}=${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as { admin?: { id: string; email: string; role: AdminSession["role"] } };
    if (!json.admin) {
      return null;
    }

    return {
      id: json.admin.id,
      email: json.admin.email,
      displayName: json.admin.email,
      role: json.admin.role,
      issuedAt: new Date().toISOString(),
      demo: false,
    };
  } catch {
    return null;
  }
}
