"use client";

import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/common/ErrorState";

export function DashboardRefreshError({ message }: { message: string }) {
  const router = useRouter();
  return <ErrorState message={message} onRetry={() => router.refresh()} />;
}
