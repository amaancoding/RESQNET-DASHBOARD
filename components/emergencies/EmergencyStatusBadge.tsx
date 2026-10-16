import { Badge } from "@/components/common/Badge";
import type { EmergencyStatus } from "@/lib/types";

const TONE: Record<EmergencyStatus, "critical" | "medium" | "info" | "success"> = {
  active: "critical",
  pending: "medium",
  acknowledged: "info",
  resolved: "success",
};

export function EmergencyStatusBadge({ status }: { status: EmergencyStatus }) {
  return <Badge tone={TONE[status] ?? "neutral"}>{status}</Badge>;
}
