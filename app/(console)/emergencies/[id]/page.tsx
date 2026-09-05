"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/common/Card";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { EmergencyPriorityBadge } from "@/components/emergencies/EmergencyPriorityBadge";
import { EmergencyStatusBadge } from "@/components/emergencies/EmergencyStatusBadge";
import { LeafletEmergencyMap } from "@/components/map/LeafletEmergencyMap";
import { getEmergency, updateEmergencyStatus } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import { canUpdateEmergencies, useAdminRole } from "@/lib/auth/role-context";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { formatCoordinate, formatDateTime } from "@/lib/utils/format";
import type { EmergencyStatus } from "@/lib/types";

const STATUSES: EmergencyStatus[] = ["active", "pending", "acknowledged", "resolved"];

export default function EmergencyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const role = useAdminRole();
  const { data, loading, error, retry } = useAsyncData(() => getEmergency(id), id);
  const [status, setStatus] = useState<EmergencyStatus | "">("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  if (loading) return <LoadingState label="Loading incident file" />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!data) {
    return <ErrorState message={`Emergency ${id} was not found.`} onRetry={retry} />;
  }

  const emergency = data;
  const currentStatus = status || emergency.status;

  async function onUpdateStatus() {
    if (!canUpdateEmergencies(role) || currentStatus === emergency.status) return;
    setSaving(true);
    setSaveError(null);
    setSaveNotice(null);
    try {
      await updateEmergencyStatus(emergency.id, currentStatus);
      setSaveNotice("Status updated and written to the audit log.");
      retry();
    } catch (cause) {
      setSaveError(cause instanceof ApiError ? cause.message : "Unable to update status.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Incident file"
        title={emergency.id}
        description="MongoDB emergency document. Mesh hop traces and responder assignment are not stored."
      />
      <p className="mb-4 text-sm">
        <Link href="/emergencies" className="text-cyan hover:underline">
          Back to emergencies
        </Link>
      </p>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <EmergencyPriorityBadge priority={data.priority} />
            <EmergencyStatusBadge status={data.status} />
            <span className="text-sm text-muted">{data.type}</span>
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted">Timestamp</dt>
              <dd className="font-mono text-sm">{formatDateTime(data.timestamp)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Coordinates</dt>
              <dd className="text-sm">{data.locationLabel}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Latitude</dt>
              <dd className="font-mono text-sm">{formatCoordinate(data.latitude)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Longitude</dt>
              <dd className="font-mono text-sm">{formatCoordinate(data.longitude)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Message ID</dt>
              <dd className="font-mono text-sm">{data.messageId ?? "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Source Node ID</dt>
              <dd className="font-mono text-sm">{data.sourceNodeId ?? "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Severity</dt>
              <dd className="text-sm capitalize">{data.severity ?? "high"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Offline synced</dt>
              <dd className="text-sm">{data.isOfflineSynced ? "Yes" : "No"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted">Description</dt>
              <dd className="text-sm">{data.description || "None stored"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Reporter</dt>
              <dd className="text-sm">{data.reporterName || "Anonymous"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Reporter contact</dt>
              <dd className="text-sm">{data.reporterContact || "Not provided"}</dd>
            </div>
          </dl>
          {canUpdateEmergencies(role) ? (
            <div className="mt-6 border-t border-line pt-4">
              <p className="mb-2 text-sm font-medium">Update status</p>
              <div className="flex flex-wrap items-end gap-3">
                <Select
                  label="Status"
                  value={currentStatus}
                  onChange={(value) => setStatus(value as EmergencyStatus)}
                  options={STATUSES.map((item) => ({ value: item, label: item }))}
                />
                <Button
                  disabled={saving || currentStatus === data.status}
                  onClick={onUpdateStatus}
                >
                  {saving ? "Saving…" : "Save status"}
                </Button>
              </div>
              {saveError ? <p className="mt-2 text-sm text-accent">{saveError}</p> : null}
              {saveNotice ? <p className="mt-2 text-sm text-ok">{saveNotice}</p> : null}
            </div>
          ) : (
            <p className="mt-6 text-xs text-muted">
              Status updates require an operator or admin role.
            </p>
          )}
        </Card>
        <Card>
          <CardHeader title="Location" subtitle="Real coordinates from the emergency document" />
          <div className="p-4">
            <LeafletEmergencyMap emergencies={[data]} height={220} />
          </div>
        </Card>
      </div>
      <Card className="mt-4 p-5">
        <h2 className="text-sm font-semibold">Emergency timeline</h2>
        <p className="mt-2 text-sm text-muted">
          Mesh hop traces, BLE route history, and responder acknowledgements are not
          persisted by the backend. Only the original emergency timestamp is known.
        </p>
        <p className="mt-3 font-mono text-xs text-cyan">{formatDateTime(data.timestamp)} · recorded</p>
      </Card>
    </div>
  );
}
