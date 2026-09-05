"use client";

import { Menu } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import { Button } from "@/components/common/Button";
import type { AdminRole } from "@/lib/types";

interface TopbarProps {
  title: string;
  adminName: string;
  role: AdminRole;
  onOpenMobileNav: () => void;
}

export function Topbar({ title, adminName, role, onOpenMobileNav }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-line bg-navy-900/80 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          className="lg:hidden"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </Button>
        <div className="min-w-0">
          <p className="truncate font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
            ResQNet
          </p>
          <p className="truncate text-sm font-medium">{title}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden text-right md:block">
          <p className="text-sm font-medium">{adminName}</p>
          <p className="text-[11px] text-muted capitalize">{role}</p>
        </div>
        <form action={logoutAction}>
          <Button variant="secondary" type="submit">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
