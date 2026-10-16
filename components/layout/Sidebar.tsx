"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio } from "lucide-react";
import { CONSOLE_SUBTITLE, CONSOLE_TITLE, isActivePath, NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils/cn";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-line bg-navy-900/95">
      <div className="border-b border-line px-5 py-5">
        <p className="font-mono text-[11px] tracking-[0.28em] text-cyan">OPS CONSOLE</p>
        <p className="mt-1 text-lg font-semibold tracking-[0.18em]">{CONSOLE_TITLE}</p>
        <p className="mt-1 text-xs text-muted">{CONSOLE_SUBTITLE}</p>
      </div>
      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-cyan/10 font-medium text-cyan ring-1 ring-cyan/25"
                      : "text-muted hover:bg-navy-800 hover:text-ink",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-line px-5 py-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Radio className="size-3.5 text-ok" aria-hidden="true" />
          Mock mesh adapter idle
        </div>
      </div>
    </aside>
  );
}
