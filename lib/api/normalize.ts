import type {
  DashboardOverview,
  Emergency,
  EmergencyPriority,
  EmergencySeverity,
  EmergencyStatus,
} from "@/lib/types";

const STATUSES = new Set<EmergencyStatus>([
  "active",
  "pending",
  "acknowledged",
  "resolved",
]);

function asStatus(value: unknown): EmergencyStatus {
  const normalized = String(value ?? "active").toLowerCase();
  return STATUSES.has(normalized as EmergencyStatus)
    ? (normalized as EmergencyStatus)
    : "active";
}

function asSeverity(value: unknown): EmergencySeverity {
  const normalized = String(value ?? "high").toLowerCase();
  if (normalized === "low" || normalized === "medium" || normalized === "critical") {
    return normalized;
  }
  return "high";
}

export function severityToPriority(severity?: string | null): EmergencyPriority {
  const value = String(severity ?? "high").toLowerCase();
  if (value === "critical") return "CRITICAL";
  if (value === "medium") return "MEDIUM";
  if (value === "low") return "LOW";
  return "HIGH";
}

export function hasValidCoordinates(item: { latitude?: unknown; longitude?: unknown }) {
  return (
    typeof item.latitude === "number" &&
    typeof item.longitude === "number" &&
    Number.isFinite(item.latitude) &&
    Number.isFinite(item.longitude) &&
    item.latitude >= -90 &&
    item.latitude <= 90 &&
    item.longitude >= -180 &&
    item.longitude <= 180
  );
}

export function locationLabel(latitude: number, longitude: number) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export function normalizeEmergency(raw: Record<string, unknown>): Emergency {
  const latitude = Number(raw.latitude);
  const longitude = Number(raw.longitude);
  const severity = asSeverity(raw.severity);
  return {
    id: String(raw.id ?? ""),
    messageId: typeof raw.messageId === "string" ? raw.messageId : undefined,
    sourceNodeId: typeof raw.sourceNodeId === "string" ? raw.sourceNodeId : undefined,
    type: String(raw.type ?? "Unknown"),
    latitude,
    longitude,
    timestamp: String(raw.timestamp ?? new Date().toISOString()),
    location: raw.location,
    isOfflineSynced: Boolean(raw.isOfflineSynced),
    description: typeof raw.description === "string" ? raw.description : "",
    severity,
    reporterName: typeof raw.reporterName === "string" ? raw.reporterName : null,
    reporterContact: typeof raw.reporterContact === "string" ? raw.reporterContact : null,
    status: asStatus(raw.status),
    locationLabel: locationLabel(latitude, longitude),
    priority: severityToPriority(severity),
  };
}

export function normalizeDashboard(raw: unknown): DashboardOverview {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid dashboard response from Express.");
  }

  const data = raw as Partial<DashboardOverview>;
  if (!data.stats || typeof data.stats !== "object") {
    throw new Error("Invalid dashboard response from Express.");
  }

  return {
    stats: data.stats,
    byType: data.byType ?? [],
    trend: data.trend ?? [],
    recentEmergencies: (data.recentEmergencies ?? []).map((item) =>
      normalizeEmergency(item as unknown as Record<string, unknown>),
    ),
    recentActivity: data.recentActivity ?? [],
    systemStatus: data.systemStatus ?? [],
    unavailable: data.unavailable ?? {
      registeredNodes: "Not available — mesh directory is not stored server-side",
      messagesForwarded: "Not available — hop traces are not persisted",
    },
  };
}

