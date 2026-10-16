"use client";

import { Card, CardHeader } from "@/components/common/Card";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { UnavailableState } from "@/components/common/UnavailableState";
import { ConceptualMeshDiagram } from "@/components/mesh/ConceptualMeshDiagram";
import { getMeshSnapshot } from "@/lib/api";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function MeshPage() {
  const { data, loading, error, retry } = useAsyncData(getMeshSnapshot);

  if (loading) return <LoadingState label="Checking mesh telemetry" />;
  if (error || !data) return <ErrorState message={error ?? "Mesh snapshot unavailable"} onRetry={retry} />;

  return (
    <div>
      <PageHeader
        eyebrow="On-device routing"
        title="Mesh network"
        description="ResQNet currently performs mesh routing on-device. The backend does not store nodes, peers, hop traces, or route history."
      />
      <UnavailableState
        title="Mesh telemetry is not currently available from the backend."
        detail={
          data.message ||
          "Server-side mesh telemetry will appear when node and route telemetry is persisted."
        }
      />
      <Card className="mt-4">
        <CardHeader
          title="Conceptual Mesh Architecture — Not Live Data"
          subtitle="Static illustration of on-device BLE forwarding. This is not a live topology."
        />
        <ConceptualMeshDiagram />
      </Card>
    </div>
  );
}
