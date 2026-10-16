import Link from "next/link";
import { EmergencyPriorityBadge } from "@/components/emergencies/EmergencyPriorityBadge";
import { EmergencyStatusBadge } from "@/components/emergencies/EmergencyStatusBadge";
import { formatDateTime } from "@/lib/utils/format";
import type { Emergency } from "@/lib/types";

export function RecentEmergencies({ rows }: { rows: Emergency[] }) {
  return (
    <div className="table-wrap">
      <table className="w-full text-left text-sm">
        <thead className="bg-navy-850 text-[11px] tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Source Node</th>
            <th className="px-4 py-3 font-medium">Time</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-line hover:bg-navy-800/50">
              <td className="px-4 py-3 font-mono text-cyan">{row.id}</td>
              <td className="px-4 py-3">{row.type}</td>
              <td className="px-4 py-3">
                <EmergencyPriorityBadge priority={row.priority} />
              </td>
              <td className="px-4 py-3">{row.locationLabel}</td>
              <td className="px-4 py-3 font-mono text-xs">{row.sourceNodeId}</td>
              <td className="px-4 py-3 text-muted">{formatDateTime(row.timestamp)}</td>
              <td className="px-4 py-3">
                <EmergencyStatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/emergencies/${row.id}`}
                  className="text-cyan hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
