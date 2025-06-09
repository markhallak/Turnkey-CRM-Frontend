import { serverUrl } from "./config";

async function fetchJson<T>(path: string, params: Record<string, any> = {}): Promise<T> {
  const url = new URL(path, serverUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  });
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchWithRetry<T>(
  requestFn: () => Promise<T>,
  retries = 3,
  delayMs = 5000
) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

export interface DashboardMetrics {
  totalInvoiced: number;
  totalCollected: number;
  totalProjects: number;
  openProjects: number;
}

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
}

export interface Notification {
  id: string;
  createdAt: string;
  message: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  totalCount: number;
  pageSize: number;
  lastSeenCreatedAt: string | null;
  lastSeenId: string | null;
}

export interface ProfileDetails {
  firstName: string;
  hexColor: string;
}

export async function getDashboardMetrics() {
  const data = await fetchJson<{ metrics: any[] }>("/get-dashboard-metrics");
  return {
    metrics: data.metrics.map((m) => ({
      totalInvoiced: m.total_invoiced,
      totalCollected: m.total_collected,
      totalProjects: m.total_projects,
      openProjects: m.open_projects,
    })) as DashboardMetrics[],
  };
}

export function getCalendarEvents(month: number) {
  return fetchJson<{ events: any[] }>("/get-calendar-events", { month });
}

export async function getNotifications(
  size: number,
  lastSeenCreatedAt?: string,
  lastSeenId?: string
) {
  const data = await fetchJson<any>("/get-notifications", {
    size,
    last_seen_created_at: lastSeenCreatedAt,
    last_seen_id: lastSeenId,
  });
  return {
    notifications: data.notifications.map((n: any) => ({
      id: n.id,
      createdAt: n.created_at,
      message: n.message,
    })),
    totalCount: data.total_count,
    pageSize: data.page_size,
    lastSeenCreatedAt: data.last_seen_created_at,
    lastSeenId: data.last_seen_id,
  } as NotificationsResponse;
}

export async function getProfileDetails(userId: string) {
  const data = await fetchJson<{ first_name: string; hex_color: string }>(
    "/get-profile-details",
    { user_id: userId }
  );
  return { firstName: data.first_name, hexColor: data.hex_color };
}

export { fetchJson, fetchWithRetry };
