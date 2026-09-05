"use client";

import type { ReactNode } from "react";
import { Card, CardHeader } from "@/components/common/Card";

export function AnalyticsChart({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} />
      <div className="h-64 px-2 py-4">{children}</div>
    </Card>
  );
}
