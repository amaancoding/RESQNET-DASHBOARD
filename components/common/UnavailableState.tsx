import { RadioTower } from "lucide-react";

export function UnavailableState({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-line bg-navy-900 px-6 py-16 text-center">
      <RadioTower className="size-8 text-muted" aria-hidden="true" />
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="max-w-xl text-sm text-muted">{detail}</p>
    </div>
  );
}
