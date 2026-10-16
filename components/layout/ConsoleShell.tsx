"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AdminRoleProvider } from "@/lib/auth/role-context";
import { NAV_ITEMS } from "@/lib/navigation";
import type { AdminRole } from "@/lib/types";

export function ConsoleShell({
  adminName,
  role,
  children,
}: {
  adminName: string;
  role: AdminRole;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const current = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <AdminRoleProvider role={role}>
      <div className="ops-grid min-h-screen">
        <div className="flex min-h-screen">
          <div className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-0 h-screen">
              <Sidebar />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar
              title={current?.label ?? "Operations"}
              adminName={adminName}
              role={role}
              onOpenMobileNav={() => setMobileOpen(true)}
            />
            <DemoBanner />
            <main className="flex-1 p-4 sm:p-6">{children}</main>
          </div>
        </div>
        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </div>
    </AdminRoleProvider>
  );
}
