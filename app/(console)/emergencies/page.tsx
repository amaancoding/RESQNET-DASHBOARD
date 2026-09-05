"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/common/Card";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { PageHeader } from "@/components/common/PageHeader";
import {
  EmergencyFilters,
  type EmergencyFilterState,
} from "@/components/emergencies/EmergencyFilters";
import { EmergencyTable } from "@/components/emergencies/EmergencyTable";
import { getEmergencies } from "@/lib/api";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import type { Emergency } from "@/lib/types";

const PAGE_SIZE = 8;

const INITIAL_FILTERS: EmergencyFilterState = {
  query: "",
  type: "ALL",
  status: "ALL",
  priority: "ALL",
  range: "ALL",
};

function matchesRange(timestamp: string, range: EmergencyFilterState["range"]) {
  if (range === "ALL") return true;
  const age = Date.now() - new Date(timestamp).getTime();
  if (range === "24h") return age <= 24 * 3_600_000;
  if (range === "7d") return age <= 7 * 86_400_000;
  return age <= 30 * 86_400_000;
}

function applyFilters(rows: Emergency[], filters: EmergencyFilterState) {
  const query = filters.query.trim().toLowerCase();
  return rows.filter((row) => {
    const text = `${row.id} ${row.messageId ?? ""} ${row.sourceNodeId ?? ""} ${row.locationLabel}`.toLowerCase();
    const queryOk = query.length === 0 || text.includes(query);
    const typeOk = filters.type === "ALL" || row.type === filters.type;
    const statusOk = filters.status === "ALL" || row.status === filters.status;
    const priorityOk = filters.priority === "ALL" || row.priority === filters.priority;
    return queryOk && typeOk && statusOk && priorityOk && matchesRange(row.timestamp, filters.range);
  });
}

export default function EmergenciesPage() {
  const { data, loading, error, retry } = useAsyncData(() => getEmergencies({ limit: 100 }));
  const [filters, setFilters] = useState<EmergencyFilterState>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);

  const types = useMemo(
    () => Array.from(new Set((data?.emergencies ?? []).map((row) => row.type))).sort(),
    [data],
  );
  const filtered = useMemo(
    () => applyFilters(data?.emergencies ?? [], filters),
    [data, filters],
  );
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <LoadingState label="Loading emergency records" />;
  if (error || !data) return <ErrorState message={error ?? "Emergencies unavailable"} onRetry={retry} />;

  return (
    <div>
      <PageHeader
        eyebrow="Incident desk"
        title="Emergencies"
        description="Real MongoDB emergency documents. Only fields persisted by the phone API are shown."
      />
      <Card className="p-4">
        <EmergencyFilters
          value={filters}
          types={types}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />
      </Card>
      <Card className="mt-4">
        <EmergencyTable
          rows={paged}
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
