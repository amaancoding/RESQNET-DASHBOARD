"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { Modal } from "@/components/common/Modal";
import { formatDateTime } from "@/lib/utils/format";
import type { ObservedDevice } from "@/lib/types";

export function UserTable({ rows }: { rows: ObservedDevice[] }) {
  const [selected, setSelected] = useState<ObservedDevice | null>(null);

  if (rows.length === 0) {
    return (
      <EmptyState
        title="User management data is not available yet."
        detail="No sourceNodeId values have been observed on emergency reports."
      />
    );
  }

  return (
    <>
      <div className="table-wrap">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-850 text-[11px] tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Device ID</th>
              <th className="px-4 py-3 font-medium">Display Name</th>
              <th className="px-4 py-3 font-medium">Emergency Count</th>
              <th className="px-4 py-3 font-medium">First Seen</th>
              <th className="px-4 py-3 font-medium">Last Seen</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line hover:bg-navy-800/50">
                <td className="px-4 py-3 font-mono text-cyan">{row.deviceId}</td>
                <td className="px-4 py-3">{row.displayName}</td>
                <td className="px-4 py-3 font-mono">{row.emergencyCount}</td>
                <td className="px-4 py-3 text-muted">{formatDateTime(row.firstSeen)}</td>
                <td className="px-4 py-3 text-muted">{formatDateTime(row.lastSeen)}</td>
                <td className="px-4 py-3">
                  <Button variant="secondary" onClick={() => setSelected(row)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={Boolean(selected)}
        title={selected ? selected.displayName : "Observed device"}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted">Device ID</dt>
              <dd className="font-mono">{selected.deviceId}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Emergencies</dt>
              <dd>{selected.emergencyCount}</dd>
            </div>
            <p className="col-span-2 text-xs text-muted">
              Observed from emergency.sourceNodeId. This is not a registered user account.
            </p>
          </dl>
        ) : null}
      </Modal>
    </>
  );
}
