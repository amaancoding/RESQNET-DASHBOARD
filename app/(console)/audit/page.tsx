"use client";

import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { getAuditLogs } from "@/lib/api";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { formatDateTime } from "@/lib/utils/format";

export default function AuditPage() {
  const { data, loading, error, retry } = useAsyncData(getAuditLogs);

  if (loading) return <LoadingState label="Loading audit stream" />;
  if (error || !data) return <ErrorState message={error ?? "Audit logs unavailable"} onRetry={retry} />;

  return (
    <div>
      <PageHeader
        eyebrow="Accountability"
        title="Audit logs"
        description="Real admin actions written by Express: login, logout, and emergency status updates."
      />
      <Card>
        {data.logs.length === 0 ? (
          <EmptyState
            title="No audit events yet"
            detail="Login and status changes will appear here after they occur."
          />
        ) : (
          <div className="table-wrap">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-850 text-[11px] tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">Admin</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Resource</th>
                  <th className="px-4 py-3 font-medium">IP</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.logs.map((row) => (
                  <tr key={row.id} className="border-t border-line hover:bg-navy-800/50">
                    <td className="px-4 py-3 font-mono text-xs text-muted">
                      {formatDateTime(row.timestamp)}
                    </td>
                    <td className="px-4 py-3">{row.adminEmail ?? row.adminId}</td>
                    <td className="px-4 py-3">{row.action}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {row.resourceType}
                      {row.resourceId ? ` / ${row.resourceId}` : ""}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{row.ip ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge tone="success">SUCCESS</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
