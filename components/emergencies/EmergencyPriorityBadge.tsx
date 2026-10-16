import { Badge } from "@/components/common/Badge";
import type { EmergencyPriority } from "@/lib/types";

const TONE = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

export function EmergencyPriorityBadge({ priority }: { priority: EmergencyPriority }) {
  return <Badge tone={TONE[priority]}>{priority}</Badge>;
}
