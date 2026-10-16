import { Badge } from "@/components/common/Badge";
import type { SystemComponentStatus } from "@/lib/types";

const TONE = {
  operational: "success" as const,
  degraded: "medium" as const,
  offline: "neutral" as const,
};

export function SystemStatus({ items }: { items: SystemComponentStatus[] }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.id} className="flex items-start justify-between gap-3 px-5 py-3">
          <div>
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-xs text-muted">{item.detail}</p>
          </div>
          <Badge tone={TONE[item.state]}>{item.state}</Badge>
        </li>
      ))}
    </ul>
  );
}
