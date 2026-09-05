import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDateTime } from "@/lib/utils/format";
import type { FeedbackRecord } from "@/lib/types";

const STATUS_TONE: Record<string, "info" | "medium" | "success" | "neutral"> = {
  new: "info",
  under_review: "medium",
  resolved: "success",
};

export function FeedbackTable({ rows }: { rows: FeedbackRecord[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title="No feedback data available."
        detail="Feedback collection is not connected yet."
      />
    );
  }

  return (
    <div className="table-wrap">
      <table className="w-full text-left text-sm">
        <thead className="bg-navy-850 text-[11px] tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Message</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-line hover:bg-navy-800/50">
              <td className="px-4 py-3 font-mono">{row.rating ?? "—"}</td>
              <td className="px-4 py-3">
                <Badge tone="info">{row.category}</Badge>
              </td>
              <td className="max-w-md px-4 py-3">{row.message}</td>
              <td className="px-4 py-3 text-muted">{formatDateTime(row.createdAt)}</td>
              <td className="px-4 py-3">
                <Badge tone={STATUS_TONE[row.status] ?? "neutral"}>{row.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
