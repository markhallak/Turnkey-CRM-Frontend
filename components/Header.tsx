"use client";
import { FC, useState, useEffect, useMemo, Fragment } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { History, Search, CheckCheck, Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/router";
import { useWrapperData } from "@/lib/wrapperContext";
import { encryptPost, decryptPost } from "@/lib/apiClient";

export async function fetchJson<T>(path: string, params: Record<string, any> = {}) {
  const res = await encryptPost(path, params);
  return decryptPost<T>(res);
}

export async function fetchWithRetry<T>(
  requestFn: () => Promise<T>,
  retries = 2,
  delayMs = 3000
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

export async function getProfileDetails() {
  const data = await fetchJson<{ first_name: string; hex_color: string }>(
    "/get-profile-details"
  );

  return { firstName: data.first_name, hexColor: data.hex_color };
}

function parseCsv(value: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false
  for (let i = 0; i < value.length; i++) {
    const char = value[i]
    if (inQuotes) {
      if (char === "\"") {
        if (value[i + 1] === "\"") {
          current += "\""
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else {
      if (char === "\"") {
        inQuotes = true
      } else if (char === ",") {
        result.push(current)
        current = ""
      } else {
        current += char
      }
    }
  }
  result.push(current)
  return result
}

function toCsv(arr: string[]): string {
  return arr
    .map((s) =>
      s.includes(",") || s.includes("\"") ? `"${s.replace(/\"/g, '""')}"` : s
    )
    .join(",")
}

interface IProps {
  title: string;
}

const Header: FC<IProps> = ({ title }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [projectResults, setProjectResults] = useState<
    {
      poNumber: string;
      client: string;
      priority: string;
      type: string;
      status: string;
      assignee: string;
    }[]
  >([]);
  const [clientResults, setClientResults] = useState<
    { clientName: string; status: string; type: string; totalRevenue: number }[]
  >([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { notifications: contextNotifs, userName, avatarColor } = useWrapperData();
  const router = useRouter();
  const path = router.asPath.split("?")[0];

  // split into segments: ["projects","view","123"]
  const segments = path.split("/").filter(Boolean);

  const crumbs = useMemo(() => {
    const section = segments[0];
    const sectionLabel = section.charAt(0).toUpperCase() + section.slice(1);

    if (segments.length >= 2) {
      if (segments[1] === "view" && segments[2]) {
        return [
          { text: sectionLabel, href: `/${section}` },
          { text: segments[2] },
        ];
      }
      if (segments[1] === "new") {
        return [{ text: sectionLabel, href: `/${section}` }, { text: "New" }];
      }
    }
    return [{ text: sectionLabel }];
  }, [path, title]);

  const [notifs, setNotifs] = useState(contextNotifs);
  const bgColor = avatarColor;

  useEffect(() => {
    if (!searchOpen) return;
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("recent_searches="));
    if (match) {
      try {
        const value = decodeURIComponent(match.split("=")[1]);
        setRecentSearches(parseCsv(value));
      } catch {
        setRecentSearches([]);
      }
    }
  }, [searchOpen]);

  useEffect(() => {
    setNotifs(contextNotifs);
  }, [contextNotifs]);

  const updateRecentSearches = (term: string) => {
    const next = [term, ...recentSearches.filter((t) => t !== term)].slice(0, 5);
    setRecentSearches(next);
    document.cookie = `recent_searches=${encodeURIComponent(toCsv(next))}; path=/; max-age=${60 * 60 * 24 * 365}`;
  };

  const handleSelectSearch = (term: string) => {
    setSearchTerm(term);
    updateRecentSearches(term);
  };

  useEffect(() => {
    if (searchTerm.length < 3) {
      setIsLoading(false);
      setProjectResults([]);
      setClientResults([]);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await fetchJson<{ projects: any[]; clients: any[] }>(
          "/global-search",
          { q: searchTerm }
        );
        setProjectResults(data.projects || []);
        setClientResults(data.clients || []);
        updateRecentSearches(searchTerm);
      } catch (err) {
        console.error("global search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleMarkRead = (id) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };
  const handleMarkAllRead = () => {
    const anyUnread = notifs.some((n) => n.unread);
    setNotifs((prev) =>
      prev.map((n) => ({ ...n, unread: anyUnread ? false : true }))
    );
  };

  useEffect(() => {
    import("@/components/ui/dialog");
  }, []);

  return (
    <header>
      <nav className="bg-white border-b border-gray-200 px-5 sm:!pr-16">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="h-7 w-7" />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, i) => (
                  <Fragment key={i}>
                    <BreadcrumbItem className="hidden md:block">
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href} className="text-base">
                          {crumb.text}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-base">
                          {crumb.text}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {i < crumbs.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block text-base" />
                    )}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center space-x-4">
            <Dialog open={searchOpen} onOpenChange={(o) => { setSearchOpen(o); if (!o) setSearchTerm(""); }}>
              <DialogTrigger asChild>
                <Search
                  size={22}
                  className="text-gray-500 hover:text-gray-900 transition-colors duration-200 ease-in-out"
                  strokeWidth={1.25}
                  absoluteStrokeWidth
                />
              </DialogTrigger>
              <DialogContent
                forceMount
                className="
              mx-auto
              will-change-[opacity,transform]
              transition-all duration-200 ease-in-out
     max-w-[calc(100%-2rem)]
     md:max-w-xl
     lg:max-w-2xl
     h-[50vh]
     md:h-[70vh]
     flex flex-col
     overflow-hidden
     rounded-lg
              "
              >
                <div className="flex flex-col space-y-4 flex-1 min-h-0">
                  <div className="input-underline !mx-4 mt-4 flex items-center">
                    <Search
                      size={18}
                      color="#a6a6a6"
                      strokeWidth={1}
                      absoluteStrokeWidth
                      className="mr-1"
                    />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search projects and clients..."
                      className="inner-input ml-2 pb-[0.15rem] flex-1 font-normal text-gray-700"
                      autoFocus
                    />
                  </div>

                  <ScrollArea className="flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : searchTerm === "" ? (
                      <div className="space-y-2 py-2 px-4">
                        {recentSearches.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectSearch(item)}
                            className="p-2 cursor-pointer hover:bg-gray-100 rounded flex items-center justify-between transition-colors duration-100 ease-in-out"
                          >
                            <span>{item}</span>
                            <History
                              size={20}
                              color="#a6a6a6"
                              strokeWidth={1}
                              absoluteStrokeWidth
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="py-2">
                          <h3 className="mb-4 text-lg font-semibold mx-4">
                            Projects
                          </h3>
                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 px-4 mb-2">
                            {projectResults.map((r, i) => (
                              <Link
                                key={i}
                                href={`/projects/view/${r.poNumber}`}
                                onClick={() => handleSelectSearch(r.poNumber)}
                                className="group block rounded-xl bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-xl w-full h-42"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xl font-medium text-gray-900">
                                    {r.poNumber}
                                  </span>
                                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                                    {r.status}
                                  </span>
                                </div>
                                <p className="mt-1 text-gray-500">{r.client}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                    {r.priority}
                                  </span>
                                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                                    {r.type}
                                  </span>
                                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                                    {r.assignee}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="py-2">
                          <h3 className="mb-4 text-lg font-semibold mx-4">
                            Clients
                          </h3>
                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 px-4 pb-5">
                            {clientResults.map((c, i) => (
                              <Link
                                key={i}
                                href={`/clients/${c.clientName}`}
                                onClick={() => handleSelectSearch(c.clientName)}
                                className="group block rounded-xl bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-xl w-full h-42"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xl font-medium text-gray-900">
                                    {c.clientName}
                                  </span>
                                  <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                                    {c.status}
                                  </span>
                                </div>
                                <p className="mt-1 text-gray-500">{c.type}</p>
                                <div className="mt-4 text-right">
                                  <span className="text-lg font-semibold text-gray-900">
                                    ${c.totalRevenue.toLocaleString()}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
            <Popover>
              <PopoverTrigger asChild>
                {notifs.some((n) => n.unread) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500 hover:text-gray-900 transition-colors duration-200 ease-in-out"
                  >
                    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                    <path d="M13.916 2.314A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673 9 9 0 0 1-.585-.665" />
                    <circle cx="18" cy="8" r="3" fill="#e53e3e" stroke="none" />
                  </svg>
                ) : (
                  <Bell
                    size={20}
                    className="text-gray-500 hover:text-gray-900 transition-colors duration-200 ease-in-out"
                    strokeWidth={1.25}
                    absoluteStrokeWidth
                  />
                )}
              </PopoverTrigger>
              <PopoverContent className="w-[20rem] p-0 mr-5 sm:mr-16 mt-2">
                <div className="flex items-center justify-between px-3 py-2 border-b">
                  <span className="font-semibold">Notifications</span>
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center text-xs text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    <CheckCheck size={18} className="mr-1" />
                    {notifs.some((n) => n.unread)
                      ? "Mark all as read"
                      : "Mark all as unread"}
                  </button>
                </div>
                <ScrollArea className="overflow-y-auto max-h-60">
                  {notifs.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500 text-center">No notifications</div>
                  ) : (
                    notifs.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkRead(n.id)}
                        className="flex items-start p-4 hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        {n.avatar}
                        <div className="ml-3 flex-1 flex flex-col space-y-0.5 -mt-1">
                          <p className="text-sm text-gray-700 break-words mb-0">
                            {n.message}
                          </p>
                          <span className="text-xs text-gray-400 mt-0">
                            {n.time}
                          </span>
                        </div>

                        <span
                          className={`flex-shrink-0 self-center h-2 w-2 bg-blue-500 rounded-full transition-opacity duration-100 ${n.unread ? "opacity-100" : "opacity-0"}`}
                        />
                      </div>
                    ))
                  )}
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <div className="relative">
              <Link href="/profile" passHref>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white text-base font-medium cursor-pointer"
                  style={{ backgroundColor: bgColor }}
                >
                  <span className="-mt-[2px]">{userName.charAt(0)}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
