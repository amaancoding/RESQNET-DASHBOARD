import { cookies } from "next/headers";
import { EXPRESS_API_BASE_URL } from "@/lib/api/config";
import { ApiError, messageForStatus } from "@/lib/api/errors";
import { normalizeDashboard } from "@/lib/api/normalize";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import type { DashboardOverview } from "@/lib/types";

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) {
    throw new ApiError(401, messageForStatus(401));
  }

  let response: Response;
  try {
    response = await fetch(`${EXPRESS_API_BASE_URL}/api/admin/dashboard`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        Cookie: `${SESSION_COOKIE}=${token}`,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Unable to reach the admin API. Confirm Express is running.");
  }

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      throw new ApiError(response.status, "Admin API returned a non-JSON response.");
    }
  }

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : messageForStatus(response.status);
    throw new ApiError(response.status, message);
  }

  return normalizeDashboard(payload);
}
