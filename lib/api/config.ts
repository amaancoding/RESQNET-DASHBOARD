/**
 * Express Admin API configuration.
 *
 * Browser requests use same-origin `/api/admin/*` so the httpOnly session
 * cookie stays on the dashboard origin. next.config.ts rewrites those paths
 * to NEXT_PUBLIC_API_BASE_URL (Express).
 *
 * Do not point this at MongoDB. The dashboard talks to Express only.
 */
export const EXPRESS_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"
).replace(/\/$/, "");

/** Same-origin prefix used by the browser client (rewritten to Express). */
export const BROWSER_API_BASE_URL = "";

export const ADMIN_ROUTES = {
  login: "/api/admin/login",
  logout: "/api/admin/logout",
  me: "/api/admin/me",
  dashboard: "/api/admin/dashboard",
  emergencies: "/api/admin/emergencies",
  emergency: (id: string) => `/api/admin/emergencies/${id}`,
  users: "/api/admin/users",
  feedback: "/api/admin/feedback",
  mesh: "/api/admin/mesh",
  responders: "/api/admin/responders",
  analytics: "/api/admin/analytics",
  auditLogs: "/api/admin/audit-logs",
  resqAi: "/api/admin/resq-ai",
} as const;
