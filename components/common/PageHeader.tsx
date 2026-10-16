import { Badge } from "@/components/common/Badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  demo = true,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  demo?: boolean;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>
      </div>
      {demo ? (
        <Badge tone="info" title="This screen uses isolated mock data">
          Demo Data
        </Badge>
      ) : null}
    </header>
  );
}
