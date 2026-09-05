"use client";

import Link from "next/link";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { EmergencyPriorityBadge } from "@/components/emergencies/EmergencyPriorityBadge";
import { EmergencyStatusBadge } from "@/components/emergencies/EmergencyStatusBadge";
import { formatCoordinate, formatDateTime } from "@/lib/utils/format";
import type { Emergency } from "@/lib/types";

interface EmergencyTableProps {
  rows: Emergency[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function EmergencyTable({
  rows,
  page,
  pageSize,
  total,
  onPageChange,
}: EmergencyTableProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  if (total === 0) {
    return (
      <EmptyState
        title="No matching emergencies"
        detail="Adjust filters or wait for the Android app to post SOS records."
      />
    );
  }

  return (
    <>
      <div className="table-wrap">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-850 text-[11px] tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Emergency ID</th>
              <th className="px-4 py-3 font-medium">Message ID</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Source Node</th>
              <th className="px-4 py-3 font-medium">Latitude</th>
              <th className="px-4 py-3 font-medium">Longitude</th>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line hover:bg-navy-800/50">
                <td className="px-4 py-3 font-mono text-cyan">{row.id}</td>
                <td className="px-4 py-3 font-mono text-xs">{row.messageId}</td>
                <td className="px-4 py-3">{row.type}</td>
                <td className="px-4 py-3">
                  <EmergencyPriorityBadge priority={row.priority} />
                </td>
                <td className="px-4 py-3 font-mono text-xs">{row.sourceNodeId}</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {formatCoordinate(row.latitude)}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {formatCoordinate(row.longitude)}
                </td>
                <td className="px-4 py-3 text-muted">{formatDateTime(row.timestamp)}</td>
                <td className="px-4 py-3">
                  <EmergencyStatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/emergencies/${row.id}`} className="text-cyan hover:underline">
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs text-muted">
        <p>
          Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="self-center font-mono">
            {page}/{pageCount}
          </span>
          <Button
            variant="secondary"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
