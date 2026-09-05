"use client";

import { Badge } from "@/components/common/Badge";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import { LeafletEmergencyMap } from "@/components/map/LeafletEmergencyMap";
import { getEmergencies } from "@/lib/api";
import { hasValidCoordinates } from "@/lib/api/normalize";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function MapPage() {
  const { data, loading, error, retry } = useAsyncData(() => getEmergencies({ limit: 100 }));

  if (loading) return <LoadingState label="Loading emergency locations" />;
  if (error || !data) return <ErrorState message={error ?? "Map unavailable"} onRetry={retry} />;

  const located = data.emergencies.filter(hasValidCoordinates);

  return (
    <div>
      <PageHeader
        eyebrow="Geospatial"
        title="Emergency map"
        description="Markers are real latitude/longitude values from MongoDB emergency documents. Responder and mesh node positions are not stored."
      />
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge tone="info">REAL DATA · emergencies with coordinates</Badge>
        <Badge tone="neutral">No demo markers</Badge>
      </div>
      <LeafletEmergencyMap emergencies={located} />
      <p className="mt-3 text-xs text-muted">
        {located.length} emergency location{located.length === 1 ? "" : "s"} plotted.
        Responder and mesh overlays are omitted because that telemetry is not available.
      </p>
    </div>
  );
}
