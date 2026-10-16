import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <Inbox className="size-8 text-muted" aria-hidden="true" />
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="max-w-md text-sm text-muted">{detail}</p>
    </div>
  );
}
