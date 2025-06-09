import CalendarComponent from "@/components/Dashboard/CalenderComponent";
import Performance from "@/components/Dashboard/Performance";
import Wrapper from "@/components/Wrapper";
import { LuCircleUserRound } from "react-icons/lu";
import React, { useEffect, useState } from "react";
import {
  getCalendarEvents,
  getDashboardMetrics,
  type CalendarEvent,
  type DashboardMetrics,
} from "@/lib/api";
import { useWrapperData } from "@/lib/wrapperContext";

export default function Dashboard() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const { notifications } = useWrapperData();

  useEffect(() => {
    const month = new Date().getMonth() + 1;
    Promise.all([getCalendarEvents(month), getDashboardMetrics()])
      .then(([eventsRes, metricsRes]) => {
        const mapped = eventsRes.events.map((e) => ({
          title: e.business_name ?? "Event",
          start: e.event_date,
          end: e.event_date,
          description: e.scope_of_work,
          location: e.address,
        }));
        setEvents(mapped);
        setMetrics(metricsRes.metrics[0] || null);
      })
      .catch(console.error);
  }, []);

  return (
    <Wrapper title="dashboard">
    <div className="px-6 sm:px-0 md: px-0 lg:px-0">
      <div className="flex flex-col lg:flex-row py-8 gap-10">
      <style jsx global>{`
        .title {
          font-family: "Times New Roman", serif;
          text-transform: capitalize;
          color: #0b1f3a;
        }
      `}</style>
        <div className="flex-1 min-w-0">
          <CalendarComponent events={events} />
        </div>
        <div className="md:col-span-1">
          <Performance metrics={metrics} />
        </div>
      </div>
      <div className="flex flex-col py-4 pb-20">
        <span className="text-2xl title border-b">Latest Updates</span>

        <ul className="mt-5 space-y-1">
          {notifications.slice(0, 4).map((notification, index) => (
            <li
              key={index}
              className="py-3 px-5 border rounded-lg border-gray-300 text-gray-800 font-medium grid grid-cols-2 md:grid-cols-3
                       transition-colors duration-200 hover:bg-gray-100 group"
            >
              <span className="text-sm">{notification.message}</span>
              <div className="items-center hidden md:flex">
                <LuCircleUserRound size={22} />
                <span className="ml-3 text-sm">System</span>
              </div>
              <span className="text-sm text-gray-600 text-right">
                {new Date(notification.createdAt).toDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </Wrapper>
  );
}
