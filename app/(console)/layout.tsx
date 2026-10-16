import { redirect } from "next/navigation";
import { ConsoleShell } from "@/components/layout/ConsoleShell";
import { getAdminSession } from "@/lib/auth/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Operations",
    template: "%s · ResQNet",
  },
};

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <ConsoleShell adminName={session.displayName} role={session.role}>
      {children}
    </ConsoleShell>
  );
}
