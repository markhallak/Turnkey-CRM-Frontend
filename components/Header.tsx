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

interface IProps {
  title: string;
}

const Header: FC<IProps> = ({ title }) => {
  const [searchTerm, setSearchTerm] = useState("");
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
  const recentSearches = ["PO123", "Acme Co", "PO456", "Beta LLC"];
  const userName = "Alexandra";
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

  const baseNotifications = [
    {
      id: 1,
      name: userName,
      message: "New comment on your post",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      name: "Bob",
      message:
        "Your invoice is ready. New comment on your post. Your invoice is ready. New comment on your post",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      name: userName,
      message: "New comment on your post",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 4,
      name: "Bob",
      message:
        "Your invoice is ready. New comment on your post. Your invoice is ready. New comment on your post",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 5,
      name: userName,
      message: "New comment on your post",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 6,
      name: "Bob",
      message:
        "Your invoice is ready. New comment on your post. Your invoice is ready. New comment on your post",
      time: "Yesterday",
      unread: false,
    },
  ];

  const [notifs, setNotifs] = useState<typeof baseNotifications>([]);
  useEffect(() => {
    setNotifs(
      baseNotifications.map((n) => {
        const bgColor = `#${Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0")}`;
        return {
          ...n,
          avatar: (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-white text-base font-medium cursor-pointer"
              style={{ backgroundColor: bgColor }}
            >
              <span className="-mt-[2px]">{n.name.charAt(0)}</span>
            </div>
          ),
        };
      })
    );
  }, []);

  const [bgColor, setBgColor] = useState<string>("");
  useEffect(() => {
    setBgColor(
      `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`
    );
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setIsLoading(false);
      setProjectResults([]);
      setClientResults([]);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProjectResults([
        {
          poNumber: "PO123",
          client: "Acme Co",
          priority: "High",
          type: "Type A",
          status: "Open",
          assignee: "John",
        },
        {
          poNumber: "PO456",
          client: "Beta LLC",
          priority: "Low",
          type: "Type B",
          status: "Completed",
          assignee: "Mary",
        },
      ]);
      setClientResults([
        {
          clientName: "Acme Co",
          status: "Active",
          type: "Commercial",
          totalRevenue: 123456,
        },
        {
          clientName: "Beta LLC",
          status: "Inactive",
          type: "Residential",
          totalRevenue: 78910,
        },
      ]);
      setIsLoading(false);
    }, 500);
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
                        <BreadcrumbPage className="text-base">{crumb.text}</BreadcrumbPage>
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
            <Dialog>
              <DialogTrigger asChild>
                <Search
                  size={22}
                  className="text-gray-500 hover:text-gray-900 transition-colors duration-200 ease-in-out"
                  strokeWidth={1.25}
                  absoluteStrokeWidth
                />
              </DialogTrigger>
              <DialogContent
                className="
              mx-auto
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
                            onClick={() => setSearchTerm(item)}
                            className="p-2 hover:bg-gray-100 rounded flex items-center justify-between transition-colors duration-100 ease-in-out"
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
              <PopoverContent className="w-[20rem] p-0 mr-5 mt-2">
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
                  {notifs.map((n) => (
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
                        className={`flex-shrink-0 self-center h-2 w-2 bg-blue-500 rounded-full transition-opacity duration-100
      ${n.unread ? "opacity-100" : "opacity-0"}`}
                      />
                    </div>
                  ))}
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
