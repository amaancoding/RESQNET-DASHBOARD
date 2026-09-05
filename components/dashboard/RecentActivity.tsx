import { formatRelativeTime } from "@/lib/utils/format";
import type { ActivityEvent } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const DOT = {
  critical: "bg-accent",
  info: "bg-cyan",
  success: "bg-ok",
};

export function RecentActivity({ items }: { items: ActivityEvent[] }) {
  return (
    <ol className="space-y-3 px-5 py-4">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[item.tone])} />
          <div>
            <p className="text-sm text-ink">{item.message}</p>
            <p className="text-xs text-muted">{formatRelativeTime(item.timestamp)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
