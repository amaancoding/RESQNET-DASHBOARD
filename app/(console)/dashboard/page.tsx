import { DashboardOverviewView } from "@/components/dashboard/DashboardOverviewView";
import { DashboardRefreshError } from "@/components/dashboard/DashboardRefreshError";
import { fetchDashboardOverview } from "@/lib/api/server";
import { ApiError } from "@/lib/api/errors";
import type { DashboardOverview } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let data: DashboardOverview | null = null;
  let loadError: string | null = null;

  try {
    data = await fetchDashboardOverview();
  } catch (cause) {
    loadError =
      cause instanceof ApiError
        ? cause.message
        : cause instanceof Error
          ? cause.message
          : "Unable to load operations overview.";
  }

  if (loadError || !data) {
    return <DashboardRefreshError message={loadError ?? "Unable to load operations overview."} />;
  }

  return <DashboardOverviewView data={data} />;
}
