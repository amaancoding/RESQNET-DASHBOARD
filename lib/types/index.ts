export type EmergencyPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type EmergencyStatus = "active" | "pending" | "acknowledged" | "resolved";
export type EmergencySeverity = "low" | "medium" | "high" | "critical";

export interface TimelineEvent {
  id: string;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Emergency {
  id: string;
  messageId?: string;
  sourceNodeId?: string;
  type: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  location?: unknown;
  isOfflineSynced?: boolean;
  description?: string;
  severity?: EmergencySeverity;
  reporterName?: string | null;
  reporterContact?: string | null;
  status: EmergencyStatus;
  locationLabel: string;
  priority: EmergencyPriority;
}

export interface EmergencyListResponse {
  emergencies: Emergency[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ObservedDevice {
  id: string;
  deviceId: string;
  displayName: string;
  emergencyCount: number;
  firstSeen: string;
  lastSeen: string;
}

export interface UsersResponse {
  available: boolean;
  source?: string;
  message: string;
  users: ObservedDevice[];
  total: number;
}

export type FeedbackStatus = "new" | "under_review" | "resolved";

export interface FeedbackRecord {
  id: string;
  rating?: number;
  category: string;
  message: string;
  createdAt: string;
  status: FeedbackStatus;
  emergencyId?: string | null;
}

export interface FeedbackResponse {
  available: boolean;
  message: string;
  feedback: FeedbackRecord[];
  total: number;
}

export interface UnavailableResource<T = null> {
  available: false;
  message: string;
  data: T;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  timestamp: string;
  metadata?: Record<string, unknown>;
  ip: string | null;
}

export interface AuditLogResponse {
  logs: AuditLog[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardStats {
  totalEmergencies: number;
  emergenciesToday: number;
  criticalEmergencies: number;
  activeEmergencies: number;
  resolvedEmergencies: number;
  observedDevices: number;
}

export interface TrendPoint {
  label: string;
  emergencies: number;
  resolved: number;
}

export interface TypeDistributionPoint {
  type: string;
  count: number;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  message: string;
  tone: "critical" | "info" | "success";
}

export interface SystemComponentStatus {
  id: string;
  name: string;
  detail: string;
  state: "operational" | "degraded" | "offline";
}

export interface DashboardOverview {
  stats: DashboardStats;
  byType: TypeDistributionPoint[];
  trend: TrendPoint[];
  recentEmergencies: Emergency[];
  recentActivity: ActivityEvent[];
  systemStatus: SystemComponentStatus[];
  unavailable: {
    registeredNodes: string;
    messagesForwarded: string;
  };
}

export interface UnavailableMetric {
  key: string;
  message: string;
}

export interface AnalyticsSnapshot {
  available: boolean;
  metrics: {
    totalEmergencies: number;
    countOverTime: TrendPoint[];
    typeDistribution: TypeDistributionPoint[];
    statusDistribution: Array<{ status: string; count: number }>;
    severityDistribution: Array<{ severity: string; count: number }>;
    averagePerDay: number;
    daysWithEmergencies: number;
  };
  unavailable: UnavailableMetric[];
}

export type AdminRole = "viewer" | "operator" | "admin";

export interface AdminProfile {
  id: string;
  email: string;
  role: AdminRole;
  lastLogin: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminSession {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  issuedAt: string;
  demo: false;
}

export interface EmergencyQuery {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  severity?: string;
  q?: string;
  from?: string;
  to?: string;
  sort?: string;
  order?: "asc" | "desc";
}
