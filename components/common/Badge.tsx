import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeTone =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "success"
  | "neutral"
  | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

const TONES: Record<BadgeTone, string> = {
  critical: "bg-accent/15 text-accent ring-accent/30",
  high: "bg-high/15 text-high ring-high/30",
  medium: "bg-warn/15 text-warn ring-warn/30",
  low: "bg-cyan/15 text-cyan ring-cyan/30",
  success: "bg-ok/15 text-ok ring-ok/30",
  neutral: "bg-white/5 text-muted ring-white/10",
  info: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
};

export function Badge({ tone = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ring-1",
        TONES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
