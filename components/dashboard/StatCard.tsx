import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/common/Card";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  tone?: "critical" | "info" | "success" | "neutral";
}

const TONE_BAR = {
  critical: "bg-accent",
  info: "bg-cyan",
  success: "bg-ok",
  neutral: "bg-navy-700",
};

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "neutral",
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden p-4">
      <span className={cn("absolute inset-y-0 left-0 w-1", TONE_BAR[tone])} />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
            {label}
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold text-ink">{value}</p>
          <p className="mt-1 text-xs text-muted">{detail}</p>
        </div>
        <span className="rounded-lg bg-navy-800 p-2 text-cyan">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
}
