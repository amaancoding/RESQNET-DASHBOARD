"use client";

import { SearchInput } from "@/components/common/SearchInput";
import { Select } from "@/components/common/Select";
import type { EmergencyPriority, EmergencyStatus } from "@/lib/types";

export interface EmergencyFilterState {
  query: string;
  type: string;
  status: "ALL" | EmergencyStatus;
  priority: "ALL" | EmergencyPriority;
  range: "ALL" | "24h" | "7d" | "30d";
}

interface EmergencyFiltersProps {
  value: EmergencyFilterState;
  types: string[];
  onChange: (next: EmergencyFilterState) => void;
}

export function EmergencyFilters({ value, types, onChange }: EmergencyFiltersProps) {
  const patch = (partial: Partial<EmergencyFilterState>) =>
    onChange({ ...value, ...partial });

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <SearchInput
        label="Search emergencies"
        placeholder="Search ID, message, or node"
        value={value.query}
        onChange={(query) => patch({ query })}
      />
      <Select
        label="Type"
        value={value.type}
        onChange={(type) => patch({ type })}
        options={[
          { value: "ALL", label: "All types" },
          ...types.map((type) => ({ value: type, label: type })),
        ]}
      />
      <Select
        label="Status"
        value={value.status}
        onChange={(status) => patch({ status: status as EmergencyFilterState["status"] })}
        options={[
          { value: "ALL", label: "All statuses" },
          { value: "active", label: "Active" },
          { value: "pending", label: "Pending" },
          { value: "acknowledged", label: "Acknowledged" },
          { value: "resolved", label: "Resolved" },
        ]}
      />
      <Select
        label="Severity"
        value={value.priority}
        onChange={(priority) =>
          patch({ priority: priority as EmergencyFilterState["priority"] })
        }
        options={[
          { value: "ALL", label: "All severities" },
          { value: "CRITICAL", label: "Critical" },
          { value: "HIGH", label: "High" },
          { value: "MEDIUM", label: "Medium" },
          { value: "LOW", label: "Low" },
        ]}
      />
      <Select
        label="Date"
        value={value.range}
        onChange={(range) => patch({ range: range as EmergencyFilterState["range"] })}
        options={[
          { value: "ALL", label: "All time" },
          { value: "24h", label: "Last 24 hours" },
          { value: "7d", label: "Last 7 days" },
          { value: "30d", label: "Last 30 days" },
        ]}
      />
    </div>
  );
}
