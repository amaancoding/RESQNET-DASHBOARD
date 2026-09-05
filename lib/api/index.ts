import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { ADMIN_ROUTES } from "@/lib/api/config";
import { normalizeDashboard, normalizeEmergency } from "@/lib/api/normalize";
import type {
  AdminProfile,
  AnalyticsSnapshot,
  AuditLogResponse,
  DashboardOverview,
  Emergency,
  EmergencyListResponse,
  EmergencyQuery,
  EmergencyStatus,
  FeedbackResponse,
  UnavailableResource,
  UsersResponse,
} from "@/lib/types";

function queryString(params: EmergencyQuery = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).length > 0) {
      search.set(key, String(value));
    }
  });
  const encoded = search.toString();
  return encoded ? `?${encoded}` : "";
}

export function getMe() {
  return apiGet<{ admin: AdminProfile }>(ADMIN_ROUTES.me);
}

export async function getDashboardOverview() {
  const data = await apiGet<DashboardOverview>(ADMIN_ROUTES.dashboard);
  return normalizeDashboard(data);
}

export async function getEmergencies(params: EmergencyQuery = {}): Promise<EmergencyListResponse> {
  const data = await apiGet<EmergencyListResponse>(
    `${ADMIN_ROUTES.emergencies}${queryString(params)}`,
  );
  return {
    ...data,
    emergencies: (data.emergencies ?? []).map((item) =>
      normalizeEmergency(item as unknown as Record<string, unknown>),
    ),
  };
}

export async function getEmergency(id: string): Promise<Emergency | null> {
  const data = await apiGet<{ emergency: Record<string, unknown> }>(
    ADMIN_ROUTES.emergency(id),
  );
  return data.emergency ? normalizeEmergency(data.emergency) : null;
}

export async function updateEmergencyStatus(id: string, status: EmergencyStatus) {
  const data = await apiPatch<{ emergency: Record<string, unknown> }>(
    ADMIN_ROUTES.emergency(id),
    { status },
  );
  return normalizeEmergency(data.emergency);
}

export function getUsers() {
  return apiGet<UsersResponse>(ADMIN_ROUTES.users);
}

export function getFeedback() {
  return apiGet<FeedbackResponse>(ADMIN_ROUTES.feedback);
}

export function getMeshSnapshot() {
  return apiGet<UnavailableResource>(ADMIN_ROUTES.mesh);
}

export function getResponders() {
  return apiGet<UnavailableResource>(ADMIN_ROUTES.responders);
}

export function getAnalytics() {
  return apiGet<AnalyticsSnapshot>(ADMIN_ROUTES.analytics);
}

export function getAuditLogs() {
  return apiGet<AuditLogResponse>(ADMIN_ROUTES.auditLogs);
}

export function getResqAiSnapshot() {
  return apiGet<UnavailableResource>(ADMIN_ROUTES.resqAi);
}

export function postLogout() {
  return apiPost<{ status: string }>(ADMIN_ROUTES.logout);
}
