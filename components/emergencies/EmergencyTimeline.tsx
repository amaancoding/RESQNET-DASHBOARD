import { formatDateTime } from "@/lib/utils/format";
import type { TimelineEvent } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function EmergencyTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="space-y-0">
      {events.map((event, index) => (
        <li key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "mt-1 size-3 rounded-full ring-4",
                event.completed
                  ? "bg-cyan ring-cyan/20"
                  : "bg-navy-700 ring-navy-800",
              )}
            />
            {index < events.length - 1 ? (
              <span
                className={cn(
                  "w-px flex-1",
                  event.completed ? "bg-cyan/40" : "bg-navy-700",
                )}
              />
            ) : null}
          </div>
          <div className="pb-5">
            <p className={cn("text-sm font-medium", event.completed ? "text-ink" : "text-muted")}>
              {event.label}
            </p>
            <p className="text-xs text-muted">{event.description}</p>
            <p className="mt-1 font-mono text-[11px] text-muted">
              {event.completed ? formatDateTime(event.timestamp) : "Awaiting event"}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
