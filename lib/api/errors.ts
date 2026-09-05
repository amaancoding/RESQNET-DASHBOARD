export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function messageForStatus(status: number, fallback?: string) {
  if (fallback) return fallback;
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You do not have permission to view this resource.";
  if (status === 404) return "The requested record was not found.";
  if (status === 429) return "Too many requests. Please try again later.";
  if (status >= 500) return "The admin API is unavailable. Please retry.";
  return "Unable to load data from the admin API.";
}
